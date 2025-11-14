import './App.css'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import BuyCoupon from './components/BuyCoupon.jsx'
import Footer from './components/Footer.jsx'
import { Route, Routes } from 'react-router-dom'
import Result from './components/Result.jsx'
function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/buycoupon' element={<BuyCoupon/>} />
      <Route path='/result' element={<Result/>} />
    </Routes>
     <Footer/>
  
    </>
  )
}

export default App
