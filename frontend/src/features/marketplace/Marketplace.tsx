'use client';

import React, { useState } from "react";
import InteractiveMap from "@/components/InteractiveMap";
import ServiceDetails from "./ServiceDetails";

const categories = ["All", "MedSpa", "Acupuncture", "Massage"];

const products = [
  {
    id: 1,
    name: "LaserAway",
    category: "MedSpa",
    price: 299,
    eligible: true,
    rating: 4.7,
    reviewCount: 284,
    image: "https://downtownbrooklyn.com/wp-content/uploads/2023/03/LaserAway.jpg",
    coordinates: [40.7589, -73.9851] as [number, number],
    address: "1235 Broadway, New York, NY 10001"
  },
  {
    id: 2,
    name: "Smooth Synergy",
    category: "Acupuncture",
    price: 125,
    eligible: true,
    rating: 4.9,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    coordinates: [40.7505, -73.9934] as [number, number],
    address: "456 5th Ave, New York, NY 10018"
  },
  {
    id: 3,
    name: "Zen Wellness Center",
    category: "Massage",
    price: 95,
    eligible: true,
    rating: 4.5,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop",
    coordinates: [40.7614, -73.9776] as [number, number],
    address: "789 Park Ave, New York, NY 10021"
  },
  {
    id: 4,
    name: "Glow MedSpa",
    category: "MedSpa",
    price: 199,
    eligible: true,
    rating: 4.3,
    reviewCount: 127,
    image: "https://ik.imagekit.io/zoca/98a13f02-3d6d-4992-bc8d-acafc6e8793b/media_1744741237534_kvwcv3hn8i9.jpg?tr=w-1024,q-75,br-20,fo-auto,c-pad,pr-true",
    coordinates: [40.7527, -73.9772] as [number, number],
    address: "321 Madison Ave, New York, NY 10017"
  },
  {
    id: 5,
    name: "Harmony Acupuncture",
    category: "Acupuncture",
    price: 110,
    eligible: true,
    rating: 4.8,
    reviewCount: 89,
    image: "https://dmtreatments.com/wp-content/uploads/2021/08/Acupuncture-Clinic1.jpg",
    coordinates: [40.7484, -73.9857] as [number, number],
    address: "654 6th Ave, New York, NY 10011"
  },
  {
    id: 6,
    name: "Serenity Massage",
    category: "Massage",
    price: 85,
    eligible: true,
    rating: 4.6,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop",
    coordinates: [40.7569, -73.9745] as [number, number],
    address: "987 3rd Ave, New York, NY 10022"
  },
  {
    id: 7,
    name: "Beauty Lab NYC",
    category: "MedSpa",
    price: 249,
    eligible: true,
    rating: 4.4,
    reviewCount: 178,
    image: "https://images.sideways.nyc/4eBazcRiOXsaZoKa4sdVRo/klara-beauty-lab-1.jpg?auto=format&fit=crop&w=810&dpr=2&q=50",
    coordinates: [40.7627, -73.9722] as [number, number],
    address: "147 2nd Ave, New York, NY 10003"
  },
  {
    id: 8,
    name: "Wellness Point",
    category: "Acupuncture",
    price: 135,
    eligible: true,
    rating: 4.2,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    coordinates: [40.7444, -73.9857] as [number, number],
    address: "258 7th Ave, New York, NY 10001"
  }
];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<typeof products[0] | null>(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 4;

  const filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentServices = filtered.slice(startIndex, endIndex);

  // Reset to first page when search or category changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const handleServiceSelect = (service: typeof products[0]) => {
    setSelectedService(service);
    // Scroll to the selected service in the grid
    const element = document.getElementById(`service-${service.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCardClick = (service: typeof products[0]) => {
    setSelectedService(service);
    setViewingDetails(true);
  };

  const handleBackToMarketplace = () => {
    setViewingDetails(false);
    setSelectedService(null);
  };

  // Show service details if viewing details
  if (viewingDetails && selectedService) {
    return <ServiceDetails service={selectedService} onBack={handleBackToMarketplace} />;
  }

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-blue-900">HSA-Eligible Marketplace</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center items-center">
          <input
            type="text"
            placeholder="Search products/services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-200 rounded-lg px-5 py-3 w-full sm:w-96 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-blue-200 rounded-lg px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Service Listings */}
          <div className="lg:w-3/5 space-y-4">
            {currentServices.map((product) => (
              <div
                key={product.id}
                id={`service-${product.id}`}
                onClick={() => handleCardClick(product)}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-blue-100 cursor-pointer hover:scale-[1.02] ${
                  selectedService?.id === product.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Service Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Service Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-blue-900 truncate">{product.name}</h2>
                      <div className="text-2xl font-bold text-blue-800">${product.price}</div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 truncate">{product.address}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                        HSA Eligible
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>⭐ {product.rating}</span>
                        <span>•</span>
                        <span>({product.reviewCount} reviews)</span>
                        <span>•</span>
                        <span>Open now</span>
                        <span>•</span>
                        <span>2.1 mi</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(product);
                        }}
                        className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        View & Purchase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-blue-600 border border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          
          {/* Interactive Map */}
          <div className="lg:w-2/5 lg:sticky lg:top-8">
            <InteractiveMap services={products} onServiceSelect={handleServiceSelect} />
          </div>
        </div>
      </div>
    </div>
  );
} 