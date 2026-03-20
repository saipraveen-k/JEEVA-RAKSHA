'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { useSweetAlert } from '@/hooks/useSweetAlert';
import { useAOS } from '@/hooks/useAOS';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Activity,
  Eye,
  Trash2,
  Layers,
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff,
  BarChart3,
  PieChart
} from 'lucide-react';
import AdminMap from '@/components/AdminMap';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import { CaseStatusChart } from '@/components/Charts/CaseStatusChart';
import { CaseDistributionChart } from '@/components/Charts/CaseDistributionChart';
import { apiService } from '@/lib/api';
import { Case } from '@/types/case';

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

function AdminDashboard() {
  const { user, logout, isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  // Real-time updates
  const { isConnected, connectionError } = useRealtimeUpdates({
    enabled: isAuthenticated && isAdmin,
    onNewCase: (caseData: unknown) => {
      // Add new case to the list
      if (caseData && typeof caseData === 'object' && 'case' in caseData) {
        const newCase = (caseData as any).case;
        setCases(prev => [newCase, ...prev]);
        setStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
      }
    },
    onCaseUpdated: (caseData: unknown) => {
      // Update existing case
      if (caseData && typeof caseData === 'object' && 'case' in caseData) {
        const updatedCase = (caseData as any).case;
        setCases(prev => prev.map(c => c._id === updatedCase._id ? updatedCase : c));
        fetchStats(); // Refresh stats
      }
    },
    onCaseDeleted: (caseId: string) => {
      // Remove deleted case
      setCases(prev => prev.filter(c => c._id !== caseId));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
    }
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
      return;
    }

    if (isAuthenticated && isAdmin) {
      fetchCases();
      fetchStats();
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  const fetchCases = async () => {
    try {
      setDataLoading(true);
      const response = await apiService.getCases();
      
      if (response.success) {
        setCases(response.cases);
        const locations = response.cases.map((c: Case) => ({
          _id: c._id,
          location: c.location,
          status: c.status,
          priority: c.priority,
          animalType: c.animalType
        }));
        setMapLocations(locations);
      } else {
        throw new Error(response.message || 'Failed to fetch cases');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch cases');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getStats();
      
      if (response.success) {
        setStats(response.stats);
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch stats');
    }
  };

  const updateCaseStatus = async (caseId: string, status: string) => {
    try {
      const response = await apiService.updateCase(caseId, { status });
      
      if (response.success) {
        toast.success(`Case ${status === 'in_progress' ? 'started' : status === 'resolved' ? 'resolved' : 'updated'} successfully!`);
        fetchCases();
        fetchStats();
        setSelectedCase(null);
      } else {
        throw new Error(response.message || 'Failed to update case');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update case');
    }
  };

  const deleteCase = async (caseId: string) => {
    if (!confirm('Are you sure you want to delete this case?')) {
      return;
    }

    try {
      const response = await apiService.deleteCase(caseId);
      
      if (response.success) {
        toast.success('Case deleted successfully!');
        fetchCases();
        fetchStats();
        setSelectedCase(null);
      } else {
        throw new Error(response.message || 'Failed to delete case');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete case');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading State */}
      {loading && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center fixed inset-0 z-50">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        </div>
      )}

      {/* Access Denied State */}
      {!loading && (!isAuthenticated || !isAdmin) && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Access denied</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && isAuthenticated && isAdmin && (
        <>
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
                  <Button onClick={() => logout()} variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Cases"
                value={stats.total}
                icon={<Users className="w-6 h-6" />}
                color="blue"
                trend={{ value: 12, isUp: true }}
              />
              <StatsCard
                title="Pending"
                value={stats.pending}
                icon={<Clock className="w-6 h-6" />}
                color="orange"
              />
              <StatsCard
                title="In Progress"
                value={stats.inProgress}
                icon={<Activity className="w-6 h-6" />}
                color="blue"
              />
              <StatsCard
                title="Resolved"
                value={stats.resolved}
                icon={<CheckCircle className="w-6 h-6" />}
                color="green"
              />
            </div>

            {/* Cases Table */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">All Cases</h2>
              </div>
              
              {dataLoading ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="lg" text="Loading cases..." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
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
                      {cases.map((caseItem, index) => (
                        <tr key={caseItem._id} className="hover:bg-gray-50 animate-slideIn" style={{ animationDelay: `${index * 50}ms` }}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="capitalize font-medium">{caseItem.animalType}</span>
                              {caseItem.image && (
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                                  <img 
                                    src={caseItem.image} 
                                    alt={caseItem.animalType}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{caseItem.createdBy?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{caseItem.createdBy?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={caseItem.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <PriorityBadge priority={caseItem.priority} />
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

            {/* Map View */}
            {showMap && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-500" />
                  Case Locations Map
                </h2>
                <div className="h-96">
                  <AdminMap 
                    cases={cases} 
                    loading={loading}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Case Details Modal */}
            {selectedCase && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Case Details</h3>
                    <button
                      onClick={() => setSelectedCase(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <strong>Animal Type:</strong> {selectedCase.animalType}
                    </div>
                    <div>
                      <strong>Description:</strong> {selectedCase.description}
                    </div>
                    <div>
                      <strong>Status:</strong> <StatusBadge status={selectedCase.status} />
                    </div>
                    <div>
                      <strong>Priority:</strong> <PriorityBadge priority={selectedCase.priority} />
                    </div>
                    <div>
                      <strong>Reporter:</strong> {selectedCase.createdBy?.name || 'Unknown'} ({selectedCase.createdBy?.email || 'N/A'})
                    </div>
                    <div>
                      <strong>Location:</strong> {selectedCase.location.address || `${selectedCase.location.lat.toFixed(4)}, ${selectedCase.location.lng.toFixed(4)}`}
                    </div>
                    <div>
                      <strong>Created:</strong> {new Date(selectedCase.createdAt).toLocaleString()}
                    </div>
                    
                    {selectedCase.image && (
                      <div>
                        <strong>Image:</strong>
                        <img 
                          src={selectedCase.image} 
                          alt={selectedCase.animalType}
                          className="mt-2 max-w-full h-48 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <Button
                        onClick={() => updateCaseStatus(selectedCase._id, 'in_progress')}
                        disabled={selectedCase.status !== 'pending'}
                      >
                        Start Working
                      </Button>
                      <Button
                        onClick={() => updateCaseStatus(selectedCase._id, 'resolved')}
                        disabled={selectedCase.status !== 'in_progress'}
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default React.memo(AdminDashboard);
