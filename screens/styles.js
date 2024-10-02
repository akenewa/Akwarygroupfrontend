import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  // Containers et Layout général
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E0F7FA', // Fond joyeux et frais
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#004D40', // Vert foncé pour header
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },

  // Typographie
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D32F2F', // Texte rouge pour contraste
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b', // Vert pour sous-titres
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 6,
    marginLeft: 5,
  },
  value: {
    fontSize: 14,
    color: '#00695C', // Vert moyen pour textes secondaires
    marginLeft: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F', // Rouge vif pour erreurs
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#004D40',
    marginBottom: 10,
  },

  // Champs de saisie
  input: {
    height: 35,
    width: '80%',
    borderColor: '#B2DFDB',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF', // Fond blanc pour inputs
    fontSize: 14,
    color: '#004D40',
    marginBottom: 10,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none', // Supprime le contour sur web
    }),
  },

  // Recherches
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Fond blanc pour le champ de recherche
    borderColor: '#B2DFDB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '65%',
    height: 35,
  },
  searchIcon: {
    marginRight: 10, // Espacement entre l'icône et l'entrée de texte
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#004D40',
    paddingVertical: 8,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none', // Retirer les contours sur le web
    }),
  },

  // Boutons
  button: {
    backgroundColor: '#007BFF', // Vert vif pour actions
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF', // Blanc pour le texte du bouton
    fontSize: 14,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#0288D1', // Bleu vif
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonhome: {
    backgroundColor: '#0288D1', // Bleu vif pour boutons d'accueil
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonTexthome: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },

  // Styles pour les photos et images
  photoContainer: {
    alignItems: 'center',
    backgroundColor: '#B2EBF2', // Fond plus coloré
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    ...(Platform.OS === 'web' && {
      objectFit: 'cover',
    }),
  },
  image: {
    width: 100,
    height: 115,
    marginBottom: 1,
    borderRadius: 10,
  },
  qrCodeImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  qrCodeImagealone: {
    width: 250,
    height: 250,
    marginTop: 10,
  },

  // Badges et profils
  cardContainer: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 25, // Marge pour espacement
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  cardCompanyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  imageAndQrContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00796B',
    marginBottom: 8,
    padding: 5,
  },
  infoContainer: {
    marginLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  // Pied de page intégré dans la classe cardContainer
  cardFooter: {
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  cardCompanyContact: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },

  // Téléchargement et icônes
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0288D1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },

  // Alertes d'erreur ou de succès
  errorText: {
    color: '#D32F2F', // Rouge vif pour messages d'erreur
    textAlign: 'center',
    marginBottom: 10,
  },

  // Listes
  item: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 1,
    marginLeft: 5,
    textAlign: 'left',
  },
  surname: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
    textAlign: 'left',
  },
  immatriculation: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0', // Fond gris clair
    borderRadius: 8,
    marginTop: 15,
    width: '90%',
  },
  pageButton: {
    fontSize: 16,
    color: '#00796B', // Vert pour les boutons actifs
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E0F7FB', // Fond léger pour bouton
    borderRadius: 5,
    textAlign: 'center',
    minWidth: 100,
  },
  disabled: {
    color: '#B0BEC5', // Gris pour l'état désactivé
    backgroundColor: '#CFD8DC', // Fond gris plus foncé pour l'état désactivé
  },

  // Login
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#B2DFDB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
    maxWidth: 350,
  },

  iconToggle: {
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#00796B', // Vert vif pour le bouton de connexion
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Actions (Édition, Suppression, etc.)
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginHorizontal: 8,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },

  // Location Form
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },

   // Modal container styling
   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },

  // Modal content box
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center', // Center content in modal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Search button style
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#B2DFDB',
    borderWidth: 1,
    width: '90%',
    justifyContent: 'space-between',
  },

  // Icon and button text for search button
  icon: {
    marginRight: 10,
    color: '#757575',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1, // Ensures text takes up available space
    textAlign: 'center', // Centers text in the button
  },

  // List item style inside modal
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#B2DFDB',
    textAlign: 'center', // Center text in the list item
  },

  // Date and time picker button style
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 8,
    marginVertical: 5,
    justifyContent: 'center', // Center items in the button
    width: '45%',
  },
  datePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },

  // Container for date and time pickers
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginVertical: 5,
  },

  // Add button style within modal header
  addButton: {
    marginLeft: 10,
    justifyContent: 'center', // Center "+" button
  },

  // Modal header that contains search input and "+" button
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },

});

export default styles;