'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Activity,
  Eye,
  Trash2
} from 'lucide-react';
import MapComponent from '@/components/MapComponent';

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
  createdBy: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface MapLocation {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  priority: string;
  animalType: string;
}

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
      return;
    }

    fetchCases();
    fetchMapLocations();
    fetchStats();
  }, [isAuthenticated, isAdmin, router]);

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

  const fetchMapLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cases/map/locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setMapLocations(data.cases);
      }
    } catch (error) {
      console.error('Failed to fetch map locations:', error);
    }
  };

  const fetchStats = () => {
    const total = cases.length;
    const pending = cases.filter(c => c.status === 'pending').length;
    const inProgress = cases.filter(c => c.status === 'in_progress').length;
    const resolved = cases.filter(c => c.status === 'resolved').length;
    
    setStats({ total, pending, inProgress, resolved });
  };

  useEffect(() => {
    fetchStats();
  }, [cases]);

  const updateCaseStatus = async (caseId: string, status: string, notes?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cases/${caseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Case updated successfully!');
        fetchCases();
        fetchMapLocations();
        if (selectedCase?._id === caseId) {
          setSelectedCase(data.case);
        }
      } else {
        toast.error(data.message || 'Failed to update case');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const deleteCase = async (caseId: string) => {
    if (!confirm('Are you sure you want to delete this case?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cases/${caseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Case deleted successfully!');
        fetchCases();
        fetchMapLocations();
        if (selectedCase?._id === caseId) {
          setSelectedCase(null);
        }
      } else {
        toast.error(data.message || 'Failed to delete case');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || !isAdmin) {
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
              <span className="ml-4 text-sm text-gray-500">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowMap(!showMap)} 
                variant={showMap ? "default" : "outline"}
                size="sm"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
              <span className="text-sm text-gray-600">Admin: {user?.name}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">📍 Case Locations</h2>
            <div className="h-96 bg-gray-100 rounded-lg">
              <MapComponent 
                locations={mapLocations} 
                onLocationClick={(location) => {
                  const fullCase = cases.find(c => c._id === location._id);
                  if (fullCase) setSelectedCase(fullCase);
                }}
              />
            </div>
          </div>
        )}

        {/* Cases Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Cases</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading cases...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No cases reported yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Animal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cases.map((caseItem) => (
                    <tr key={caseItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="capitalize font-medium">{caseItem.animalType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{caseItem.createdBy.name}</div>
                        <div className="text-sm text-gray-500">{caseItem.createdBy.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                          {getStatusIcon(caseItem.status)}
                          <span className="ml-1 capitalize">{caseItem.status.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setSelectedCase(caseItem)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {caseItem.status === 'pending' && (
                            <Button
                              onClick={() => updateCaseStatus(caseItem._id, 'in_progress')}
                              size="sm"
                            >
                              Accept
                            </Button>
                          )}
                          
                          {caseItem.status === 'in_progress' && (
                            <Button
                              onClick={() => updateCaseStatus(caseItem._id, 'resolved')}
                              size="sm"
                              variant="secondary"
                            >
                              Resolve
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => deleteCase(caseItem._id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Case Details Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Case Details</h3>
                  <Button
                    onClick={() => setSelectedCase(null)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Animal Type</label>
                    <p className="capitalize">{selectedCase.animalType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedCase.status)}`}>
                      {selectedCase.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedCase.priority)}`}>
                      {selectedCase.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reported Date</label>
                    <p>{new Date(selectedCase.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1">{selectedCase.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reporter</label>
                  <p>{selectedCase.createdBy.name} ({selectedCase.createdBy.email})</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p>{selectedCase.location.address || `${selectedCase.location.lat.toFixed(4)}, ${selectedCase.location.lng.toFixed(4)}`}</p>
                </div>
                
                {selectedCase.image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <img 
                      src={selectedCase.image} 
                      alt="Case image" 
                      className="mt-1 w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
                
                <div className="flex space-x-2 pt-4">
                  {selectedCase.status === 'pending' && (
                    <Button
                      onClick={() => updateCaseStatus(selectedCase._id, 'in_progress')}
                    >
                      Accept Case
                    </Button>
                  )}
                  
                  {selectedCase.status === 'in_progress' && (
                    <Button
                      onClick={() => updateCaseStatus(selectedCase._id, 'resolved')}
                      variant="secondary"
                    >
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
