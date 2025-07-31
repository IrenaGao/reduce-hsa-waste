'use client';

import React, { useState } from "react";
import Marketplace from "@/features/marketplace/Marketplace";
import Dashboard from "@/features/dashboard/Dashboard";

export default function Home() {
  const [view, setView] = useState<'marketplace' | 'dashboard'>('marketplace');

  return (
    <main className="min-h-screen bg-blue-50">
      {/* Header with Sagas Health branding */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Sagas Health</h1>
                <p className="text-sm text-blue-600">HSA Wellness Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-4">
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                  view === 'marketplace' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setView('marketplace')}
              >
                Marketplace
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                  view === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setView('dashboard')}
              >
                Dashboard
              </button>
            </nav>
          </div>
        </div>
      </header>
      <div className="py-8">
        {view === 'marketplace' ? <Marketplace /> : <Dashboard />}
        </div>
      </main>
  );
}
