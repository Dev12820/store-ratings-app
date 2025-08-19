import React, { useState, useEffect, useCallback } from 'react';
import { getStores, rateStore } from '../services/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const params = { name: searchTerm };
      const response = await getStores(params);
      setStores(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRating = async (storeId, value) => {
    try {
        await rateStore(storeId, value);
        // Refetch stores to show the updated rating
        fetchStores();
    } catch (err) {
        alert('Failed to submit rating.');
        console.error(err);
    }
  };

  if (loading) return <div>Loading stores...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>All Stores</h2>
      <input 
        type="text" 
        placeholder="Search by store name..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Submit/Update Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>{store.overallRating ? store.overallRating.toFixed(1) : 'N/A'}</td>
                <td>{store.myRating || 'Not Rated'}</td>
                <td>
                  <div>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => handleRating(store.id, star)}>
                        {star}★
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreList;