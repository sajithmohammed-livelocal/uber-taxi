import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      tabs: {
        home: 'Home',
        trips: 'Trips',
        wallet: 'Wallet',
        profile: 'Profile',
      },
      
      // Common
      buttons: {
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        continue: 'Continue',
        requestRide: 'Request Ride',
        sos: 'SOS',
      },
      
      // Trip Types
      tripTypes: {
        now: 'Now',
        schedule: 'Schedule',
        cityToCity: 'City to City',
        hourly: 'Hourly',
      },
      
      // Labels
      labels: {
        yourLocation: 'Your Location',
        estimatedFare: 'Estimated Fare',
        basefare: 'Base fare',
        distance: 'Distance',
      },
      
      // Placeholders
      placeholders: {
        whereTo: 'Where to?',
        searchDestination: 'Search destination...',
      },
      
      // Alerts
      alerts: {
        error: 'Error',
        success: 'Success',
        selectDestination: 'Please select a destination',
        tripRequested: 'Trip requested successfully!',
        requestFailed: 'Failed to request trip. Please try again.',
        loadWalletFailed: 'Failed to load wallet data',
      },
      
      // Trip Status
      tripStatus: {
        completed: 'Completed',
        cancelled: 'Cancelled',
        inProgress: 'In Progress',
        requested: 'Requested',
      },
      
      // Filters
      filters: {
        all: 'All',
        completed: 'Completed',
        cancelled: 'Cancelled',
        ongoing: 'Ongoing',
      },
      
      // Trips
      trips: {
        title: 'Your Trips',
        noTrips: 'No trips yet',
        noTripsDescription: 'Your trip history will appear here once you start riding with AfriRide.',
      },
      
      // Wallet
      wallet: {
        title: 'Wallet',
        currentBalance: 'Current Balance',
        topUp: 'Top Up',
        paymentMethods: 'Payment Methods',
        addPaymentMethod: 'Add Payment Method',
        selectPaymentType: 'Select payment method type',
        paymentMethodAdded: 'Payment method added successfully',
        addFirst: 'Add your first payment method',
        default: 'Default',
        card: 'Card',
        recentTransactions: 'Recent Transactions',
        noTransactions: 'No transactions yet',
        selectAmount: 'Select top-up amount',
        topUpSuccess: 'Wallet topped up successfully!',
        topUpFailed: 'Top-up failed. Please try again.',
      },
      
      // Profile
      profile: {
        title: 'Profile',
        rating: 'Rating',
        trips: 'Trips',
        notifications: 'Notifications',
        language: 'Language',
        selectLanguage: 'Select Language',
        safety: 'Safety & Privacy',
        help: 'Help & Support',
        logout: 'Log Out',
        logoutConfirmation: 'Are you sure you want to log out?',
        madeWithLove: 'Made with ❤️ in Gabon',
      },
    },
  },
  
  fr: {
    translation: {
      // Navigation
      tabs: {
        home: 'Accueil',
        trips: 'Trajets',
        wallet: 'Portefeuille',
        profile: 'Profil',
      },
      
      // Common
      buttons: {
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Enregistrer',
        continue: 'Continuer',
        requestRide: 'Demander une course',
        sos: 'SOS',
      },
      
      // Trip Types
      tripTypes: {
        now: 'Maintenant',
        schedule: 'Planifier',
        cityToCity: 'Ville à ville',
        hourly: 'À l\'heure',
      },
      
      // Labels
      labels: {
        yourLocation: 'Votre position',
        estimatedFare: 'Tarif estimé',
        basefare: 'Tarif de base',
        distance: 'Distance',
      },
      
      // Placeholders
      placeholders: {
        whereTo: 'Où allez-vous?',
        searchDestination: 'Rechercher destination...',
      },
      
      // Alerts
      alerts: {
        error: 'Erreur',
        success: 'Succès',
        selectDestination: 'Veuillez sélectionner une destination',
        tripRequested: 'Course demandée avec succès!',
        requestFailed: 'Échec de la demande de course. Veuillez réessayer.',
        loadWalletFailed: 'Échec du chargement du portefeuille',
      },
      
      // Trip Status
      tripStatus: {
        completed: 'Terminé',
        cancelled: 'Annulé',
        inProgress: 'En cours',
        requested: 'Demandé',
      },
      
      // Filters
      filters: {
        all: 'Tout',
        completed: 'Terminés',
        cancelled: 'Annulés',
        ongoing: 'En cours',
      },
      
      // Trips
      trips: {
        title: 'Vos trajets',
        noTrips: 'Aucun trajet pour le moment',
        noTripsDescription: 'Votre historique de trajets apparaîtra ici une fois que vous commencerez à utiliser AfriRide.',
      },
      
      // Wallet
      wallet: {
        title: 'Portefeuille',
        currentBalance: 'Solde actuel',
        topUp: 'Recharger',
        paymentMethods: 'Moyens de paiement',
        addPaymentMethod: 'Ajouter un moyen de paiement',
        selectPaymentType: 'Sélectionner le type de paiement',
        paymentMethodAdded: 'Moyen de paiement ajouté avec succès',
        addFirst: 'Ajoutez votre premier moyen de paiement',
        default: 'Par défaut',
        card: 'Carte',
        recentTransactions: 'Transactions récentes',
        noTransactions: 'Aucune transaction pour le moment',
        selectAmount: 'Sélectionner le montant de recharge',
        topUpSuccess: 'Portefeuille rechargé avec succès!',
        topUpFailed: 'Échec de la recharge. Veuillez réessayer.',
      },
      
      // Profile
      profile: {
        title: 'Profil',
        rating: 'Note',
        trips: 'Trajets',
        notifications: 'Notifications',
        language: 'Langue',
        selectLanguage: 'Sélectionner la langue',
        safety: 'Sécurité et confidentialité',
        help: 'Aide et support',
        logout: 'Se déconnecter',
        logoutConfirmation: 'Êtes-vous sûr de vouloir vous déconnecter?',
        madeWithLove: 'Fait avec ❤️ au Gabon',
      },
    },
  },
  
  sw: {
    translation: {
      // Navigation
      tabs: {
        home: 'Nyumbani',
        trips: 'Safari',
        wallet: 'Mkoba',
        profile: 'Profaili',
      },
      
      // Common
      buttons: {
        cancel: 'Ghairi',
        confirm: 'Thibitisha',
        save: 'Hifadhi',
        continue: 'Endelea',
        requestRide: 'Omba safari',
        sos: 'SOS',
      },
      
      // Trip Types
      tripTypes: {
        now: 'Sasa',
        schedule: 'Panga',
        cityToCity: 'Mji hadi mji',
        hourly: 'Kwa saa',
      },
      
      // Labels
      labels: {
        yourLocation: 'Mahali pako',
        estimatedFare: 'Nauli iliyokadiiriwa',
        basefare: 'Nauli ya msingi',
        distance: 'Umbali',
      },
      
      // Placeholders
      placeholders: {
        whereTo: 'Unaenda wapi?',
        searchDestination: 'Tafuta makazi...',
      },
      
      // Alerts
      alerts: {
        error: 'Hitilafu',
        success: 'Mafanikio',
        selectDestination: 'Tafadhali chagua mahali unapoenda',
        tripRequested: 'Safari imeombwa kwa mafanikio!',
        requestFailed: 'Imeshindwa kuomba safari. Tafadhali jaribu tena.',
        loadWalletFailed: 'Imeshindwa kupakia mkoba',
      },
      
      // Trip Status
      tripStatus: {
        completed: 'Imekamilika',
        cancelled: 'Imeghairiwa',
        inProgress: 'Inaendelea',
        requested: 'Imeombwa',
      },
      
      // Filters
      filters: {
        all: 'Zote',
        completed: 'Zilizokamilika',
        cancelled: 'Zilizoghairiwa',
        ongoing: 'Zinaendelea',
      },
      
      // Trips
      trips: {
        title: 'Safari zako',
        noTrips: 'Hakuna safari bado',
        noTripsDescription: 'Historia yako ya safari itaonekana hapa baada ya kuanza kutumia AfriRide.',
      },
      
      // Wallet
      wallet: {
        title: 'Mkoba',
        currentBalance: 'Salio la sasa',
        topUp: 'Jaza',
        paymentMethods: 'Njia za kulipa',
        addPaymentMethod: 'Ongeza njia ya kulipa',
        selectPaymentType: 'Chagua aina ya malipo',
        paymentMethodAdded: 'Njia ya kulipa imeongezwa kwa mafanikio',
        addFirst: 'Ongeza njia yako ya kwanza ya kulipa',
        default: 'Kawaida',
        card: 'Kadi',
        recentTransactions: 'Miamala ya hivi karibuni',
        noTransactions: 'Hakuna miamala bado',
        selectAmount: 'Chagua kiasi cha kujaza',
        topUpSuccess: 'Mkoba umejazwa kwa mafanikio!',
        topUpFailed: 'Imeshindwa kujaza. Tafadhali jaribu tena.',
      },
      
      // Profile
      profile: {
        title: 'Profaili',
        rating: 'Ukadiriaji',
        trips: 'Safari',
        notifications: 'Arifa',
        language: 'Lugha',
        selectLanguage: 'Chagua lugha',
        safety: 'Usalama na faragha',
        help: 'Msaada na usaidizi',
        logout: 'Ondoka',
        logoutConfirmation: 'Je, una uhakika unataka kuondoka?',
        madeWithLove: 'Imetengenezwa kwa ❤️ Gabon',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Default to French for Gabon
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;