import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, FlatList, TouchableOpacity, Text, Modal, Platform } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles';
import moment from 'moment';

export default function LocationForm({ navigation }) {
  const [locataireId, setLocataireId] = useState('');
  const [vehiculeId, setVehiculeId] = useState('');
  const [locataireSearch, setLocataireSearch] = useState('');
  const [vehiculeSearch, setVehiculeSearch] = useState('');
  const [filteredLocataires, setFilteredLocataires] = useState([]);
  const [filteredVehicules, setFilteredVehicules] = useState([]);
  const [locataires, setLocataires] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  
  const [dateDepart, setDateDepart] = useState(new Date());
  const [heureDepart, setHeureDepart] = useState(new Date());
  const [dateRetour, setDateRetour] = useState(new Date());
  const [heureRetour, setHeureRetour] = useState(new Date());
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePickerRetour, setShowDatePickerRetour] = useState(false);
  const [showTimePickerRetour, setShowTimePickerRetour] = useState(false);
  const [showLocataireModal, setShowLocataireModal] = useState(false);
  const [showVehiculeModal, setShowVehiculeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocataires();
    fetchVehicules();
  }, []);

  const fetchLocataires = async () => {
    try {
      const response = await fetch('https://akwarygroup.com/backend/api/locataires.php');
      const data = await response.json();
      setLocataires(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les locataires.');
    }
  };

  const fetchVehicules = async () => {
    try {
      const response = await fetch('https://akwarygroup.com/backend/api/vehicules.php');
      const data = await response.json();
      setVehicules(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les véhicules.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocataireSearch = (text) => {
    setLocataireSearch(text);
    if (text.length >= 3) {
      const filtered = locataires.filter(locataire =>
        locataire.nom.toLowerCase().includes(text.toLowerCase()) ||
        locataire.prenom.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocataires(filtered);
    } else {
      setFilteredLocataires([]);
    }
  };

  const handleVehiculeSearch = (text) => {
    setVehiculeSearch(text);
    if (text.length >= 3) {
      const filtered = vehicules.filter(vehicule =>
        vehicule.vehicule.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredVehicules(filtered);
    } else {
      setFilteredVehicules([]);
    }
  };

  const getColorForStatus = (status) => {
    switch (status) {
      case 'Disponible':
        return 'green';
      case 'Indisponible':
        return 'red';
      case 'En panne':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleSubmit = async () => {
    if (!locataireId || !vehiculeId || !dateDepart || !heureDepart) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    const combinedDateTimeDepart = moment(dateDepart)
      .set({
        hour: moment(heureDepart).get('hour'),
        minute: moment(heureDepart).get('minute'),
      })
      .format('DD-MM-YYYY HH:mm');

    const combinedDateTimeRetour = dateRetour && heureRetour ? moment(dateRetour)
      .set({
        hour: moment(heureRetour).get('hour'),
        minute: moment(heureRetour).get('minute'),
      })
      .format('DD-MM-YYYY HH:mm') : null;

    const formData = {
      locataire_id: locataireId,
      vehicule_id: vehiculeId,
      datetime_depart: combinedDateTimeDepart,
      datetime_retour: combinedDateTimeRetour,
    };

    try {
      const response = await fetch('https://akwarygroup.com/backend/api/locations.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Location ajoutée avec succès.');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', result.message || 'Erreur lors de l’ajout de la location.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la soumission des données.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    setDateDepart(selectedDate || dateDepart);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    setHeureDepart(selectedTime || heureDepart);
  };

  const onChangeDateRetour = (event, selectedDate) => {
    setShowDatePickerRetour(false);
    setDateRetour(selectedDate || dateRetour);
  };

  const onChangeTimeRetour = (event, selectedTime) => {
    setShowTimePickerRetour(false);
    setHeureRetour(selectedTime || heureRetour);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Chargement des données...</Text>
      ) : (
        <>
          <Text style={styles.title}>Ajouter une Location</Text>

          {/* Sélection du locataire */}
          <TouchableOpacity onPress={() => setShowLocataireModal(true)} style={styles.searchButton}>
            <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
            <Text style={styles.buttonText}>{locataireSearch || "Choix du Locataire"}</Text>
          </TouchableOpacity>

          <Modal visible={showLocataireModal} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.searchModalHeader}>
                  <TextInput
                    style={styles.input}
                    placeholder="Rechercher un locataire"
                    value={locataireSearch}
                    onChangeText={handleLocataireSearch}
                  />
                  <TouchableOpacity onPress={() => navigation.navigate('LocataireForm')} style={styles.addButton}>
                    <FontAwesome name="plus" size={24} color="green" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={filteredLocataires}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                      setLocataireId(item.id);
                      setLocataireSearch(`${item.nom} ${item.prenom}`);
                      setShowLocataireModal(false);
                    }}>
                      <Text style={styles.listItem}>{item.nom} {item.prenom}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Button title="Fermer" onPress={() => setShowLocataireModal(false)} />
              </View>
            </View>
          </Modal>

          {/* Sélection du véhicule */}
          <TouchableOpacity onPress={() => setShowVehiculeModal(true)} style={styles.searchButton}>
            <MaterialIcons name="directions-car" size={20} color="gray" style={styles.icon} />
            <Text style={styles.buttonText}>{vehiculeSearch || "Choix du véhicule"}</Text>
          </TouchableOpacity>

          <Modal visible={showVehiculeModal} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.searchModalHeader}>
                  <TextInput
                    style={styles.input}
                    placeholder="Rechercher un véhicule"
                    value={vehiculeSearch}
                    onChangeText={handleVehiculeSearch}
                  />
                  <TouchableOpacity onPress={() => navigation.navigate('VehiculeForm')} style={styles.addButton}>
                    <FontAwesome name="plus" size={24} color="green" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={filteredVehicules}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                      setVehiculeId(item.id);
                      setVehiculeSearch(item.vehicule);
                      setShowVehiculeModal(false);
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: getColorForStatus(item.statut), marginRight: 10 }} />
                        <Text style={styles.listItem}>{item.vehicule}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
                <Button title="Fermer" onPress={() => setShowVehiculeModal(false)} />
              </View>
            </View>
          </Modal>

          {/* Date et Heure de Départ */}
          <Text style={styles.subtitle}>Date et Heure de Départ</Text>
          <View style={styles.datetimeContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <MaterialIcons name="event" size={24} color="white" />
              <Text style={styles.datePickerText}>
                {moment(dateDepart).format('DD-MM-YYYY')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateDepart}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
              />
            )}

            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePickerButton}>
              <MaterialIcons name="access-time" size={24} color="white" />
              <Text style={styles.datePickerText}>
                {moment(heureDepart).format('HH:mm')}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={heureDepart}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTime}
              />
            )}
          </View>

          {/* Date et Heure de Retour */}
          <Text style={styles.subtitle}>Date et Heure de Retour</Text>
          <View style={styles.datetimeContainer}>
            <TouchableOpacity onPress={() => setShowDatePickerRetour(true)} style={styles.datePickerButton}>
              <MaterialIcons name="event" size={24} color="white" />
              <Text style={styles.datePickerText}>
                {moment(dateRetour).format('DD-MM-YYYY')}
              </Text>
            </TouchableOpacity>
            {showDatePickerRetour && (
              <DateTimePicker
                value={dateRetour}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDateRetour}
              />
            )}

            <TouchableOpacity onPress={() => setShowTimePickerRetour(true)} style={styles.datePickerButton}>
              <MaterialIcons name="access-time" size={24} color="white" />
              <Text style={styles.datePickerText}>
                {moment(heureRetour).format('HH:mm')}
              </Text>
            </TouchableOpacity>
            {showTimePickerRetour && (
              <DateTimePicker
                value={heureRetour}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTimeRetour}
              />
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Ajouter Location</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}