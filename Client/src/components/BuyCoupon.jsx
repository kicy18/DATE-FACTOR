import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import buycoupon_bg from '../assets/buycoupon_bg.svg'
import login_df_logo from '../assets/login_df_logo.svg'
import person from '../assets/person.svg'

function BuyCoupon() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const locationGender = location.state?.gender
  const storedGender = localStorage.getItem('gender')
  const gender = locationGender || storedGender || 'female'
  const userName = localStorage.getItem('userName') || 'User'
  const price = gender === 'male' ? '₹399' : '₹199'
  const priceMessage =
    gender === 'male'
      ? 'Gentlemen, grab your Date Coupon for ₹399 and make your next meet-up unforgettable.'
      : 'Ladies enjoy the Date Coupon for just ₹199—step into a real connection today.'

  useEffect(() => {
    if (locationGender) {
      localStorage.setItem('gender', locationGender)
    }
  }, [locationGender])

  const handleBuyCoupon = () => {
    // Directly navigate to payment page with gender info only
    navigate('/payment', {
      state: { gender }
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('gender')
    localStorage.removeItem('userRole')
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
      className='h-screen bg-cover bg-center bg-no-repeat flex flex-col text-white overflow-hidden'
      style={{ backgroundImage: `url(${buycoupon_bg})` }}
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
              <h1 className='text-sm sm:text-base'>{userName}</h1>
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

        {/* Main Content - Centered and compact */}
        <div className='flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 text-center max-w-3xl mx-auto flex-1 px-4'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 leading-tight'>
            Get Your Date Coupon Now!
          </h1>
          <p className='text-sm sm:text-base md:text-lg text-gray-100 max-w-2xl'>
            Love shouldn't just stay online. Redeem your moment today!
          </p>
          <p className='text-xs sm:text-sm md:text-base text-gray-200 max-w-2xl'>
            Get an exclusive Date Coupon and enjoy a real-life blind date experience at our partner restaurants.
          </p>
          
          <div className='flex flex-col items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3'>
            <p className='text-lg sm:text-xl md:text-2xl font-semibold text-red-200'>
              Price: {price} only
            </p>
            <p className='text-xs sm:text-sm md:text-base text-gray-100 max-w-xl'>
              {priceMessage}
            </p>
            <button 
              onClick={handleBuyCoupon}
              className='bg-red-600 hover:bg-red-700 rounded-xl px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-sm sm:text-base font-semibold cursor-pointer transition mt-1 sm:mt-2 w-full sm:w-auto'
            >
              GET YOUR DATE
            </button>
            <p className='text-xs sm:text-sm mt-2 sm:mt-3 text-gray-200 max-w-xl'>
              Why wait? Grab your coupon now and turn your match into a real connection.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BuyCoupon
