'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import HealthQuestionnaire, { HealthQuestionnaireData } from '@/components/HealthQuestionnaire';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  provider: string;
  rating: number;
  image: string;
  hsaEligible: boolean;
  conditions: string[];
  detailedDescription: string;
  whatToExpect: string[];
  preparationInstructions: string[];
  cancellationPolicy: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Nutritional Counseling',
    category: 'Wellness',
    description: 'Personalized nutrition consultation to develop a healthy eating plan tailored to your health goals.',
    detailedDescription: 'Our registered dietitians provide comprehensive nutritional counseling to help you achieve your health goals. Whether you\'re managing a chronic condition, looking to improve your overall wellness, or seeking weight management support, our personalized approach ensures you receive evidence-based nutrition guidance that fits your lifestyle.',
    price: 85,
    duration: '45 minutes',
    provider: 'Wellness Nutrition Group',
    rating: 4.9,
    image: '/api/placeholder/300/200',
    hsaEligible: true,
    conditions: ['Diabetes', 'High Blood Pressure', 'Weight Management', 'Heart Disease'],
    whatToExpect: [
      'Comprehensive nutrition assessment',
      'Review of current eating habits',
      'Personalized meal planning',
      'Education on nutrient-dense foods',
      'Behavior modification strategies',
      'Follow-up plan development'
    ],
    preparationInstructions: [
      'Keep a 3-day food diary before your appointment',
      'Bring a list of current medications and supplements',
      'Note any food allergies or intolerances',
      'Consider your lifestyle and cooking preferences',
      'Prepare questions about your nutrition goals'
    ],
    cancellationPolicy: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $25.',
    location: {
      address: '456 Park Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10022'
    }
  },
  {
    id: '2',
    name: 'Therapeutic Massage',
    category: 'Wellness',
    description: 'Personalized treatment to address areas of restriction and optimization of mobility.',
    detailedDescription: 'Tension Intervention provides personalized therapeutic massage treatments to address areas of restriction and optimize mobility. Our specialized techniques include Myoskeletal Alignment, Graston Technique, Functional Mobility, Deep Tissue, TMJ Release, and Prenatal/Postpartum Massage. Each session is tailored to your specific needs and health goals.',
    price: 225,
    duration: '60 minutes',
    provider: 'Tension Intervention',
    rating: 4.9,
    image: '/api/placeholder/300/200',
    hsaEligible: true,
    conditions: ['Chronic Pain', 'Stress', 'Muscle Tension', 'Injury Recovery', 'TMJ Issues', 'Prenatal Care'],
    whatToExpect: [
      'Initial health assessment and consultation',
      'Myoskeletal alignment techniques',
      'Graston technique for tissue release',
      'Functional mobility assessment',
      'Deep tissue and targeted therapy',
      'Post-treatment mobility recommendations',
      'Personalized care plan development'
    ],
    preparationInstructions: [
      'Arrive 10 minutes early for check-in',
      'Wear comfortable, loose clothing',
      'Avoid eating a heavy meal 2 hours before',
      'Stay hydrated throughout the day',
      'Inform therapist of any injuries or concerns'
    ],
    cancellationPolicy: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $40.',
    location: {
      address: '252 Java Street',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11222'
    }
  },
  {
    id: '3',
    name: 'Stretching & Mobility Session',
    category: 'Wellness',
    description: 'Guided stretching and mobility session to improve flexibility, reduce stiffness, and enhance movement quality.',
    detailedDescription: 'Our certified mobility specialists guide you through targeted stretching and mobility exercises designed to improve flexibility, reduce joint stiffness, and enhance overall movement quality. Perfect for those with limited mobility, desk workers, or anyone looking to improve their range of motion.',
    price: 80,
    duration: '45 minutes',
    provider: 'Flex & Flow Wellness',
    rating: 4.7,
    image: '/api/placeholder/300/200',
    hsaEligible: true,
    conditions: ['Joint Stiffness', 'Limited Mobility', 'Posture Issues', 'Recovery'],
    whatToExpect: [
      'Movement assessment and evaluation',
      'Targeted stretching routine',
      'Mobility exercises and techniques',
      'Breathing and relaxation guidance',
      'Home exercise program',
      'Progress tracking and follow-up'
    ],
    preparationInstructions: [
      'Wear comfortable, stretchy clothing',
      'Bring a water bottle',
      'Arrive 5 minutes early',
      'Inform instructor of any limitations',
      'Avoid heavy meals 1 hour before'
    ],
    cancellationPolicy: 'Cancellations must be made at least 12 hours in advance to avoid a cancellation fee of $20.',
    location: {
      address: '456 Movement Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10002'
    }
  },
  {
    id: '4',
    name: 'Yoga Therapy Session',
    category: 'Wellness',
    description: 'One-on-one yoga therapy session tailored to address specific health concerns and improve overall well-being.',
    detailedDescription: 'Our certified yoga therapists provide personalized yoga sessions designed to address specific health concerns and improve overall well-being. Using therapeutic yoga techniques, breathwork, and mindful movement, we help you achieve better physical and mental health.',
    price: 90,
    duration: '60 minutes',
    provider: 'Mindful Movement Studio',
    rating: 4.9,
    image: '/api/placeholder/300/200',
    hsaEligible: true,
    conditions: ['Anxiety', 'Back Pain', 'Stress', 'Balance Issues'],
    whatToExpect: [
      'Health assessment and goal setting',
      'Personalized yoga sequence',
      'Breathing exercises and meditation',
      'Adaptive poses for your needs',
      'Stress reduction techniques',
      'Home practice guidance'
    ],
    preparationInstructions: [
      'Wear comfortable, flexible clothing',
      'Bring a yoga mat if you have one',
      'Arrive 10 minutes early',
      'Avoid eating 2 hours before',
      'Inform instructor of any injuries'
    ],
    cancellationPolicy: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $30.',
    location: {
      address: '789 Mindful Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10003'
    }
  },
  {
    id: '5',
    name: 'Pilates Rehabilitation',
    category: 'Wellness',
    description: 'Pilates-based rehabilitation session to strengthen core, improve posture, and aid in injury recovery.',
    detailedDescription: 'Our certified Pilates instructors provide rehabilitation-focused Pilates sessions designed to strengthen your core, improve posture, and aid in injury recovery. Using specialized equipment and targeted exercises, we help you build strength, stability, and proper movement patterns.',
    price: 100,
    duration: '50 minutes',
    provider: 'Core Strength Pilates',
    rating: 4.8,
    image: '/api/placeholder/300/200',
    hsaEligible: true,
    conditions: ['Back Pain', 'Posture Issues', 'Core Weakness', 'Injury Recovery'],
    whatToExpect: [
      'Postural assessment and analysis',
      'Core strengthening exercises',
      'Stability and balance training',
      'Injury-specific modifications',
      'Movement pattern correction',
      'Home exercise program'
    ],
    preparationInstructions: [
      'Wear fitted, comfortable clothing',
      'Bring socks (grippy recommended)',
      'Arrive 10 minutes early',
      'Bring medical clearance if needed',
      'Inform instructor of any limitations'
    ],
    cancellationPolicy: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $35.',
    location: {
      address: '321 Core Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10004'
    }
  },
  {
    id: '6',
    name: 'Chiropractic Adjustment',
    category: 'Alternative Medicine',
    description: 'Spinal adjustment and manipulation to improve alignment and relieve pain.',
    detailedDescription: 'Our licensed chiropractors provide spinal adjustments and manipulations to improve alignment, relieve pain, and enhance overall wellness. Using evidence-based techniques, we help restore proper spinal function and promote natural healing.',
    price: 95,
    duration: '30 minutes',
    provider: 'Manhattan Chiropractic',
    rating: 4.6,
    image: '/api/placeholder/300/200',
    hsaEligible: true,
    conditions: ['Back Pain', 'Neck Pain', 'Headaches', 'Sciatica'],
    whatToExpect: [
      'Initial consultation and assessment',
      'Spinal adjustment and manipulation',
      'Post-treatment recommendations',
      'Exercise and lifestyle advice',
      'Follow-up scheduling'
    ],
    preparationInstructions: [
      'Wear comfortable, loose-fitting clothing',
      'Bring any relevant medical records',
      'Arrive 10 minutes early',
      'Inform us of any recent injuries',
      'Bring a list of current medications'
    ],
    cancellationPolicy: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $30.',
    location: {
      address: '789 5th Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10003'
    }
  }
  // Add more services as needed
];

export default function ServiceDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  useEffect(() => {
    const foundService = MOCK_SERVICES.find(s => s.id === serviceId);
    if (foundService) {
      setService(foundService);
    } else {
      router.push('/marketplace');
    }
  }, [router, serviceId]);

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time for your appointment.');
      return;
    }
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireSubmit = (data: HealthQuestionnaireData) => {
    setShowQuestionnaire(false);
    // Redirect to checkout with the booking data
    const bookingData = {
      serviceId: service?.id,
      serviceName: service?.name,
      servicePrice: service?.price,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      healthQuestionnaireData: data
    };
    
    // Store booking data in sessionStorage for checkout
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/checkout');
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/marketplace" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Sagas Health</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/marketplace" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Marketplace
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Header */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {service.category}
                  </span>
                  {service.hsaEligible && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      HSA Eligible
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {service.name}
                </h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(service.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {service.rating} • {service.provider}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-6">
                  {service.detailedDescription}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Duration:</span> {service.duration}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {service.location.city}, {service.location.state}
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  What to Expect
                </h2>
                <ul className="space-y-2">
                  {service.whatToExpect.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparation Instructions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Preparation Instructions
                </h2>
                <ul className="space-y-2">
                  {service.preparationInstructions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${service.price}
                  </div>
                  <div className="text-gray-600">
                    {service.duration}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Time Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a time</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={!selectedDate || !selectedTime}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedDate && selectedTime
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Book Now
                </button>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  {service.cancellationPolicy}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Health Questionnaire Modal */}
      {showQuestionnaire && (
        <HealthQuestionnaire
          onSubmit={handleQuestionnaireSubmit}
          onCancel={() => setShowQuestionnaire(false)}
          serviceName={service.name}
        />
      )}
    </div>
  );
}
