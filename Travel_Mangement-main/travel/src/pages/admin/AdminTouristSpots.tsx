import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface TouristSpot {
  _id: string;
  name: string;
  location: {
    _id: string;
    name?: string | null;
  };
  description: string;
  image: string;
  bestTime: string;
  entryFee: string;
  duration: string;
  coordinates: {
    lat: number | string;
    lng: number | string;
  };
}

interface Location {
  _id: string;
  name: string;
}

const defaultSpot: TouristSpot = {
  _id: '',
  name: '',
  location: { _id: '', name: '' },
  description: '',
  image: '',
  bestTime: '',
  entryFee: '',
  duration: '',
  coordinates: {
    lat: '',
    lng: '',
  },
};

export default function AdminTouristSpots() {
  const { user } = useAuth();
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [spotData, setSpotData] = useState<TouristSpot>(defaultSpot);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const API_BASE_URL = 'http://localhost:5000';

  // ✅ Fetch Tourist Spots
  const fetchSpots = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/admin/tourist-spots`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        setSpots(response.data);
      }
    } catch (error) {
      console.error('Error fetching tourist spots:', error);
      toast.error('Failed to fetch tourist spots');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch Locations for Dropdown
  const fetchLocations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/admin/locations`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations');
    }
  }, []);

  // ✅ Fetch spots and locations once when component loads
  useEffect(() => {
    fetchSpots();
    fetchLocations();
  }, [fetchSpots, fetchLocations]);

  // ✅ Handle Submit (Add/Edit Tourist Spot)
  const handleSubmitSpot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.isAdmin) {
      toast.error('Access Denied: Only admins can modify tourist spots');
      return;
    }

    // ✅ Validate Coordinates
    const lat = parseFloat(String(spotData.coordinates.lat));
    const lng = parseFloat(String(spotData.coordinates.lng));

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error(
        'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const method = selectedSpot ? 'put' : 'post';
      const url = selectedSpot
        ? `${API_BASE_URL}/api/admin/tourist-spots/${selectedSpot._id}`
        : `${API_BASE_URL}/api/admin/tourist-spots`;

      // ✅ Send payload with coordinates as numbers
      const payload = {
        ...spotData,
        coordinates: {
          lat,
          lng,
        },
      };

      const response = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success(
        selectedSpot ? 'Tourist spot updated successfully' : 'Tourist spot added successfully',
      );

      // ✅ Update state after success
      if (selectedSpot) {
        setSpots((prevSpots) =>
          prevSpots.map((spot) => (spot._id === selectedSpot._id ? response.data : spot)),
        );
      } else {
        setSpots((prevSpots) => [...prevSpots, response.data]);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving tourist spot:', error);
      toast.error('Failed to save tourist spot');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Delete Spot
  const handleDeleteSpot = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tourist spot?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/admin/tourist-spots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success('Tourist spot deleted successfully');
      setSpots((prevSpots) => prevSpots.filter((spot) => spot._id !== id));
    } catch (error) {
      console.error('Error deleting tourist spot:', error);
      toast.error('Failed to delete tourist spot');
    }
  };

  // ✅ Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'location') {
      const selectedLocation = locations.find((loc) => loc._id === value);
      setSpotData((prev) => ({
        ...prev,
        location: { _id: value, name: selectedLocation?.name || '' },
      }));
    } else if (name === 'lat' || name === 'lng') {
      setSpotData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: parseFloat(value) || '', // Ensure valid number or empty string
        },
      }));
    } else {
      setSpotData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setSpotData({ ...defaultSpot, coordinates: { lat: '', lng: '' } });
    setSelectedSpot(null);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // ✅ Filtered Tourist Spots
  const filteredSpots = spots.filter((spot) =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='flex'>
      <AdminSidebar />
      <div className='flex-1 ml-64 p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Manage Tourist Spots</h1>
          {user?.isAdmin && (
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              <Plus className='h-5 w-5 mr-2' /> Add New Spot
            </button>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg w-96 shadow-lg'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>
                  {selectedSpot ? 'Edit Tourist Spot' : 'Add New Tourist Spot'}
                </h2>
                <button onClick={closeModal}>
                  <X className='h-5 w-5 text-gray-500' />
                </button>
              </div>

              <form onSubmit={handleSubmitSpot} className='space-y-4'>
                {['name', 'description', 'image', 'bestTime', 'entryFee', 'duration'].map(
                  (field) => (
                    <input
                      key={field}
                      type='text'
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={(spotData as any)[field] || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border rounded'
                    />
                  ),
                )}

                {/* Location Select Dropdown */}
                <select
                  name='location'
                  value={spotData.location._id}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border rounded'
                  required
                >
                  <option value=''>Select a location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.name}
                    </option>
                  ))}
                </select>

                {/* Coordinate fields */}
                <input
                  type='text'
                  name='lat'
                  placeholder='Latitude'
                  value={String(spotData.coordinates.lat)}
                  onChange={handleInputChange}
                  className='w-full mb-3 px-3 py-2 border rounded'
                />
                <input
                  type='text'
                  name='lng'
                  placeholder='Longitude'
                  value={String(spotData.coordinates.lng)}
                  onChange={handleInputChange}
                  className='w-full mb-3 px-3 py-2 border rounded'
                />

                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 rounded-lg'
                  disabled={isSubmitting}
                >
                  {selectedSpot ? 'Update Spot' : 'Add Spot'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className='mb-6 relative max-w-md'>
          <input
            type='text'
            placeholder='Search spots...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500'
          />
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
        </div>

        {/* Display Tourist Spots */}
        {loading ? (
          <p>Loading tourist spots...</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredSpots.map((spot) => (
              <div
                key={spot._id || spot.name} // ✅ Fixed the key
                className='bg-white rounded-lg shadow-md overflow-hidden'
              >
                <img src={spot.image} alt={spot.name} className='w-full h-48 object-cover' />
                <div className='p-4'>
                  <h3 className='text-lg font-semibold'>{spot.name}</h3>
                  <p className='text-sm text-gray-600'>
                    {spot.location?.name || 'Unknown Location'}
                  </p>
                  <p className='text-sm text-gray-500 mt-2'>{spot.description}</p>
                  {user?.isAdmin && (
                    <div className='flex space-x-2 mt-3'>
                      <button
                        onClick={() => {
                          setSelectedSpot(spot);
                          setSpotData(spot);
                          setIsModalOpen(true);
                        }}
                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-full'
                      >
                        <Edit className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => handleDeleteSpot(spot._id)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-full'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
