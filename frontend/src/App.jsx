
import { Route, Routes } from 'react-router-dom'
import Login from '../src/pages/Admin/Login'
import Home from '../src/pages/Patient/Home'
import Dashboard from '../src/pages/Admin/Dashboard'
import AdminLayout from '../src/pages/Admin/AdminLayout'
import AdminDashboard from '../src/pages/Admin/Dashboard'
import VisitForm from './pages/Doctor/visitRecord'
import AdminPendingDoctors from '../src/pages/Admin/PendingList'
import  DoctorList from '../src/pages/Admin/DoctorList'
import './App.css'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import DoctorList from './pages/Admin/DoctorList'
import AdminPendingDoctors from './pages/Admin/AddDoctor'

function App() {
  
  const {token,role}=useSelector((state)=>state.auth)


  return token,role? (
    <>
   <Navbar/>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/admin/dashboard' element={<Dashboard/>}/>
      <Route path='/admin/doctors-list' element={<DoctorList/>}/>
      <Route path='/admin/add-doctor' element={<AdminPendingDoctors/>}/>
      <Route path='/doctor/dashboard' element={<DDashboard/>}/>
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
