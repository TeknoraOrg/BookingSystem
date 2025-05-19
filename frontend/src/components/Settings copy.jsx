// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      enabled: true,
      newBookings: true,
      cancellations: true,
      reminders: true,
      marketing: false
    },
    smsReminders: {
      enabled: true,
      clientReminders: true,
      staffReminders: true,
      timeBeforeAppointment: 24 // hours
    },
    pushNotifications: {
      enabled: true,
      browserNotifications: true,
      mobileApp: true,
      desktop: true
    },
    twoWayMessaging: {
      enabled: true,
      autoResponder: false,
      businessHoursOnly: true
    }
  });

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState({
    businessInfo: {
      name: 'BookMe Business',
      email: 'admin@bookme.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345',
      timezone: 'America/New_York',
      currency: 'USD'
    },
    operatingHours: {
      monday: { enabled: true, start: '09:00', end: '17:00' },
      tuesday: { enabled: true, start: '09:00', end: '17:00' },
      wednesday: { enabled: true, start: '09:00', end: '17:00' },
      thursday: { enabled: true, start: '09:00', end: '17:00' },
      friday: { enabled: true, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '10:00', end: '15:00' },
      sunday: { enabled: false, start: '10:00', end: '15:00' }
    },
    bookingRules: {
      advanceBooking: 24, // hours
      cancellationPolicy: 24, // hours
      maxBookingsPerDay: 10,
      allowDoubleBooking: false,
      requireConfirmation: true
    }
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      logo: null,
      favicon: null
    },
    theme: {
      mode: 'light', // light, dark, auto
      customCSS: ''
    },
    booking_page: {
      layout: 'modern', // modern, classic, minimal
      showBusinessInfo: true,
      customMessage: 'Welcome! Please select your preferred time slot.',
      termsAndConditions: false,
      privacyPolicy: false
    }
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    calendar: {
      googleCalendar: { enabled: false, synced: false },
      outlookCalendar: { enabled: false, synced: false },
      appleCalendar: { enabled: false, synced: false }
    },
    paymentGateways: {
      stripe: { enabled: false, publicKey: '', secretKey: '' },
      paypal: { enabled: false, clientId: '', clientSecret: '' },
      square: { enabled: false, appId: '', accessToken: '' }
    },
    emailService: {
      provider: 'default', // default, sendgrid, mailchimp, etc.
      apiKey: '',
      sendFromEmail: 'noreply@bookme.com',
      sendFromName: 'BookMe'
    },
    webhooks: {
      newBooking: '',
      cancellation: '',
      modification: ''
    }
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    authentication: {
      twoFactorAuth: false,
      passwordPolicy: 'medium', // weak, medium, strong
      sessionTimeout: 60 // minutes
    },
    dataProtection: {
      dataRetention: 365, // days
      autoDeleteCancelled: true,
      encryptSensitiveData: true,
      gdprCompliance: true
    },
    accessControl: {
      allowedIPs: [],
      blockSuspiciousActivity: true,
      loginAttempts: 5
    }
  });
  // Load settings from storage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedNotifications = localStorage.getItem('bookme_notification_settings');
        const savedBusiness = localStorage.getItem('bookme_business_settings');
        const savedAppearance = localStorage.getItem('bookme_appearance_settings');
        const savedIntegrations = localStorage.getItem('bookme_integration_settings');
        const savedSecurity = localStorage.getItem('bookme_security_settings');

        if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications));
        if (savedBusiness) setBusinessSettings(JSON.parse(savedBusiness));
        if (savedAppearance) setAppearanceSettings(JSON.parse(savedAppearance));
        if (savedIntegrations) setIntegrationSettings(JSON.parse(savedIntegrations));
        if (savedSecurity) setSecuritySettings(JSON.parse(savedSecurity));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save all settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('bookme_notification_settings', JSON.stringify(notificationSettings));
      localStorage.setItem('bookme_business_settings', JSON.stringify(businessSettings));
      localStorage.setItem('bookme_appearance_settings', JSON.stringify(appearanceSettings));
      localStorage.setItem('bookme_integration_settings', JSON.stringify(integrationSettings));
      localStorage.setItem('bookme_security_settings', JSON.stringify(securitySettings));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Update nested state helper
  const updateNestedState = (setter, section, key, value) => {
    setter(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };
  // Render notification settings
  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
        {t('settings.notifications.title')}
      </h3>
      
      {/* Email Notifications Card */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.208a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
              {t('settings.notifications.emailNotifications.title')}
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('settings.notifications.emailNotifications.description')}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-primary)' }}>
              {t('settings.notifications.emailNotifications.enable')}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationSettings.emailNotifications.enabled}
                onChange={(e) => updateNestedState(setNotificationSettings, 'emailNotifications', 'enabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {notificationSettings.emailNotifications.enabled && (
            <>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.emailNotifications.newBookings')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.emailNotifications.newBookings}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'emailNotifications', 'newBookings', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.emailNotifications.cancellations')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.emailNotifications.cancellations}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'emailNotifications', 'cancellations', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.emailNotifications.reminders')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.emailNotifications.reminders}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'emailNotifications', 'reminders', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
      {/* SMS Reminders Card */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
              {t('settings.notifications.smsReminders.title')}
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('settings.notifications.smsReminders.description')}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-primary)' }}>
              {t('settings.notifications.smsReminders.enable')}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationSettings.smsReminders.enabled}
                onChange={(e) => updateNestedState(setNotificationSettings, 'smsReminders', 'enabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {notificationSettings.smsReminders.enabled && (
            <>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.smsReminders.clientReminders')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.smsReminders.clientReminders}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'smsReminders', 'clientReminders', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.smsReminders.staffReminders')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.smsReminders.staffReminders}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'smsReminders', 'staffReminders', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.smsReminders.timeBeforeAppointment')}
                </span>
                <select
                  value={notificationSettings.smsReminders.timeBeforeAppointment}
                  onChange={(e) => updateNestedState(setNotificationSettings, 'smsReminders', 'timeBeforeAppointment', parseInt(e.target.value))}
                  className="px-3 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                >
                  <option value={1}>{t('settings.notifications.smsReminders.options.1hour')}</option>
                  <option value={2}>{t('settings.notifications.smsReminders.options.2hours')}</option>
                  <option value={4}>{t('settings.notifications.smsReminders.options.4hours')}</option>
                  <option value={24}>{t('settings.notifications.smsReminders.options.24hours')}</option>
                  <option value={48}>{t('settings.notifications.smsReminders.options.48hours')}</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Push Notifications Card */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
              {t('settings.notifications.pushNotifications.title')}
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('settings.notifications.pushNotifications.description')}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-primary)' }}>
              {t('settings.notifications.pushNotifications.enable')}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationSettings.pushNotifications.enabled}
                onChange={(e) => updateNestedState(setNotificationSettings, 'pushNotifications', 'enabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {notificationSettings.pushNotifications.enabled && (
            <>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.pushNotifications.browserNotifications')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.pushNotifications.browserNotifications}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'pushNotifications', 'browserNotifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.pushNotifications.mobileApp')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.pushNotifications.mobileApp}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'pushNotifications', 'mobileApp', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.pushNotifications.desktop')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.pushNotifications.desktop}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'pushNotifications', 'desktop', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
      </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-primary)' }}>
              {t('settings.notifications.twoWayMessaging.enable')}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationSettings.twoWayMessaging.enabled}
                onChange={(e) => updateNestedState(setNotificationSettings, 'twoWayMessaging', 'enabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {notificationSettings.twoWayMessaging.enabled && (
            <>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.twoWayMessaging.autoResponder')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.twoWayMessaging.autoResponder}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'twoWayMessaging', 'autoResponder', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>
                  {t('settings.notifications.twoWayMessaging.businessHoursOnly')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.twoWayMessaging.businessHoursOnly}
                    onChange={(e) => updateNestedState(setNotificationSettings, 'twoWayMessaging', 'businessHoursOnly', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
  // Render business settings
  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
        {t('settings.business.title')}
      </h3>
      
      {/* Business Information */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.business.businessInfo.title')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.business.businessInfo.name')}
            </label>
            <input
              type="text"
              value={businessSettings.businessInfo.name}
              onChange={(e) => updateNestedState(setBusinessSettings, 'businessInfo', 'name', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.business.businessInfo.email')}
            </label>
            <input
              type="email"
              value={businessSettings.businessInfo.email}
              onChange={(e) => updateNestedState(setBusinessSettings, 'businessInfo', 'email', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.business.businessInfo.phone')}
            </label>
            <input
              type="tel"
              value={businessSettings.businessInfo.phone}
              onChange={(e) => updateNestedState(setBusinessSettings, 'businessInfo', 'phone', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.business.businessInfo.timezone')}
            </label>
            <select
              value={businessSettings.businessInfo.timezone}
              onChange={(e) => updateNestedState(setBusinessSettings, 'businessInfo', 'timezone', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            >
              <option value="America/New_York">{t('settings.business.businessInfo.timezones.eastern')}</option>
              <option value="America/Chicago">{t('settings.business.businessInfo.timezones.central')}</option>
              <option value="America/Denver">{t('settings.business.businessInfo.timezones.mountain')}</option>
              <option value="America/Los_Angeles">{t('settings.business.businessInfo.timezones.pacific')}</option>
              <option value="Europe/London">{t('settings.business.businessInfo.timezones.london')}</option>
              <option value="Europe/Berlin">{t('settings.business.businessInfo.timezones.berlin')}</option>
              <option value="Europe/Paris">{t('settings.business.businessInfo.timezones.paris')}</option>
              <option value="Asia/Tokyo">{t('settings.business.businessInfo.timezones.tokyo')}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.business.businessInfo.address')}
            </label>
            <input
              type="text"
              value={businessSettings.businessInfo.address}
              onChange={(e) => updateNestedState(setBusinessSettings, 'businessInfo', 'address', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </div>
      {/* Operating Hours */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.business.operatingHours.title')}
        </h4>
        <div className="space-y-3">
          {Object.entries(businessSettings.operatingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-20">
                <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                  {t(`settings.business.operatingHours.days.${day}`)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={hours.enabled}
                    onChange={(e) => setBusinessSettings(prev => ({
                      ...prev,
                      operatingHours: {
                        ...prev.operatingHours,
                        [day]: { ...hours, enabled: e.target.checked }
                      }
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
                {hours.enabled && (
                  <>
                    <input
                      type="time"
                      value={hours.start}
                      onChange={(e) => setBusinessSettings(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: { ...hours, start: e.target.value }
                        }
                      }))}
                      className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {t('settings.business.operatingHours.to')}
                    </span>
                    <input
                      type="time"
                      value={hours.end}
                      onChange={(e) => setBusinessSettings(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: { ...hours, end: e.target.value }
                        }
                      }))}
                      className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Booking Rules */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.business.bookingRules.title')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.business.bookingRules.advanceBooking')}
            </label>
            <input
              type="number"
              value={businessSettings.bookingRules.advanceBooking}
              onChange={(e) => updateNestedState(setBusinessSettings, 'bookingRules', 'advanceBooking', parseInt(e.target.value))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.business.bookingRules.cancellationPolicy')}
            </label>
            <input
              type="number"
              value={businessSettings.bookingRules.cancellationPolicy}
              onChange={(e) => updateNestedState(setBusinessSettings, 'bookingRules', 'cancellationPolicy', parseInt(e.target.value))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.business.bookingRules.maxBookingsPerDay')}
            </label>
            <input
              type="number"
              value={businessSettings.bookingRules.maxBookingsPerDay}
              onChange={(e) => updateNestedState(setBusinessSettings, 'bookingRules', 'maxBookingsPerDay', parseInt(e.target.value))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowDoubleBooking"
                checked={businessSettings.bookingRules.allowDoubleBooking}
                onChange={(e) => updateNestedState(setBusinessSettings, 'bookingRules', 'allowDoubleBooking', e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="allowDoubleBooking" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('settings.business.bookingRules.allowDoubleBooking')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requireConfirmation"
                checked={businessSettings.bookingRules.requireConfirmation}
                onChange={(e) => updateNestedState(setBusinessSettings, 'bookingRules', 'requireConfirmation', e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="requireConfirmation" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('settings.business.bookingRules.requireConfirmation')}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Render appearance settings
  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
        {t('settings.appearance.title')}
      </h3>
      
      {/* Branding */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.appearance.branding.title')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.appearance.branding.primaryColor')}
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={appearanceSettings.branding.primaryColor}
                onChange={(e) => updateNestedState(setAppearanceSettings, 'branding', 'primaryColor', e.target.value)}
                className="w-16 h-10 border rounded-md cursor-pointer"
                style={{ borderColor: 'var(--border)' }}
              />
              <input
                type="text"
                value={appearanceSettings.branding.primaryColor}
                onChange={(e) => updateNestedState(setAppearanceSettings, 'branding', 'primaryColor', e.target.value)}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('settings.appearance.branding.secondaryColor')}
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={appearanceSettings.branding.secondaryColor}
                onChange={(e) => updateNestedState(setAppearanceSettings, 'branding', 'secondaryColor', e.target.value)}
                className="w-16 h-10 border rounded-md cursor-pointer"
                style={{ borderColor: 'var(--border)' }}
              />
              <input
                type="text"
                value={appearanceSettings.branding.secondaryColor}
                onChange={(e) => updateNestedState(setAppearanceSettings, 'branding', 'secondaryColor', e.target.value)}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            {t('settings.appearance.branding.logoUpload')}
          </label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: 'var(--border)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t('settings.appearance.branding.logoUploadText')}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('settings.appearance.branding.logoUploadFormats')}
            </p>
          </div>
        </div>
      </div>
      {/* Theme Settings */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.appearance.theme.title')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.appearance.theme.mode')}
            </label>
            <div className="flex space-x-4">
              {['light', 'dark', 'auto'].map(mode => (
                <label key={mode} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="themeMode"
                    value={mode}
                    checked={appearanceSettings.theme.mode === mode}
                    onChange={(e) => updateNestedState(setAppearanceSettings, 'theme', 'mode', e.target.value)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-sm capitalize" style={{ color: 'var(--text-primary)' }}>
                    {t(`settings.appearance.theme.${mode}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.appearance.theme.customCSS')}
            </label>
            <textarea
              value={appearanceSettings.theme.customCSS}
              onChange={(e) => updateNestedState(setAppearanceSettings, 'theme', 'customCSS', e.target.value)}
              rows={6}
              placeholder={t('settings.appearance.theme.customCSSPlaceholder')}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </div>
      {/* Theme Settings */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.appearance.theme.title')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.appearance.theme.mode')}
            </label>
            <div className="flex space-x-4">
              {['light', 'dark', 'auto'].map(mode => (
                <label key={mode} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="themeMode"
                    value={mode}
                    checked={appearanceSettings.theme.mode === mode}
                    onChange={(e) => updateNestedState(setAppearanceSettings, 'theme', 'mode', e.target.value)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-sm capitalize" style={{ color: 'var(--text-primary)' }}>
                    {t(`settings.appearance.theme.${mode}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.appearance.theme.customCSS')}
            </label>
            <textarea
              value={appearanceSettings.theme.customCSS}
              onChange={(e) => updateNestedState(setAppearanceSettings, 'theme', 'customCSS', e.target.value)}
              rows={6}
              placeholder={t('settings.appearance.theme.customCSSPlaceholder')}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </div>
      {/* Booking Page Settings */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.appearance.bookingPage.title')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.appearance.bookingPage.layout')}
            </label>
            <select
              value={appearanceSettings.booking_page.layout}
              onChange={(e) => updateNestedState(setAppearanceSettings, 'booking_page', 'layout', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            >
              <option value="modern">{t('settings.appearance.bookingPage.layoutOptions.modern')}</option>
              <option value="classic">{t('settings.appearance.bookingPage.layoutOptions.classic')}</option>
              <option value="minimal">{t('settings.appearance.bookingPage.layoutOptions.minimal')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.appearance.bookingPage.customMessage')}
            </label>
            <textarea
              value={appearanceSettings.booking_page.customMessage}
              onChange={(e) => updateNestedState(setAppearanceSettings, 'booking_page', 'customMessage', e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showBusinessInfo"
                checked={appearanceSettings.booking_page.showBusinessInfo}
                onChange={(e) => updateNestedState(setAppearanceSettings, 'booking_page', 'showBusinessInfo', e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="showBusinessInfo" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('settings.appearance.bookingPage.showBusinessInfo')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="termsAndConditions"
                checked={appearanceSettings.booking_page.termsAndConditions}
                onChange={(e) => updateNestedState(setAppearanceSettings, 'booking_page', 'termsAndConditions', e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="termsAndConditions" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('settings.appearance.bookingPage.termsAndConditions')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="privacyPolicy"
                checked={appearanceSettings.booking_page.privacyPolicy}
                onChange={(e) => updateNestedState(setAppearanceSettings, 'booking_page', 'privacyPolicy', e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="privacyPolicy" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('settings.appearance.bookingPage.privacyPolicy')}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Render integration settings
  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
        {t('settings.integrations.title')}
      </h3>
      
      {/* Calendar Integration */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.integrations.calendar.title')}
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t('settings.integrations.calendar.googleCalendar')}
                </h5>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {integrationSettings.calendar.googleCalendar.synced 
                    ? t('settings.integrations.calendar.synced') 
                    : t('settings.integrations.calendar.notConnected')
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => updateNestedState(setIntegrationSettings, 'calendar', 'googleCalendar', {
                enabled: !integrationSettings.calendar.googleCalendar.enabled,
                synced: !integrationSettings.calendar.googleCalendar.enabled
              })}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                integrationSettings.calendar.googleCalendar.enabled
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {integrationSettings.calendar.googleCalendar.enabled 
                ? t('settings.integrations.calendar.disconnect') 
                : t('settings.integrations.calendar.connect')
              }
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.208a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t('settings.integrations.calendar.outlookCalendar')}
                </h5>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {integrationSettings.calendar.outlookCalendar.synced 
                    ? t('settings.integrations.calendar.synced') 
                    : t('settings.integrations.calendar.notConnected')
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => updateNestedState(setIntegrationSettings, 'calendar', 'outlookCalendar', {
                enabled: !integrationSettings.calendar.outlookCalendar.enabled,
                synced: !integrationSettings.calendar.outlookCalendar.enabled
              })}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                integrationSettings.calendar.outlookCalendar.enabled
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {integrationSettings.calendar.outlookCalendar.enabled 
                ? t('settings.integrations.calendar.disconnect') 
                : t('settings.integrations.calendar.connect')
              }
            </button>
          </div>
        </div>
      </div>
      {/* Payment Gateways */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.integrations.paymentGateways.title')}
        </h4>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {t('settings.integrations.paymentGateways.stripe.title')}
                  </h5>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {t('settings.integrations.paymentGateways.stripe.description')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={integrationSettings.paymentGateways.stripe.enabled}
                  onChange={(e) => updateNestedState(setIntegrationSettings, 'paymentGateways', 'stripe', {
                    ...integrationSettings.paymentGateways.stripe,
                    enabled: e.target.checked
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {integrationSettings.paymentGateways.stripe.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t('settings.integrations.paymentGateways.stripe.publicKey')}
                  value={integrationSettings.paymentGateways.stripe.publicKey}
                  onChange={(e) => updateNestedState(setIntegrationSettings, 'paymentGateways', 'stripe', {
                    ...integrationSettings.paymentGateways.stripe,
                    publicKey: e.target.value
                  })}
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                />
                <input
                  type="password"
                  placeholder={t('settings.integrations.paymentGateways.stripe.secretKey')}
                  value={integrationSettings.paymentGateways.stripe.secretKey}
                  onChange={(e) => updateNestedState(setIntegrationSettings, 'paymentGateways', 'stripe', {
                    ...integrationSettings.paymentGateways.stripe,
                    secretKey: e.target.value
                  })}
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                />
              </div>
            )}
          </div>

          <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {t('settings.integrations.paymentGateways.paypal.title')}
                  </h5>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {t('settings.integrations.paymentGateways.paypal.description')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={integrationSettings.paymentGateways.paypal.enabled}
                  onChange={(e) => updateNestedState(setIntegrationSettings, 'paymentGateways', 'paypal', {
                    ...integrationSettings.paymentGateways.paypal,
                    enabled: e.target.checked
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {integrationSettings.paymentGateways.paypal.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t('settings.integrations.paymentGateways.paypal.clientId')}
                  value={integrationSettings.paymentGateways.paypal.clientId}
                  onChange={(e) => updateNestedState(setIntegrationSettings, 'paymentGateways', 'paypal', {
                    ...integrationSettings.paymentGateways.paypal,
                    clientId: e.target.value
                  })}
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                />
                <input
                  type="password"
                  placeholder={t('settings.integrations.paymentGateways.paypal.clientSecret')}
                  value={integrationSettings.paymentGateways.paypal.clientSecret}
                  onChange={(e) => updateNestedState(setIntegrationSettings, 'paymentGateways', 'paypal', {
                    ...integrationSettings.paymentGateways.paypal,
                    clientSecret: e.target.value
                  })}
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Email Service */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.integrations.emailService.title')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.integrations.emailService.provider')}
            </label>
            <select
              value={integrationSettings.emailService.provider}
              onChange={(e) => updateNestedState(setIntegrationSettings, 'emailService', 'provider', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            >
              <option value="default">{t('settings.integrations.emailService.providers.default')}</option>
              <option value="sendgrid">{t('settings.integrations.emailService.providers.sendgrid')}</option>
              <option value="mailchimp">{t('settings.integrations.emailService.providers.mailchimp')}</option>
              <option value="aws-ses">{t('settings.integrations.emailService.providers.awsSes')}</option>
            </select>
          </div>
          {integrationSettings.emailService.provider !== 'default' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {t('settings.integrations.emailService.apiKey')}
              </label>
              <input
                type="password"
                value={integrationSettings.emailService.apiKey}
                onChange={(e) => updateNestedState(setIntegrationSettings, 'emailService', 'apiKey', e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {t('settings.integrations.emailService.sendFromEmail')}
              </label>
              <input
                type="email"
                value={integrationSettings.emailService.sendFromEmail}
                onChange={(e) => updateNestedState(setIntegrationSettings, 'emailService', 'sendFromEmail', e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {t('settings.integrations.emailService.sendFromName')}
              </label>
              <input
                type="text"
                value={integrationSettings.emailService.sendFromName}
                onChange={(e) => updateNestedState(setIntegrationSettings, 'emailService', 'sendFromName', e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Webhooks */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.integrations.webhooks.title')}
        </h4>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          {t('settings.integrations.webhooks.description')}
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.integrations.webhooks.newBooking')}
            </label>
            <input
              type="url"
              value={integrationSettings.webhooks.newBooking}
              onChange={(e) => updateNestedState(setIntegrationSettings, 'webhooks', 'newBooking', e.target.value)}
              placeholder={t('settings.integrations.webhooks.placeholders.newBooking')}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.integrations.webhooks.cancellation')}
            </label>
            <input
              type="url"
              value={integrationSettings.webhooks.cancellation}
              onChange={(e) => updateNestedState(setIntegrationSettings, 'webhooks', 'cancellation', e.target.value)}
              placeholder={t('settings.integrations.webhooks.placeholders.cancellation')}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.integrations.webhooks.modification')}
            </label>
            <input
              type="url"
              value={integrationSettings.webhooks.modification}
              onChange={(e) => updateNestedState(setIntegrationSettings, 'webhooks', 'modification', e.target.value)}
              placeholder={t('settings.integrations.webhooks.placeholders.modification')}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
  // Render security settings
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
        {t('settings.security.title')}
      </h3>
      
      {/* Authentication */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.security.authentication.title')}
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {t('settings.security.authentication.twoFactorAuth.title')}
              </h5>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t('settings.security.authentication.twoFactorAuth.description')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={securitySettings.authentication.twoFactorAuth}
                onChange={(e) => updateNestedState(setSecuritySettings, 'authentication', 'twoFactorAuth', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.security.authentication.passwordPolicy.title')}
            </label>
            <select
              value={securitySettings.authentication.passwordPolicy}
              onChange={(e) => updateNestedState(setSecuritySettings, 'authentication', 'passwordPolicy', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            >
              <option value="weak">{t('settings.security.authentication.passwordPolicy.weak')}</option>
              <option value="medium">{t('settings.security.authentication.passwordPolicy.medium')}</option>
              <option value="strong">{t('settings.security.authentication.passwordPolicy.strong')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.security.authentication.sessionTimeout')}
            </label>
            <input
              type="number"
              value={securitySettings.authentication.sessionTimeout}
              onChange={(e) => updateNestedState(setSecuritySettings, 'authentication', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </div>
      {/* Data Protection */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.security.dataProtection.title')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.security.dataProtection.dataRetention.title')}
            </label>
            <input
              type="number"
              value={securitySettings.dataProtection.dataRetention}
              onChange={(e) => updateNestedState(setSecuritySettings, 'dataProtection', 'dataRetention', parseInt(e.target.value))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('settings.security.dataProtection.dataRetention.description')}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t('settings.security.dataProtection.autoDeleteCancelled.title')}
                </h5>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('settings.security.dataProtection.autoDeleteCancelled.description')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.dataProtection.autoDeleteCancelled}
                  onChange={(e) => updateNestedState(setSecuritySettings, 'dataProtection', 'autoDeleteCancelled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t('settings.security.dataProtection.encryptSensitiveData.title')}
                </h5>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('settings.security.dataProtection.encryptSensitiveData.description')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.dataProtection.encryptSensitiveData}
                  onChange={(e) => updateNestedState(setSecuritySettings, 'dataProtection', 'encryptSensitiveData', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t('settings.security.dataProtection.gdprCompliance.title')}
                </h5>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('settings.security.dataProtection.gdprCompliance.description')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.dataProtection.gdprCompliance}
                  onChange={(e) => updateNestedState(setSecuritySettings, 'dataProtection', 'gdprCompliance', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Access Control */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h4 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('settings.security.accessControl.title')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.security.accessControl.allowedIPs.title')}
            </label>
            <textarea
              value={securitySettings.accessControl.allowedIPs.join('\n')}
              onChange={(e) => updateNestedState(setSecuritySettings, 'accessControl', 'allowedIPs', 
                e.target.value.split('\n').filter(ip => ip.trim()))}
              placeholder={t('settings.security.accessControl.allowedIPs.placeholder')}
              rows={4}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {t('settings.security.accessControl.blockSuspiciousActivity.title')}
              </h5>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t('settings.security.accessControl.blockSuspiciousActivity.description')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={securitySettings.accessControl.blockSuspiciousActivity}
                onChange={(e) => updateNestedState(setSecuritySettings, 'accessControl', 'blockSuspiciousActivity', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('settings.security.accessControl.loginAttempts.title')}
            </label>
            <input
              type="number"
              value={securitySettings.accessControl.loginAttempts}
              onChange={(e) => updateNestedState(setSecuritySettings, 'accessControl', 'loginAttempts', parseInt(e.target.value))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('settings.security.accessControl.loginAttempts.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  // Main render function
  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Settings Sidebar */}
      <div className="w-64 border-r overflow-y-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('settings.title')}
          </h2>
          <nav className="space-y-1">
            {[
              { id: 'notifications', label: t('settings.sections.notifications'), icon: '🔔' },
              { id: 'business', label: t('settings.sections.business'), icon: '🏢' },
              { id: 'appearance', label: t('settings.sections.appearance'), icon: '🎨' },
              { id: 'integrations', label: t('settings.sections.integrations'), icon: '🔗' },
              { id: 'security', label: t('settings.sections.security'), icon: '🔒' }
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                style={activeSection !== section.id ? { color: 'var(--text-primary)' } : {}}
              >
                <span className="mr-3">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative">
              <span className="block sm:inline">{t('settings.saveSuccess')}</span>
            </div>
          )}

          {/* Render Active Section */}
          {activeSection === 'notifications' && renderNotificationSettings()}
          {activeSection === 'business' && renderBusinessSettings()}
          {activeSection === 'appearance' && renderAppearanceSettings()}
          {activeSection === 'integrations' && renderIntegrationSettings()}
          {activeSection === 'security' && renderSecuritySettings()}

          {/* Save Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => {
                setNotificationSettings({
                  emailNotifications: { enabled: true, newBookings: true, cancellations: true, reminders: true, marketing: false },
                  smsReminders: { enabled: true, clientReminders: true, staffReminders: true, timeBeforeAppointment: 24 },
                  pushNotifications: { enabled: true, browserNotifications: true, mobileApp: true, desktop: true },
                  twoWayMessaging: { enabled: true, autoResponder: false, businessHoursOnly: true }
                });
                setBusinessSettings({
                  businessInfo: { name: 'BookMe Business', email: 'admin@bookme.com', phone: '+1 (555) 123-4567', address: '123 Main St, City, State 12345', timezone: 'America/New_York', currency: 'USD' },
                  operatingHours: {
                    monday: { enabled: true, start: '09:00', end: '17:00' },
                    tuesday: { enabled: true, start: '09:00', end: '17:00' },
                    wednesday: { enabled: true, start: '09:00', end: '17:00' },
                    thursday: { enabled: true, start: '09:00', end: '17:00' },
                    friday: { enabled: true, start: '09:00', end: '17:00' },
                    saturday: { enabled: false, start: '10:00', end: '15:00' },
                    sunday: { enabled: false, start: '10:00', end: '15:00' }
                  },
                  bookingRules: { advanceBooking: 24, cancellationPolicy: 24, maxBookingsPerDay: 10, allowDoubleBooking: false, requireConfirmation: true }
                });
                setAppearanceSettings({
                  branding: { primaryColor: '#3B82F6', secondaryColor: '#10B981', logo: null, favicon: null },
                  theme: { mode: 'light', customCSS: '' },
                  booking_page: { layout: 'modern', showBusinessInfo: true, customMessage: 'Welcome! Please select your preferred time slot.', termsAndConditions: false, privacyPolicy: false }
                });
                setIntegrationSettings({
                  calendar: { googleCalendar: { enabled: false, synced: false }, outlookCalendar: { enabled: false, synced: false }, appleCalendar: { enabled: false, synced: false } },
                  paymentGateways: { stripe: { enabled: false, publicKey: '', secretKey: '' }, paypal: { enabled: false, clientId: '', clientSecret: '' }, square: { enabled: false, appId: '', accessToken: '' } },
                  emailService: { provider: 'default', apiKey: '', sendFromEmail: 'noreply@bookme.com', sendFromName: 'BookMe' },
                  webhooks: { newBooking: '', cancellation: '', modification: '' }
                });
                setSecuritySettings({
                  authentication: { twoFactorAuth: false, passwordPolicy: 'medium', sessionTimeout: 60 },
                  dataProtection: { dataRetention: 365, autoDeleteCancelled: true, encryptSensitiveData: true, gdprCompliance: true },
                  accessControl: { allowedIPs: [], blockSuspiciousActivity: true, loginAttempts: 5 }
                });
              }}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {t('settings.resetToDefaults')}
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                isSaving ? 'cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('settings.saving')}
                </>
              ) : (
                t('settings.saveChanges')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;