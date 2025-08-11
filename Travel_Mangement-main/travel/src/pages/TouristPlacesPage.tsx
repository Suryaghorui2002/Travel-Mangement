import React from 'react';
import { Clock, DollarSign, Calendar } from 'lucide-react';

export default function TouristPlacesPage() {
  const touristSpots = [
    {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
      image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e',
      bestTime: 'Early morning or sunset',
      entryFee: '€26.10 for adults',
      locationId: '1'
    },
    {
      id: '2',
      name: 'Louvre Museum',
      description: 'World\'s largest art museum and home to the Mona Lisa.',
      image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52',
      bestTime: 'Wednesday and Friday evenings',
      entryFee: '€17 for adults',
      locationId: '1'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Popular Tourist Spots in Paris</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {touristSpots.map((spot) => (
            <div key={spot.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={spot.image}
                alt={spot.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{spot.name}</h2>
                <p className="text-gray-600 mb-4">{spot.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Best Time: {spot.bestTime}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>Entry Fee: {spot.entryFee}</span>
                  </div>
                </div>
                
                <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}