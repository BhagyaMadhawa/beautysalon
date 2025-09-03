import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, Clock, User, Building, Scissors, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import Sidebar from '../components/sidebar';
import { getFullImageUrl } from '../lib/imageUtils';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [userToApprove, setUserToApprove] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [userToReject, setUserToReject] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api('/api/admin/users', {
        method: 'GET'
      });
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (user) => {
    setUserToApprove(user);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!userToApprove) return;

    try {
      await api(`/api/admin/approve/${userToApprove.id}`, {
        method: 'PATCH',
        body: { role: userToApprove.requesting_role }
      });
      fetchUsers();
      setShowApproveModal(false);
      setUserToApprove(null);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const cancelApprove = () => {
    setShowApproveModal(false);
    setUserToApprove(null);
  };

  const handleReject = async (userId, reason) => {
    try {
      await api(`/api/admin/reject/${userId}`, {
        method: 'PATCH',
        body: { reason }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await api(`/api/admin/delete/${userToDelete.id}`, {
        method: 'DELETE'
      });
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.requesting_role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.approval_status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'client': return <User className="w-4 h-4" />;
      case 'professional': return <Scissors className="w-4 h-4" />;
      case 'owner': return <Building className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'client': return 'text-blue-600 bg-blue-100';
      case 'professional': return 'text-purple-600 bg-purple-100';
      case 'owner': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center flex">
        <Sidebar />
        
        <div className="flex-1 ml-0 sm:ml-4">
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage user registrations and approvals</p>
              </div>
              
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {users.filter(u => u.requesting_role === 'client').length} Clients
                </div>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {users.filter(u => u.requesting_role === 'professional').length} Professionals
                </div>
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {users.filter(u => u.requesting_role === 'owner').length} Owners
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-puce focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-puce focus:border-transparent"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="client">Client</option>
                <option value="professional">Professional</option>
                <option value="owner">Salon Owner</option>
              </select>
              
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-puce focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-puce"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Registration Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              {user.profile_image_url ? (
                                <img src={getFullImageUrl(user.profile_image_url)} alt={user.first_name} className="w-10 h-10 rounded-full" />
                              ) : (
                                <span className="text-gray-500 font-semibold">
                                  {user.first_name?.[0]}{user.last_name?.[0]}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.requesting_role)}`}>
                            {getRoleIcon(user.requesting_role)}
                            {user.requesting_role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.approval_status)}`}>
                            {user.approval_status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {user.approval_status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {user.approval_status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {user.approval_status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            {user.approval_status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(user)}
                                  className="text-green-600 hover:text-green-800 p-1"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setUserToReject(user);
                                    setShowRejectModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Reject"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {(user.approval_status === 'approved' || user.approval_status === 'rejected') && (
                              <button
                                onClick={() => handleDelete(user)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Remove Account"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="View Details"
                            >
                              <User className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found matching your criteria
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-3 mb-4">
              <div>
                <span className="font-medium">Name:</span> {selectedUser.first_name} {selectedUser.last_name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {selectedUser.email}
              </div>
              <div>
                <span className="font-medium">Role:</span> {selectedUser.requesting_role}
              </div>
              <div>
                <span className="font-medium">Status:</span> {selectedUser.approval_status}
              </div>
              <div>
                <span className="font-medium">Registration Date:</span> {new Date(selectedUser.created_at).toLocaleDateString()}
              </div>
            </div>
            
            {selectedUser.approval_status === 'pending' && (
              <div className="space-y-3">
                <textarea
                  placeholder="Reason for rejection (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-puce focus:border-transparent"
                  rows={3}
                  id="rejectionReason"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const reason = document.getElementById('rejectionReason').value;
                      handleReject(selectedUser.id, reason);
                      setShowModal(false);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {selectedUser.approval_status !== 'pending' && (
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        title="Approve User"
        message={`Are you sure you want to approve the account for ${userToApprove?.first_name} ${userToApprove?.last_name}?`}
        onConfirm={confirmApprove}
        onCancel={cancelApprove}
      />
      
      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Reject User</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject the account for {userToReject?.first_name} {userToReject?.last_name}?
            </p>
            <textarea
              placeholder="Reason for rejection (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-puce focus:border-transparent mb-4"
              rows={3}
              id="rejectionReason"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const reason = document.getElementById('rejectionReason')?.value || '';
                  handleReject(userToReject.id, reason);
                  setShowRejectModal(false);
                  setUserToReject(null);
                }}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setUserToReject(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete User Account"
        message={`Are you sure you want to delete the account for ${userToDelete?.first_name} ${userToDelete?.last_name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default AdminDashboard;
