'use client';

import React, { useState } from 'react';

interface CheckoutPageProps {
  service: {
    id: number;
    name: string;
    category: string;
    price: number;
    eligible: boolean;
    image: string;
    coordinates: [number, number];
    address: string;
  };
  appointmentDetails: {
    date: string;
    time: string;
    paymentMethod: string;
  };
  onBack: () => void;
  onProceed: (checkoutData: Record<string, unknown>) => void;
}

// Service-specific health conditions
const getHealthConditionsByService = (serviceCategory: string) => {
  switch (serviceCategory) {
    case 'MedSpa':
      return [
        'Acne and skin conditions',
        'Hair removal concerns',
        'Anti-aging treatments',
        'Skin texture issues',
        'Pigmentation problems',
        'Scar treatment',
        'Rosacea',
        'Sun damage',
        'Wrinkles and fine lines',
        'Cellulite',
        'Stretch marks',
        'None of the above'
      ];
    case 'Acupuncture':
      return [
        'Chronic pain',
        'Anxiety and stress',
        'Insomnia',
        'Digestive issues',
        'Headaches and migraines',
        'Back and neck pain',
        'Arthritis',
        'Fertility concerns',
        'Menstrual issues',
        'Respiratory problems',
        'Immune system support',
        'Smoking cessation',
        'None of the above'
      ];
    case 'Massage':
      return [
        'Muscle tension and stiffness',
        'Back and neck pain',
        'Stress and anxiety',
        'Sports injuries',
        'Postural problems',
        'Circulation issues',
        'Headaches',
        'Insomnia',
        'Fibromyalgia',
        'Arthritis',
        'Recovery from surgery',
        'Pregnancy-related discomfort',
        'None of the above'
      ];
    default:
      return [
        'Chronic pain',
        'Stress and anxiety',
        'Skin conditions',
        'Digestive issues',
        'Sleep problems',
        'None of the above'
      ];
  }
};

// Top HSA providers
const hsaProviders = [
  'Fidelity Investments',
  'HealthEquity',
  'Optum Bank',
  'Bank of America',
  'Wells Fargo',
  'U.S. Bank',
  'Lively',
  'Further',
  'HSA Bank',
  'SelectAccount',
  'Other'
];

export default function CheckoutPage({ service, appointmentDetails, onBack, onProceed }: CheckoutPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // HSA Information
    hsaProvider: '',
    hsaBalance: '',
    
    // Health Information
    hasHealthConditions: '',
    selectedHealthCondition: '',
    healthConditions: '',
    
    // Service Specific
    serviceHistory: '',
    treatmentGoals: '',
    painLevel: '',
    
    // Insurance
    insuranceProvider: '',
    insuranceNumber: '',
    groupNumber: '',
    
    // Payment
    paymentMethod: appointmentDetails.paymentMethod,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Go directly to certification from step 3
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    onProceed({
      service,
      appointmentDetails,
      userData: formData
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">HSA Information & Health Questionnaire</h2>
      <p className="text-gray-500 mb-6">This will give you access to your Letter of Medical Necessity</p>
      
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">HSA Account Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HSA Provider</label>
            <select
              value={formData.hsaProvider}
              onChange={(e) => handleInputChange('hsaProvider', e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your HSA provider</option>
              {hsaProviders.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>
        </div>
      
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Health Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Do you have any health conditions? *</label>
            <select
              value={formData.hasHealthConditions}
              onChange={(e) => handleInputChange('hasHealthConditions', e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What specific condition are you seeking treatment for? *</label>
            <select
              value={formData.selectedHealthCondition}
              onChange={(e) => handleInputChange('selectedHealthCondition', e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a condition</option>
              {getHealthConditionsByService(service.category).map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional details about your condition</label>
            <textarea
              value={formData.healthConditions}
              onChange={(e) => handleInputChange('healthConditions', e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Please provide any additional details about your condition, symptoms, or treatment goals..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Payment Information</h2>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              value="hsa"
              checked={formData.paymentMethod === 'hsa'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm font-medium">Pay with HSA funds (${service.price})</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm font-medium">Pay with credit/debit card</span>
          </label>
        </div>
      </div>
      
      {formData.paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
            <input
              type="text"
              value={formData.billingAddress}
              onChange={(e) => handleInputChange('billingAddress', e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.billingCity}
                onChange={(e) => handleInputChange('billingCity', e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={formData.billingState}
                onChange={(e) => handleInputChange('billingState', e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label>
              <input
                type="text"
                value={formData.billingZip}
                onChange={(e) => handleInputChange('billingZip', e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );



  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {step === 3 ? 'Continue to Certification' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 