'use client'

import React, { useState } from 'react';
// Make sure the import path is correct
import AboutForm from './AboutForm';

function AboutManager() {
    const [activeTab, setActiveTab] = useState('MAIN');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Manage About Content</h1>

                <div className="border-b border-gray-200 mb-6">
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab('MAIN')}
                            className={`py-2 px-4 text-sm font-medium border-b-2 ${
                                activeTab === 'MAIN'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Main About Page
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('HOME')}
                            className={`py-2 px-4 text-sm font-medium border-b-2 ${
                                activeTab === 'HOME'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Homepage About
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    {activeTab === 'MAIN' && <AboutForm type="MAIN" />}
                    {activeTab === 'HOME' && <AboutForm type="HOME" />}
                </div>
            </div>
        </div>
    );
}

export default AboutManager;