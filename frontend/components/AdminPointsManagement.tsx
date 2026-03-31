import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, TrendingUp, Award, Gift } from 'lucide-react';
import { apiService } from '@/lib/api';

interface UserWithPoints {
  _id: string;
  name: string;
  email: string;
  points: number;
  role: string;
  createdAt: string;
}

interface AdminPointsManagementProps {
  refreshTrigger?: number;
}

export default function AdminPointsManagement({ refreshTrigger }: AdminPointsManagementProps) {
  const [users, setUsers] = useState<UserWithPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithPoints | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users.sort((a: UserWithPoints, b: UserWithPoints) => b.points - a.points));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async () => {
    if (!selectedUser || !pointsToAdd) return;

    try {
      setUpdating(true);
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ points: parseInt(pointsToAdd) })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Added ${pointsToAdd} points to ${selectedUser.name}`);
        setPointsToAdd('');
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to add points');
      }
    } catch (error) {
      toast.error('Error adding points');
    } finally {
      setUpdating(false);
    }
  };

  const totalPointsAwarded = users.reduce((sum, user) => sum + user.points, 0);
  const averagePoints = users.length > 0 ? Math.round(totalPointsAwarded / users.length) : 0;
  const topUser = users.length > 0 ? users[0] : null;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Users</p>
                <p className="text-2xl font-bold text-purple-800">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Points</p>
                <p className="text-2xl font-bold text-green-800">{totalPointsAwarded}</p>
              </div>
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Average Points</p>
                <p className="text-2xl font-bold text-blue-800">{averagePoints}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Top User</p>
                <p className="text-lg font-bold text-yellow-800 truncate">
                  {topUser ? topUser.name : 'N/A'}
                </p>
                <p className="text-xs text-yellow-600">
                  {topUser ? `${topUser.points} pts` : ''}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Points Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Manual Points Addition */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Add Points Manually</h4>
            <div className="flex gap-3">
              <select 
                value={selectedUser?._id || ''}
                onChange={(e) => setSelectedUser(users.find(u => u._id === e.target.value) || null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select user...</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email}) - {user.points} pts
                  </option>
                ))}
              </select>
              <input 
                type="number"
                placeholder="Points"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(e.target.value)}
                min="1"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button 
                onClick={handleAddPoints}
                disabled={!selectedUser || !pointsToAdd || updating}
                className="px-6"
              >
                {updating ? 'Adding...' : 'Add Points'}
              </Button>
            </div>
          </div>

          {/* Users Leaderboard */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Users Leaderboard</h4>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b font-medium text-gray-700">Rank</th>
                      <th className="text-left p-3 border-b font-medium text-gray-700">Name</th>
                      <th className="text-left p-3 border-b font-medium text-gray-700">Email</th>
                      <th className="text-left p-3 border-b font-medium text-gray-700">Points</th>
                      <th className="text-left p-3 border-b font-medium text-gray-700">Role</th>
                      <th className="text-left p-3 border-b font-medium text-gray-700">Member Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">
                          <div className="flex items-center gap-2">
                            {index === 0 && <span className="text-2xl">🥇</span>}
                            {index === 1 && <span className="text-2xl">🥈</span>}
                            {index === 2 && <span className="text-2xl">🥉</span>}
                            {index > 2 && <span className="text-lg font-bold text-gray-500">#{index + 1}</span>}
                          </div>
                        </td>
                        <td className="p-3 border-b font-medium">{user.name}</td>
                        <td className="p-3 border-b text-gray-600">{user.email}</td>
                        <td className="p-3 border-b">
                          <span className="font-bold text-purple-600">{user.points}</span>
                        </td>
                        <td className="p-3 border-b">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 border-b text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
