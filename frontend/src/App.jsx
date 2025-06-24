
import { Route, Routes } from 'react-router-dom'
import Login from '../src/pages/Admin/Login'
import Home from '../src/pages/Patient/Home'
import Dashboard from '../src/pages/Admin/Dashboard'
import DDashboard from '../src/pages/Doctor/Dashboard'
import AdminLayout from '../src/pages/Admin/AdminLayout'
import AdminDashboard from '../src/pages/Admin/Dashboard'
import VisitForm from './pages/Doctor/visitRecord'
import AdminPendingDoctors from '../src/pages/Admin/PendingList'

import  DoctorList from '../src/pages/Admin/DoctorList'


import './App.css'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'


function App() {
  
  const {token,role}=useSelector((state)=>state.auth)


  return token,role? (
    <>
   <Navbar/>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/admin/dashboard' element={<Dashboard/>}/>
      <Route path='/doctor/dashboard' element={<DDashboard/>}/>
      <Route path='/doctor/visit-record' element={<VisitForm patientId="dummyPatientId" appointmentId="dummyAppointmentId" patientName="John Doe"/>}/>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path='add-doctor' element={<AdminPendingDoctors/>}/>
        <Route path='doctors-list' element={<DoctorList/>}/>
       
      </Route>
      <Route path='/patient/home' element={<Home/>}/>
    </Routes>
  
    </>
  ):(
    <>
    <Login/>
    </>
  )
}

export default App
