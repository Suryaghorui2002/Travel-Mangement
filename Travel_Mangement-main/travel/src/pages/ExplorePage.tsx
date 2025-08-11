import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Location interface
interface Location {
  _id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Nearby Place interface
interface Place {
  _id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function ExplorePage() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLocation(); // Fetch location and nearby places
  }, []);

  // ✅ Fetch location details by ID
  const fetchLocation = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/locations/${id}`, {
        withCredentials: true,
      });
      setLocation(response.data);

      // ✅ Fetch nearby tourist spots based on location
      fetchNearbyPlaces(response.data._id);
    } catch (error) {
      console.error('Error fetching location:', error);
      toast.error('Failed to load location details');
      setLoading(false);
    }
  };

  // ✅ Fetch nearby places for this location
  const fetchNearbyPlaces = async (locationId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/locations/nearby/${locationId}`);
      setNearbyPlaces(response.data);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      toast.error('Failed to load nearby places');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loading or error message if data not available
  if (loading) {
    return <p className='text-center text-gray-600'>Loading details...</p>;
  }

  if (!location) {
    return <p className='text-center text-red-500'>Location not found!</p>;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* Location Image */}
        <img
          src={location.image}
          alt={location.name}
          className='w-full h-64 object-cover rounded-lg shadow-md'
        />
        {/* Location Details */}
        <h1 className='text-3xl font-bold text-gray-900 mt-6'>{location.name}</h1>
        <p className='text-lg text-gray-600'>{location.country}</p>
        <p className='mt-4 text-gray-700'>{location.description}</p>

        {/* Map Section */}
        <div className='mt-8'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Nearby Tourist Places</h2>
          <MapContainer
            center={[location.coordinates.lat, location.coordinates.lng]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
            {/* OpenStreetMap Layer */}
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Main Location Marker */}
            <Marker
              position={[location.coordinates.lat, location.coordinates.lng]}
              icon={markerIcon}
            >
              <Popup>
                <div>
                  <h3 className='font-semibold'>{location.name}</h3>
                  <p>{location.country}</p>
                </div>
              </Popup>
            </Marker>

            {/* Markers for Nearby Places */}
            {nearbyPlaces.map((place, index) => (
              <Marker
                key={index}
                position={[place.coordinates.lat, place.coordinates.lng]}
                icon={markerIcon}
              >
                <Popup>
                  <div>
                    <h3 className='font-semibold'>{place.name}</h3>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
