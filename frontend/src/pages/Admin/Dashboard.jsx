import React from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'

const AdminDashboard = () => (
  <div className="admin-card">
    <h1>Welcome to Admin Dashboard</h1>
    <AdminLayout></AdminLayout>

  </div>
)

export default AdminDashboard