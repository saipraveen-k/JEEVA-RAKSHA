'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSweetAlert } from '@/hooks/useSweetAlert';
import { useAOS } from '@/hooks/useAOS';
import toast from 'react-hot-toast';
import { MapPin, Send, CheckCircle, AlertCircle, Loader2, RefreshCw, BarChart3 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import { CaseStatusChart } from '@/components/Charts/CaseStatusChart';

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
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function UserDashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { location: geoLocation, loading: locationLoading, error: locationError, accuracy, fetchLocation, clearLocation } = useGeolocation();
  const [cases, setCases] = useState<Case[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingCase, setUpdatingCase] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    animalType: '',
    description: '',
    image: null as File | null,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
      return;
    }

    if (isAuthenticated) {
      fetchCases();
    }
  }, [isAuthenticated, loading, router]);

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
      setDataLoading(false);
    }
  };

  const updateCaseStatus = async (caseId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      setUpdatingCase(caseId); // Set loading state

      console.log('🔄 UPDATING CASE STATUS:', {
        caseId,
        newStatus,
        token: token.substring(0, 20) + '...'
      });

      const response = await fetch(`http://localhost:5000/api/cases/${caseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('📡 API RESPONSE STATUS:', response.status);
      
      const data = await response.json();
      console.log('📡 API RESPONSE DATA:', data);
      
      if (data.success) {
        toast.success(data.message || `Case marked as ${newStatus.replace('_', ' ')}!`);
        fetchCases(); // Refresh the cases list
      } else {
        toast.error(data.message || 'Failed to update case status');
      }
    } catch (error) {
      console.error('❌ NETWORK ERROR:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setUpdatingCase(null); // Clear loading state
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!geoLocation) {
      toast.error('Location is required. Please enable location services.');
      return;
    }

    if (!formData.animalType || !formData.description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const formDataObj = new FormData();
      formDataObj.append('animalType', formData.animalType);
      formDataObj.append('description', formData.description);
      formDataObj.append('location', JSON.stringify(geoLocation));
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }

      const response = await fetch('http://localhost:5000/api/cases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataObj,
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
      console.error('Error submitting case:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        {loading ? (
          <div className="text-center py-8">
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Access denied</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Form */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Send className="w-5 h-5 mr-2 text-blue-500" />
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
                        <SelectItem value="dog">🐕 Dog</SelectItem>
                        <SelectItem value="cat">🐈 Cat</SelectItem>
                        <SelectItem value="bird">🦅 Bird</SelectItem>
                        <SelectItem value="rabbit">🐰 Rabbit</SelectItem>
                        <SelectItem value="other">🐾 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Describe the animal's condition and location..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Location Status */}
                  <div className="space-y-2">
                    {locationLoading && (
                      <div className="flex items-center text-sm text-blue-600">
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Fetching your location...
                      </div>
                    )}
                    
                    {locationError && (
                      <div className="flex items-start space-x-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{locationError}</p>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={fetchLocation}
                            className="p-0 h-auto text-red-600 underline"
                          >
                            Retry
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {geoLocation && (
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-green-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          Location detected
                        </div>
                        <div className="text-xs text-gray-500 ml-5">
                          {geoLocation.lat.toFixed(6)}, {geoLocation.lng.toFixed(6)}
                          {accuracy && ` (${accuracy.toFixed(0)}m accuracy)`}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={fetchLocation}
                          className="text-xs"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Refresh Location
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitting || !geoLocation || locationLoading}
                  >
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </form>
              </div>
            </div>

            {/* My Reports */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  My Reports
                </h2>
                
                {dataLoading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner size="lg" text="Loading your reports..." />
                  </div>
                ) : cases.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    </div>
                    <p className="text-gray-500 text-lg">No reports yet</p>
                    <p className="text-gray-400 text-sm">Submit your first report to help an animal in need!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cases.map((caseItem) => (
                      <div key={caseItem._id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 animate-slideIn">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium capitalize">{caseItem.animalType}</span>
                            <StatusBadge status={caseItem.status} />
                            <PriorityBadge priority={caseItem.priority} />
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(caseItem.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{caseItem.description}</p>
                        
                        {caseItem.image && (
                          <img 
                            src={caseItem.image} 
                            alt={caseItem.animalType}
                            className="w-32 h-32 object-cover rounded-md mb-2"
                          />
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          {caseItem.location.address || `${caseItem.location.lat.toFixed(4)}, ${caseItem.location.lng.toFixed(4)}`}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {caseItem.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateCaseStatus(caseItem._id, 'in_progress')}
                              className="text-blue-600 hover:text-blue-700"
                              disabled={updatingCase === caseItem._id}
                            >
                              {updatingCase === caseItem._id ? (
                                <>
                                  <LoadingSpinner size="sm" />
                                  Updating...
                                </>
                              ) : (
                                'Start Working'
                              )}
                            </Button>
                          )}
                          {caseItem.status === 'in_progress' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateCaseStatus(caseItem._id, 'resolved')}
                              className="text-green-600 hover:text-green-700"
                              disabled={updatingCase === caseItem._id}
                            >
                              {updatingCase === caseItem._id ? (
                                <>
                                  <LoadingSpinner size="sm" />
                                  Updating...
                                </>
                              ) : (
                                'Mark as Resolved'
                              )}
                            </Button>
                          )}
                          {caseItem.status === 'resolved' && (
                            <span className="text-sm text-green-600 font-medium">
                              ✅ Case Resolved
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
