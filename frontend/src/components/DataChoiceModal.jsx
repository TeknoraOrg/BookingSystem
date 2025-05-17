// src/components/DataChoiceModal.jsx
import React from 'react';

const DataChoiceModal = ({ onChoose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Welcome to BookMe</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Would you like to start with pre-populated demo data or begin with a clean database?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => onChoose('demo')}
              className="border rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors text-center"
            >
              <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Demo Data</h3>
              <p className="text-sm text-gray-500">
                Pre-populated with bookings, settings, and example data
              </p>
            </div>

            <div 
              onClick={() => onChoose('clean')}
              className="border rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors text-center"
            >
              <div className="w-12 h-12 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Clean Start</h3>
              <p className="text-sm text-gray-500">
                Begin with an empty database and create your own settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataChoiceModal;