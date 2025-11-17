import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import result_bg from '../assets/result_bg.svg'
import login_df_logo from '../assets/login_df_logo.svg'
import person from '../assets/person.svg'
import { restaurantDdata } from '../assets/assets'
import Restaurant from './Restaurant.jsx'
import SearchCoupon from './SearchCoupon'

function AdminHome() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isRestaurant, setIsRestaurant] = useState(true)
  const dropdownRef = useRef(null)
  const userName = localStorage.getItem('userName') || 'User'
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <section
      className='h-screen bg-cover bg-center bg-no-repeat bg-[#FFC4C4] flex flex-col text-black overflow-hidden'
    >
      <div className='flex flex-col h-full px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mb-2 sm:mb-4 flex-shrink-0'>
          <img src={login_df_logo} alt='Date Factor' className='w-28 sm:w-32 md:w-40' />
          <div className='relative' ref={dropdownRef}>
            <div
              className='flex gap-2 items-center justify-center bg-black/40 px-3 py-2 rounded-full cursor-pointer hover:bg-black/60 transition'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src={person} alt='profile icon' width={20} />
              <h1 className='text-sm text-white sm:text-base'>{userName}</h1>
            </div>
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-40 bg-black/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden z-50'>
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-3 text-sm text-white hover:bg-red-600/80 transition cursor-pointer'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Centered and responsive */}
        {!isRestaurant  && <Restaurant/>}
        {isRestaurant  && <SearchCoupon/>}
      </div>
    </section>
  )
}

export default AdminHome
