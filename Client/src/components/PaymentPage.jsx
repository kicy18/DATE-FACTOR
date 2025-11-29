import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import buycoupon_bg from '../assets/buycoupon_bg.svg'
import login_df_logo from '../assets/login_df_logo.svg'
import person from '../assets/person.svg'
import apiClient from '../services/apiClient.js'
import qr from '../assets/qr.jpg'

function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dropdownRef = useRef(null)
  const fileInputRef = useRef(null)
  const locationGender = location.state?.gender
  const storedGender = localStorage.getItem('gender')
  const gender = locationGender || storedGender || 'female'
  const userName = localStorage.getItem('userName') || 'User'
  const amount = location.state?.amount || (gender === 'male' ? 399 : 199)
  const price = `₹${amount}`

  useEffect(() => {
    if (locationGender) {
      localStorage.setItem('gender', locationGender)
    }
    // Redirect if no QR code
    if (!qr) {
      navigate('/buycoupon')
    }

  }, [locationGender, qr , navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('gender')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setPaymentScreenshot(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setScreenshotPreview(reader.result)
        }
        reader.readAsDataURL(file)
        setError('')
      } else {
        setError('Please select an image file')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!paymentScreenshot) {
      setError('Please upload payment screenshot')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Screenshot = reader.result
        
        const userEmail = localStorage.getItem('userEmail') || ''
        if (!userEmail) {
          setError('User email not found. Please login again.')
          setLoading(false)
          return
        }

        try {
          const { data } = await apiClient.post('/api/user/submit-payment', {
            userEmail: userEmail,
            paymentScreenshot: base64Screenshot
          })

          if (data.success) {
            // Navigate to result page with coupon information
            navigate('/result', {
              state: {
                coupon: data.coupon
              }
            })
          } else {
            setError(data.message || 'Failed to submit payment')
          }
        } catch (err) {
          console.error('Error submitting payment:', err)
          setError(err.response?.data?.message || 'Failed to submit payment. Please try again.')
        } finally {
          setLoading(false)
        }
      }
      reader.readAsDataURL(paymentScreenshot)
    } catch (err) {
      console.error('Error processing screenshot:', err)
      setError('Failed to process screenshot. Please try again.')
      setLoading(false)
    }
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
      className='min-h-screen bg-cover bg-center bg-no-repeat flex flex-col text-white'
      style={{ backgroundImage: `url(${buycoupon_bg})` }}
    >
      <div className='flex flex-col h-full px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 overflow-y-auto'>
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
        <div className='flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 text-center max-w-3xl mx-auto flex-1 w-full px-2 sm:px-4'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 leading-tight'>
            Complete Your Payment
          </h1>
          <p className='text-sm sm:text-base md:text-lg text-gray-100 max-w-2xl'>
            Scan the QR code below to make payment of {price}
          </p>

          {/* QR Code Display */}
        {qr && (
            <div className='flex flex-col items-center gap-3 sm:gap-4 bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 w-full'>
              <img
                src={qr}
                alt='Payment QR Code'
                className='w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-white p-2 rounded-lg object-contain'
              />
              <p className='text-xs sm:text-sm text-gray-200'>
                Scan with any UPI app to pay
              </p>
            </div>
          )}

          {/* Payment Screenshot Upload */}
          <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4 sm:gap-5 w-full max-w-lg'>
            <div className='flex flex-col gap-3 w-full text-left'>
              <label className='text-sm sm:text-base font-semibold text-gray-100'>
                Upload Payment Screenshot
              </label>
              <input
                type='file'
                accept='image/*'
                onChange={handleScreenshotChange}
                ref={fileInputRef}
                className='hidden'
              />
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-3 text-sm sm:text-base font-semibold cursor-pointer transition w-full'
              >
                {screenshotPreview ? 'Change Screenshot' : 'Choose File'}
              </button>
              {screenshotPreview && (
                <div className='mt-2'>
                  <img 
                    src={screenshotPreview} 
                    alt='Screenshot preview' 
                    className='max-w-full max-h-64 rounded-lg border-2 border-gray-600'
                  />
                </div>
              )}
            </div>

            {error && (
              <p className='text-red-400 text-xs sm:text-sm'>{error}</p>
            )}

            <button
              type='submit'
              disabled={loading || !paymentScreenshot}
              className='bg-red-600 hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-xl px-8 py-3 text-sm sm:text-base font-semibold cursor-pointer transition w-full'
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default PaymentPage
