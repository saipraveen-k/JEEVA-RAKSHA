'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { MapPin, Camera, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Case {
  _id: string;
  animalType: string;
  description: string;
  image?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}

export default function UserDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    animalType: '',
    description: '',
    image: null as File | null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    fetchCases();
    getCurrentLocation();
  }, [isAuthenticated, router]);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cases', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setCases(data.cases);
      }
    } catch (error) {
      toast.error('Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location');
        }
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      toast.error('Location is required. Please enable location services.');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('animalType', formData.animalType);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', JSON.stringify(location));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('http://localhost:5000/api/cases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Case reported successfully!');
        setFormData({ animalType: '', description: '', image: null });
        fetchCases();
      } else {
        toast.error(data.message || 'Failed to report case');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🐾 JEEVA RAKSHA</h1>
              <span className="ml-4 text-sm text-gray-500">User Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Report Animal in Need
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Animal Type
                  </label>
                  <Select value={formData.animalType} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, animalType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="cow">Cow</SelectItem>
                      <SelectItem value="goat">Goat</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the animal's condition..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location ? 
                    `Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 
                    'Getting location...'
                  }
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={submitting || !location}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </form>
            </div>
          </div>

          {/* My Reports */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">My Reports</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading your reports...</p>
                </div>
              ) : cases.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reports yet. Submit your first report!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cases.map((caseItem) => (
                    <div key={caseItem._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium capitalize">{caseItem.animalType}</span>
                          <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(caseItem.status)}`}>
                            {getStatusIcon(caseItem.status)}
                            <span className="capitalize">{caseItem.status.replace('_', ' ')}</span>
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(caseItem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{caseItem.description}</p>
                      
                      {caseItem.image && (
                        <img 
                          src={caseItem.image} 
                          alt="Report image" 
                          className="w-32 h-32 object-cover rounded-md mb-2"
                        />
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {caseItem.location.address || `${caseItem.location.lat.toFixed(4)}, ${caseItem.location.lng.toFixed(4)}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
