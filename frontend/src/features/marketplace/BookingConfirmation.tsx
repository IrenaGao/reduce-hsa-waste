'use client';

import React from 'react';

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

interface BookingConfirmationProps {
  bookingData: {
    service: Service;
    appointmentDetails: AppointmentDetails;
    userData: UserData;
  };
  confirmationNumber: string;
  onBackToMarketplace: () => void;
}

export default function BookingConfirmation({ bookingData, confirmationNumber, onBackToMarketplace }: BookingConfirmationProps) {
  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">Booking Confirmed!</h1>
          <p className="text-green-600">Your appointment has been successfully scheduled</p>
          <div className="mt-4 bg-white rounded-lg px-4 py-2 inline-block">
            <span className="text-sm text-gray-600">Confirmation #: </span>
            <span className="font-mono font-bold text-blue-800">{confirmationNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Appointment Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <div className="font-semibold text-gray-900">{bookingData.service.name}</div>
                  <div className="text-sm text-gray-600">{bookingData.service.address}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-semibold text-gray-900">{bookingData.appointmentDetails.date}</div>
                  <div className="text-sm text-gray-600">at {bookingData.appointmentDetails.time}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <div className="font-semibold text-gray-900">
                    {bookingData.userData.paymentMethod === 'hsa' ? 'HSA Payment' : 'Card Payment'}
                  </div>
                  <div className="text-sm text-gray-600">${bookingData.service.price}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What to Expect</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Arrive 10 minutes before your appointment
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bring a valid ID and insurance card
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Complete any required forms
                </li>
              </ul>
            </div>
          </div>

          {/* Next Steps & Information */}
          <div className="space-y-6">
            {/* HSA Information */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">HSA Information</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-900">Payment Processed</span>
                  </div>
                  <p className="text-sm text-green-700">Your HSA payment of ${bookingData.service.price} has been processed tax-free.</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-semibold text-blue-900">Receipt Available</span>
                  </div>
                  <p className="text-sm text-blue-700">A detailed receipt has been sent to your email for HSA documentation.</p>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-semibold text-yellow-900">Keep Records</span>
                  </div>
                  <p className="text-sm text-yellow-700">Save your receipt for tax purposes and HSA account reconciliation.</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Contact Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-600">Need to reschedule? Call (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Questions? Email support@hsamarketplace.com</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onBackToMarketplace}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Book Another Service
              </button>
              
              <button className="w-full border border-blue-300 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition">
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 