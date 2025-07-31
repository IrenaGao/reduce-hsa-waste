'use client';

import React, { useState } from 'react';

interface Service {
  name: string;
  category: string;
  price: number;
  address: string;
}

interface AppointmentDetails {
  date: string;
  time: string;
  paymentMethod: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  hsaProvider: string;
  hsaBalance: string;
  hasHealthConditions: string;
  selectedHealthCondition: string;
  healthConditions: string;
  serviceHistory: string;
  treatmentGoals: string;
  painLevel: string;
  insuranceProvider: string;
  insuranceNumber: string;
  groupNumber: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
}

interface CertificationPageProps {
  bookingData: {
    service: Service;
    appointmentDetails: AppointmentDetails;
    userData: UserData;
  };
  onBack: () => void;
  onComplete: () => void;
}

export default function CertificationPage({ bookingData, onBack, onComplete }: CertificationPageProps) {
  const [agreements, setAgreements] = useState({
    hsaEligibility: false,
    medicalAccuracy: false,
    cancellation: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAgreementChange = (field: string, value: boolean) => {
    setAgreements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const allAgreementsAccepted = Object.values(agreements).every(agreement => agreement);

  const handleSubmit = async () => {
    if (!allAgreementsAccepted) {
      alert('Please accept all agreements to proceed.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Checkout
          </button>
          
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Certification & Confirmation</h1>
          <p className="text-blue-600">Please review and certify your booking information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Service Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{bookingData.service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{bookingData.service.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-blue-800">${bookingData.service.price}</span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Appointment Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{bookingData.appointmentDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{bookingData.appointmentDetails.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{bookingData.service.address}</span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{bookingData.userData.firstName} {bookingData.userData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{bookingData.userData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{bookingData.userData.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium">
                      {bookingData.userData.paymentMethod === 'hsa' ? 'HSA Funds' : 'Credit/Debit Card'}
                    </span>
                  </div>
                  {bookingData.userData.paymentMethod === 'hsa' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">HSA Provider:</span>
                      <span className="font-medium">{bookingData.userData.hsaProvider || 'Not specified'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Required Certifications</h2>
            
            <div className="space-y-4">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreements.hsaEligibility}
                    onChange={(e) => handleAgreementChange('hsaEligibility', e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-green-900">HSA Eligibility Certification</span>
                    <p className="text-green-700 mt-1">I certify that this service is medically necessary and eligible for HSA reimbursement under IRS guidelines.</p>
                  </div>
                </label>
              </div>

              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreements.medicalAccuracy}
                    onChange={(e) => handleAgreementChange('medicalAccuracy', e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-yellow-900">Medical Information Accuracy</span>
                    <p className="text-yellow-700 mt-1">I certify that all medical information provided is accurate and complete to the best of my knowledge.</p>
                  </div>
                </label>
              </div>

              <div className="border border-blue-200 rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreements.cancellation}
                    onChange={(e) => handleAgreementChange('cancellation', e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Cancellation Policy</span>
                    <p className="text-gray-600 mt-1">I understand the cancellation policy and agree to provide 24-hour notice for any changes.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* HSA Information */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">HSA Information</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  This service qualifies for HSA reimbursement
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Payment will be processed tax-free
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Receipt will be provided for tax documentation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Back to Checkout
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!allAgreementsAccepted || isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 