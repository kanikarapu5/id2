import React from 'react';
import UserList from '../admin/UserList';
import DownloadButton from '../layout/DownloadButton';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <DownloadButton />
      <UserList />
    </div>
  );
};

export default AdminDashboard;
