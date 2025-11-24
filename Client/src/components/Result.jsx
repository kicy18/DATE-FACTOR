import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import result_bg from '../assets/result_bg.svg'
import login_df_logo from '../assets/login_df_logo.svg'
import person from '../assets/person.svg'

function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const userName = localStorage.getItem('userName') || 'User'
  const coupon = location.state?.coupon
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('gender')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                   day === 2 || day === 22 ? 'nd' : 
                   day === 3 || day === 23 ? 'rd' : 'th'
    return `${day}${suffix} ${month} ${year}`
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
      style={{ backgroundImage: `url(${result_bg})` }}
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

        {/* Main Content - Centered and responsive */}
        <div className='flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 text-center flex-1 px-4 overflow-y-auto'>
          {/* Success Message Card */}
          <div className='flex flex-col gap-2 sm:gap-3  backdrop-blur-sm w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-4xl p-2 sm:p-3 text-red-700 font-bold leading-tight'>
              Your Date Coupon is Ready! 💌
            </h1>
            <p className='text-xs sm:text-sm md:text-base p-2 sm:p-3 text-gray-100 leading-relaxed'>
              Use this exclusive coupon to plan your offline date this week. Don't wait — your special moment is just one step away!
            </p>
          </div>

          {/* Coupon Card */}
          {coupon ? (
            <div className='flex flex-col bg-gradient-to-b from-[#FF0066] to-[#8B0033] shadow-lg py-5 sm:py-6 md:py-7 px-4 sm:px-6 md:px-8 lg:px-8 gap-2 sm:gap-3 items-center justify-center rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-lg md:max-w-xl'>
              <h1 className='text-xl sm:text-2xl md:text-3xl font-bold'>DATE COUPON</h1>
              <div className='text-base sm:text-lg md:text-xl lg:text-2xl bg-white/20 mt-3 sm:mt-4 rounded-lg w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] p-2 sm:p-3 text-center font-mono font-semibold'>
                Code: {coupon.couponCode}
              </div>
              {coupon.restaurantName && (
                <p className='pt-2 sm:pt-3 text-xs sm:text-sm md:text-base lg:text-lg font-semibold'>
                  Restaurant: {coupon.restaurantName}
                </p>
              )}
              <p className='pt-1 sm:pt-2 text-xs sm:text-sm md:text-base lg:text-lg'>
                Valid Till: {formatDate(coupon.expiryDate)}
              </p>
              <p className='text-xs sm:text-sm md:text-base text-center px-2 sm:px-4'>
                Status: {coupon.status === 'pending_validation' ? 'Pending Admin Validation' : coupon.status}
              </p>
              <p className='text-xs sm:text-sm md:text-base text-center px-2 sm:px-4 mt-2'>
                Terms: Valid only for one meetup. Non-transferable.
              </p>
            </div>
          ) : (
            <div className='flex flex-col bg-gradient-to-b from-[#FF0066] to-[#8B0033] shadow-lg py-5 sm:py-6 md:py-7 px-4 sm:px-6 md:px-8 lg:px-8 gap-2 sm:gap-3 items-center justify-center rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-lg md:max-w-xl'>
              <h1 className='text-xl sm:text-2xl md:text-3xl font-bold'>DATE COUPON</h1>
              <p className='text-sm sm:text-base text-center px-2 sm:px-4'>
                No coupon information available. Please purchase a coupon first.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Result
