import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    const state = location.state;
    if (state && state.updatedUser) {
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === state.updatedUser.id ? state.updatedUser : u
      ));
    }
  }, [location.state]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      toast("User deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete user.");
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-users bg-overlay min-h-screen flex items-center justify-center p-6">
      <div className="content max-w-7xl w-full bg-white rounded-xl shadow-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
              }}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full mx-auto" />
              <h2 className="text-xl font-semibold text-center mt-3 text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => navigate(`/edit/${user.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 disabled:opacity-50 transition duration-200"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 disabled:opacity-50 transition duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;