import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Edit, Trash2, Car, Building, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface Transport {
  _id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  location: string;
}

interface Hotel {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  rating: number;
  location: string;
}

interface Location {
  _id: string;
  name: string;
}

export default function AdminTransportHotels() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'transport' | 'hotels'>('transport');
  const [transportOptions, setTransportOptions] = useState<Transport[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [transportData, setTransportData] = useState<Transport>({
    _id: '',
    name: '',
    type: '',
    price: 0,
    duration: '',
    location: '',
  });

  const [hotelData, setHotelData] = useState<Hotel>({
    _id: '',
    name: '',
    description: '',
    image: '',
    price: '',
    rating: 0,
    location: '',
  });

  useEffect(() => {
    fetchData();
    fetchLocations();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'transport') {
        const response = await axios.get('http://localhost:5000/api/admin/transport', {
          withCredentials: true,
        });
        setTransportOptions(response.data);
      } else {
        const response = await axios.get('http://localhost:5000/api/admin/hotels', {
          withCredentials: true,
        });
        setHotels(response.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab}`);
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations', {
        withCredentials: true,
      });
      setLocations(response.data);
    } catch (error) {
      toast.error('Failed to fetch locations');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'transport') {
        if (transportData._id) {
          await axios.put(
            `http://localhost:5000/api/admin/transport/${transportData._id}`,
            transportData,
            { withCredentials: true },
          );
        } else {
          await axios.post('http://localhost:5000/api/admin/transport', transportData, {
            withCredentials: true,
          });
        }
      } else {
        if (hotelData._id) {
          await axios.put(`http://localhost:5000/api/admin/hotels/${hotelData._id}`, hotelData, {
            withCredentials: true,
          });
        } else {
          await axios.post('http://localhost:5000/api/admin/hotels', hotelData, {
            withCredentials: true,
          });
        }
      }

      toast.success(`${activeTab === 'transport' ? 'Transport' : 'Hotel'} saved successfully`);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/${activeTab}/${id}`, {
        withCredentials: true,
      });
      toast.success('Deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className='flex'>
        <AdminSidebar />
        <div className='flex-1 ml-64 p-8'>
          <div className='flex justify-center items-center h-full'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <AdminSidebar />
      <div className='flex-1 ml-64 p-8'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex space-x-4'>
            <button
              onClick={() => setActiveTab('transport')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'transport'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Car className='h-5 w-5 mr-2' />
              Transport
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'hotels'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Building className='h-5 w-5 mr-2' />
              Hotels
            </button>
          </div>
          <button
            onClick={() => {
              if (activeTab === 'transport') {
                setTransportData({
                  _id: '',
                  name: '',
                  type: '',
                  price: 0,
                  duration: '',
                  location: '',
                });
              } else {
                setHotelData({
                  _id: '',
                  name: '',
                  description: '',
                  image: '',
                  price: '',
                  rating: 0,
                  location: '',
                });
              }
              setIsModalOpen(true);
            }}
            className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            <Plus className='h-5 w-5 mr-2' />
            Add New {activeTab === 'transport' ? 'Transport' : 'Hotel'}
          </button>
        </div>

        {activeTab === 'transport' ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {transportOptions.map((option) => (
              <div key={option._id} className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>{option.name}</h3>
                    <p className='text-sm text-gray-600 mt-1'>{option.type}</p>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => {
                        setTransportData(option);
                        setIsModalOpen(true);
                      }}
                      className='p-2 text-blue-600 hover:bg-blue-50 rounded-full'
                    >
                      <Edit className='h-5 w-5' />
                    </button>
                    <button
                      onClick={() => handleDelete(option._id)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded-full'
                    >
                      <Trash2 className='h-5 w-5' />
                    </button>
                  </div>
                </div>
                <div className='mt-4'>
                  <p className='text-gray-600'>Price: ${option.price}</p>
                  <p className='text-gray-600'>Duration: {option.duration}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {hotels.map((hotel) => (
              <div key={hotel._id} className='bg-white rounded-lg shadow-md overflow-hidden'>
                <img src={hotel.image} alt={hotel.name} className='w-full h-48 object-cover' />
                <div className='p-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900'>{hotel.name}</h3>
                      <p className='text-sm text-gray-600 mt-1'>Rating: {hotel.rating}/5</p>
                    </div>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => {
                          setHotelData(hotel);
                          setIsModalOpen(true);
                        }}
                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-full'
                      >
                        <Edit className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => handleDelete(hotel._id)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-full'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                  <p className='text-gray-600 mt-2'>Price: {hotel.price}</p>
                  <p className='text-sm text-gray-500 mt-2 line-clamp-2'>{hotel.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 w-96'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>
                  {activeTab === 'transport' ? 'Transport Details' : 'Hotel Details'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className='h-5 w-5' />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                {activeTab === 'transport' ? (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Name</label>
                      <input
                        type='text'
                        value={transportData.name}
                        onChange={(e) =>
                          setTransportData({ ...transportData, name: e.target.value })
                        }
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Type</label>
                      <select
                        value={transportData.type}
                        onChange={(e) =>
                          setTransportData({ ...transportData, type: e.target.value })
                        }
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        required
                      >
                        <option value=''>Select type</option>
                        <option value='Bus'>Bus</option>
                        <option value='Taxi'>Taxi</option>
                        <option value='Train'>Train</option>
                        <option value='Bike'>Bike</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Price</label>
                      <input
                        type='number'
                        value={transportData.price}
                        onChange={(e) =>
                          setTransportData({ ...transportData, price: Number(e.target.value) })
                        }
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Duration</label>
                      <input
                        type='text'
                        value={transportData.duration}
                        onChange={(e) =>
                          setTransportData({ ...transportData, duration: e.target.value })
                        }
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Name</label>
                      <input
                        type='text'
                        value={hotelData.name}
                        onChange={(e) => setHotelData({ ...hotelData, name: e.target.value })}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Description</label>
                      <textarea
                        value={hotelData.description}
                        onChange={(e) =>
                          setHotelData({ ...hotelData, description: e.target.value })
                        }
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Image URL</label>
                      <input
                        type='url'
                        value={hotelData.image}
                        onChange={(e) => setHotelData({ ...hotelData, image: e.target.value })}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Price</label>
                      <input
                        type='text'
                        value={hotelData.price}
                        onChange={(e) => setHotelData({ ...hotelData, price: e.target.value })}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Rating</label>
                      <input
                        type='number'
                        min='0'
                        max='5'
                        step='0.1'
                        value={hotelData.rating}
                        onChange={(e) =>
                          setHotelData({ ...hotelData, rating: Number(e.target.value) })
                        }
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className='block text-sm font-medium text-gray-700'>Location</label>
                  <select
                    value={activeTab === 'transport' ? transportData.location : hotelData.location}
                    onChange={(e) => {
                      if (activeTab === 'transport') {
                        setTransportData({ ...transportData, location: e.target.value });
                      } else {
                        setHotelData({ ...hotelData, location: e.target.value });
                      }
                    }}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    required
                  >
                    <option value=''>Select location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
                >
                  {activeTab === 'transport' ? 'Save Transport' : 'Save Hotel'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
