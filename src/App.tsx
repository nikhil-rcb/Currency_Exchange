import React from 'react';
import CurrencyConverter from './components/CurrencyConverter';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Currency Exchange
            </h1>
            <p className="text-gray-600">
              Convert currencies with real-time exchange rates
            </p>
          </div>
          
          <CurrencyConverter />
          
          <div className="text-center mt-6 text-xs text-gray-500">
            Exchange rates provided by ExchangeRate-API
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;