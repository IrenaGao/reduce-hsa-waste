'use client';

import React, { useState } from "react";
import CheckoutPage from "./CheckoutPage";
import CertificationPage from "./CertificationPage";
import BookingConfirmation from "./BookingConfirmation";

interface ServiceDetailsProps {
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
  onBack: () => void;
}

type BookingStep = 'details' | 'checkout' | 'certification' | 'confirmation';

interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  eligible: boolean;
  image: string;
  coordinates: [number, number];
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

interface BookingData {
  service: Service;
  appointmentDetails: AppointmentDetails;
  userData: UserData;
}

export default function ServiceDetails({ service, onBack }: ServiceDetailsProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('hsa');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time for your appointment.');
      return;
    }
    
    setCurrentStep('checkout');
  };

  const handleCheckoutComplete = (checkoutData: Record<string, unknown>) => {
    setBookingData(checkoutData as unknown as BookingData);
    setCurrentStep('certification');
  };

  const handleCertificationComplete = () => {
    // Generate a random confirmation number
    const confNum = 'BK' + Date.now().toString().slice(-8);
    setConfirmationNumber(confNum);
    setCurrentStep('confirmation');
  };

  const handleBackToDetails = () => {
    setCurrentStep('details');
  };

  const handleBackToCheckout = () => {
    setCurrentStep('checkout');
  };

  const handleBackToMarketplace = () => {
    setCurrentStep('details');
    onBack();
  };

  // Render different steps
  if (currentStep === 'checkout') {
    return (
      <CheckoutPage
        service={service}
        appointmentDetails={{
          date: selectedDate,
          time: selectedTime,
          paymentMethod: paymentMethod
        }}
        onBack={handleBackToDetails}
        onProceed={handleCheckoutComplete}
      />
    );
  }

  if (currentStep === 'certification' && bookingData) {
    return (
      <CertificationPage
        bookingData={bookingData}
        onBack={handleBackToCheckout}
        onComplete={handleCertificationComplete}
      />
    );
  }

  if (currentStep === 'confirmation' && bookingData) {
    return (
      <BookingConfirmation
        bookingData={bookingData}
        confirmationNumber={confirmationNumber}
        onBackToMarketplace={handleBackToMarketplace}
      />
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Marketplace
        </button>

        {/* Service Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">{service.category}</span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">HSA Eligible</span>
            </div>
          </div>
          
          <div className="p-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">{service.name}</h1>
            <p className="text-blue-600 mb-8">{service.address}</p>
            
            {/* Service Description */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-400 shadow-sm">
                                    <p className="text-gray-700 leading-relaxed text-base">
                      {service.category === 'MedSpa' && 
                        "Medical spa services combine medical expertise with spa-like comfort to address aesthetic and wellness concerns. Treatments may include laser hair removal, skin rejuvenation, anti-aging procedures, and body contouring. These FDA-approved procedures are performed by licensed medical professionals in a relaxing environment. Sessions typically last 30-90 minutes depending on the treatment, with results improving over multiple sessions."
                      }
                      {service.category === 'Acupuncture' && 
                        "Acupuncture involves inserting thin, sterile needles into specific points on the body to stimulate the nervous system and release natural pain-relieving chemicals. Sessions typically last 30-60 minutes and may include additional techniques like cupping or moxibustion. It's commonly used for chronic pain, stress, anxiety, and digestive issues. Most people feel minimal to no pain during treatment."
                      }
                      {service.category === 'Massage' && 
                        "Therapeutic massage manipulates soft tissues to relieve muscle tension, improve circulation, and promote relaxation. Sessions range from 30-90 minutes and can include Swedish, deep tissue, sports, or hot stone techniques. Benefits include reduced muscle soreness, improved range of motion, stress relief, and better sleep. The therapist will adjust pressure based on your comfort level and specific needs."
                      }
                      {!['MedSpa', 'Acupuncture', 'Massage'].includes(service.category) && 
                        "Professional wellness service designed to improve your health and well-being. Our experienced practitioners provide personalized care using proven techniques and modern equipment. Treatment duration and specific benefits vary by service type. Consult with your provider for detailed information about what to expect during your session."
                      }
                    </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Service Details */}
              <div>
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Service Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{service.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-2xl text-blue-800">${service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HSA Eligible:</span>
                    <span className="text-green-600 font-medium">Yes</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">What&apos;s Included</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Professional consultation
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Treatment session
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Follow-up care instructions
                    </li>
                  </ul>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Book Your Appointment</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="hsa"
                          checked={paymentMethod === 'hsa'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Pay with HSA funds (${service.price})</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Pay with credit/debit card</span>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Continue to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HSA Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">HSA Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm font-medium text-green-800">HSA Eligible</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$</div>
              <div className="text-sm font-medium text-blue-800">Tax-Free Payment</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">📋</div>
              <div className="text-sm font-medium text-purple-800">Receipt Provided</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 