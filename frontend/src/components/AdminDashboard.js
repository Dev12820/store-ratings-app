import React, { useState, useEffect, useCallback } from 'react';
import { getAdminDashboard, getAllUsers, getStoreOwners, adminCreateUser, adminCreateStore, getStores } from '../services/api';

// --- Create User Form Component ---
const CreateUserForm = ({ onUpdate }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            await adminCreateUser(formData);
            setMessage({ type: 'success', text: 'User created successfully!' });
            setFormData({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' }); // Reset form
            onUpdate(); // Trigger data refetch in parent
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create user.' });
        }
    };

    return (
        <div className="form-section">
            <h4>Create New User</h4>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address (Optional)" />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="NORMAL_USER">Normal User</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="SYSTEM_ADMIN">System Admin</option>
                </select>
                <button type="submit">Create User</button>
                {message.text && <p className={message.type}>{message.text}</p>}
            </form>
        </div>
    );
};

// --- Create Store Form Component ---
const CreateStoreForm = ({ onUpdate }) => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '', owner_id: '' });
    const [owners, setOwners] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await getStoreOwners();
                setOwners(response.data);
            } catch (error) {
                console.error("Could not fetch store owners", error);
            }
        };
        fetchOwners();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        if (!formData.owner_id) {
            setMessage({ type: 'error', text: 'Please select a store owner.' });
            return;
        }
        try {
            const dataToSend = { ...formData, owner_id: parseInt(formData.owner_id, 10) };
            await adminCreateStore(dataToSend);
            setMessage({ type: 'success', text: 'Store created successfully!' });
            setFormData({ name: '', email: '', address: '', owner_id: '' }); // Reset form
            onUpdate(); // Trigger data refetch in parent
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create store.' });
        }
    };

    return (
        <div className="form-section">
            <h4>Create New Store</h4>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Store Name" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Store Email" required />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Store Address" required />
                <select name="owner_id" value={formData.owner_id} onChange={handleChange} required>
                    <option value="">-- Select an Owner --</option>
                    {owners.map(owner => (
                        <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                    ))}
                </select>
                <button type="submit">Create Store</button>
                {message.text && <p className={message.type}>{message.text}</p>}
            </form>
        </div>
    );
};


// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, storesRes] = await Promise.all([
        getAdminDashboard(),
        getAllUsers(),
        getStores(), // Fetch stores
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Stores</h3>
          <p>{stats.totalStores}</p>
        </div>
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <p>{stats.totalRatings}</p>
        </div>
      </div>

      <div className="admin-forms-container">
          <CreateUserForm onUpdate={fetchData} />
          <CreateStoreForm onUpdate={fetchData} />
      </div>

      <h3>All Users</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address || 'N/A'}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{marginTop: '2rem'}}>All Stores</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Owner ID</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.owner_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;