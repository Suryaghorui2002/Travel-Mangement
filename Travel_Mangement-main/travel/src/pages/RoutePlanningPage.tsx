import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Navigation } from 'lucide-react';

export default function RoutePlanningPage() {
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);

  
 

  const toggleSpot = (spotId: string) => {
    setSelectedSpots(prev =>
      prev.includes(spotId)
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Route Planning</h1>
        <p className="text-gray-600">Plan your perfect day by selecting the places you want to visit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid gap-6">
            {touristSpots.map((spot) => (
              <div
                key={spot.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all ${
                  selectedSpots.includes(spot.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full md:w-48 h-48 object-cover"
                  />
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900">{spot.name}</h3>
                      <button
                        onClick={() => toggleSpot(spot.id)}
                        className={`px-4 py-2 rounded-lg ${
                          selectedSpots.includes(spot.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedSpots.includes(spot.id) ? 'Selected' : 'Add to Route'}
                      </button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{spot.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Navigation className="h-5 w-5 mr-2" />
                        <span>{spot.distance}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>Best time: {spot.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-semibold mb-4">Your Route</h3>
            {selectedSpots.length === 0 ? (
              <p className="text-gray-600">Select places to create your route</p>
            ) : (
              <div className="space-y-4">
                {selectedSpots.map((spotId, index) => {
                  const spot = touristSpots.find(s => s.id === spotId);
                  if (!spot) return null;
                  
                  return (
                    <div key={spot.id} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{spot.name}</h4>
                        <p className="text-sm text-gray-600">{spot.bestTime}</p>
                      </div>
                    </div>
                  );
                })}
                
                <button className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Directions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}