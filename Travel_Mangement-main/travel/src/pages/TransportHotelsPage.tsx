import React, { useState } from 'react';
import { Plane, Train, Car, Building2, Star, ExternalLink } from 'lucide-react';

export default function TransportHotelsPage() {
  const [selectedTab, setSelectedTab] = useState<'transport' | 'hotels'>('transport');

  const transportOptions = [
    {
      type: 'flight',
      name: 'Air France',
      price: '€200',
      duration: '2h 30m',
      icon: Plane,
      details: 'Direct flights available daily'
    },
    {
      type: 'train',
      name: 'TGV',
      price: '€80',
      duration: '4h',
      icon: Train,
      details: 'High-speed rail service'
    },
    {
      type: 'rental',
      name: 'Hertz Car Rental',
      price: '€50/day',
      duration: 'Flexible',
      icon: Car,
      details: 'Various vehicle options available'
    }
  ];

  const hotels = [
    {
      id: '1',
      name: 'Grand Hotel Paris',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      price: '€350/night',
      rating: 4.8,
      description: 'Luxury hotel with Eiffel Tower views',
      amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Room Service']
    },
    {
      id: '2',
      name: 'Boutique Marais',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      price: '€220/night',
      rating: 4.5,
      description: 'Charming boutique hotel in historic district',
      amenities: ['Free WiFi', 'Breakfast', 'Bar', 'Concierge']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setSelectedTab('transport')}
          className={`px-6 py-3 rounded-lg font-medium ${
            selectedTab === 'transport'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Transport Options
        </button>
        <button
          onClick={() => setSelectedTab('hotels')}
          className={`px-6 py-3 rounded-lg font-medium ${
            selectedTab === 'hotels'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Hotels & Stays
        </button>
      </div>

      {selectedTab === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transportOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <option.icon className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">{option.name}</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>Price: {option.price}</p>
                <p>Duration: {option.duration}</p>
                <p>{option.details}</p>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'hotels' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold">{hotel.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{hotel.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-gray-900">{hotel.price}</span>
                  <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}