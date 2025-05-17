import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative ml-4">
      <button
        onClick={toggleDropdown}
        className="flex items-center p-2 rounded-md"
        style={{ 
          backgroundColor: 'var(--background)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border)',
          borderWidth: '1px'
        }}
      >
        <span className="mr-2 text-lg">{currentLanguage.flag}</span>
        <span className="mr-1">{currentLanguage.code.toUpperCase()}</span>
        <svg 
          className="w-4 h-4"
          style={{ color: 'var(--text-secondary)' }} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 rounded-md shadow-lg z-50"
          style={{ 
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            borderWidth: '1px',
            width: '160px'
          }}
        >
          <div className="py-1">
            {languages.map(language => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className="flex items-center w-full px-4 py-2 text-left"
                style={{
                  backgroundColor: currentLanguage.code === language.code ? 'var(--background)' : 'transparent',
                  color: 'var(--text-primary)'
                }}
              >
                <span className="mr-2 text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;