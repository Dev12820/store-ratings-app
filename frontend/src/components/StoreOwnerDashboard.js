import React, { useState, useEffect } from 'react';
import { getOwnerDashboard } from '../services/api';

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await getOwnerDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch owner dashboard", error);
        setError('Could not load your store data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading your dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dashboardData) return <div>No store data found for your account.</div>;

  return (
    <div>
      <h2>{dashboardData.storeName} - Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p>{dashboardData.averageRating.toFixed(1)} / 5</p>
        </div>
        <div className="stat-card">
          <h3>Total Ratings Received</h3>
          <p>{dashboardData.ratings.length}</p>
        </div>
      </div>
      
      <h3>Ratings Received</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.ratings.length > 0 ? (
                dashboardData.ratings.map((rating, index) => (
                  <tr key={index}>
                    <td>{rating.userName}</td>
                    <td>{rating.ratingValue} ★</td>
                    <td>{new Date(rating.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>No ratings have been submitted yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
