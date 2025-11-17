import './App.css'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import BuyCoupon from './components/BuyCoupon.jsx'
import Footer from './components/Footer.jsx'
import { Route, Routes } from 'react-router-dom'
import Result from './components/Result.jsx'
import AdminHome from './components/AdminHome.jsx'
function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/buycoupon' element={<BuyCoupon/>} />
      <Route path='/result' element={<Result/>} />
      <Route path='/adminhome' element={<AdminHome/>} />
    </Routes>
     <Footer/>
  
    </>
  )
}

export default App
