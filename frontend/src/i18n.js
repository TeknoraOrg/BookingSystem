// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define translations
const resources = {
  en: {
    translation: {
      'app.title': 'BookMe',
      'app.clientView': 'Client View',
      'app.adminView': 'Admin View',
      'booking.selectDate': 'Select Date',
      'booking.selectTime': 'Select Time',
      'booking.yourDetails': 'Your Details',
      'booking.confirmation': 'Confirmation',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.save': 'Save',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.success': 'Success'
      // Add more translations as needed
    }
  },
  de: {
    translation: {
      'app.title': 'BookMe',
      'app.clientView': 'Kundenansicht',
      'app.adminView': 'Admin-Ansicht',
      'booking.selectDate': 'Datum auswählen',
      'booking.selectTime': 'Zeit auswählen',
      'booking.yourDetails': 'Ihre Angaben',
      'booking.confirmation': 'Bestätigung',
      'common.yes': 'Ja',
      'common.no': 'Nein', 
      'common.cancel': 'Abbrechen',
      'common.confirm': 'Bestätigen',
      'common.save': 'Speichern',
      'common.back': 'Zurück',
      'common.next': 'Weiter',
      'common.loading': 'Laden...',
      'common.error': 'Ein Fehler ist aufgetreten',
      'common.success': 'Erfolgreich'
      // Add more translations from your German file
    }
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;