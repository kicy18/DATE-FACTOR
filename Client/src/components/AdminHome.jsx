import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import login_df_logo from '../assets/login_df_logo.svg'
import person from '../assets/person.svg'
import Restaurant from './Restaurant.jsx'
import SearchCoupon from './SearchCoupon'
import apiClient from '../services/apiClient'

function AdminHome() {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [listStatus, setListStatus] = useState({ loading: false, error: '' })
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    priceMale: '399',
    priceFemale: '199'
  })
  const [formStatus, setFormStatus] = useState({ loading: false, error: '', success: '' })
  const [deleteStatus, setDeleteStatus] = useState({ id: '', loading: false })
  const dropdownRef = useRef(null)
  const userName = localStorage.getItem('userName') || 'User'
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('gender')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }
  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'admin') {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const normalizeRestaurant = data => ({
    ...data,
    id: data._id || data.id,
    address: data.location || data.address || ''
  })

  const fetchRestaurants = async () => {
    setListStatus({ loading: true, error: '' })
    try {
      const { data } = await apiClient.get('/api/restaurants')
      if (!data.success) {
        throw new Error(data.message || 'Unable to fetch restaurants')
      }
      const normalized = (data.restaurants || []).map(normalizeRestaurant)
      setRestaurants(normalized)
      setListStatus({ loading: false, error: '' })
    } catch (error) {
      setRestaurants([])
      setListStatus({
        loading: false,
        error: error.response?.data?.message || error.message || 'Unable to fetch restaurants'
      })
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const handleFormChange = event => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddRestaurant = async event => {
    event.preventDefault()
    setFormStatus({ loading: true, error: '', success: '' })

    try {
      const payload = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        priceMale: Number(formData.priceMale) || 399,
        priceFemale: Number(formData.priceFemale) || 199
      }

      if (!payload.name || !payload.location) {
        setFormStatus({
          loading: false,
          error: 'Name and address are required',
          success: ''
        })
        return
      }

      const { data } = await apiClient.post('/api/restaurants', payload)
      if (!data.success) {
        throw new Error(data.message || 'Unable to create restaurant')
      }

      setRestaurants(prev => [normalizeRestaurant(data.restaurant), ...prev])
      setFormStatus({
        loading: false,
        error: '',
        success: 'Restaurant added successfully.'
      })
      setFormData({
        name: '',
        location: '',
        priceMale: '399',
        priceFemale: '199'
      })
    } catch (error) {
      setFormStatus({
        loading: false,
        error: error.response?.data?.message || error.message || 'Unable to create restaurant',
        success: ''
      })
    }
  }

  const handleDeleteRestaurant = async id => {
    if (!id) return
    const confirmDelete = window.confirm('Delete this restaurant? This action cannot be undone.')
    if (!confirmDelete) return

    setDeleteStatus({ id, loading: true })
    try {
      const { data } = await apiClient.delete(`/api/restaurants/${id}`)
      if (!data.success) {
        throw new Error(data.message || 'Unable to delete restaurant')
      }
      setRestaurants(prev => prev.filter(rest => rest.id !== id))
      if (selectedRestaurant?.id === id) {
        setSelectedRestaurant(null)
      }
      setDeleteStatus({ id: '', loading: false })
    } catch (error) {
      setDeleteStatus({ id: '', loading: false })
      alert(error.response?.data?.message || error.message || 'Unable to delete restaurant')
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
      className='min-h-screen bg-cover bg-center bg-no-repeat bg-[#FFC4C4] flex flex-col text-black'
    >
      <div className='flex flex-col h-full px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 overflow-y-auto'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-4 flex-shrink-0'>
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

        {/* Main Content - responsive flow */}
        <div className='flex-1 flex flex-col rounded-3xl bg-white/30 backdrop-blur px-3 sm:px-6 py-5 overflow-hidden'>
          {!selectedRestaurant ? (
            <div className='flex flex-col gap-5 flex-1 overflow-hidden'>
              <form
                onSubmit={handleAddRestaurant}
                className='bg-white/60 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-4 w-full'
              >
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                  <div>
                    <p className='text-xs uppercase tracking-wide text-gray-600'>
                      Manage Restaurants
                    </p>
                    <h2 className='text-xl font-bold text-gray-900'>Add a new partner</h2>
                  </div>
                  <button
                    type='button'
                    onClick={fetchRestaurants}
                    className='px-4 py-2 text-sm rounded-full border border-gray-300 hover:border-red-400 hover:text-red-500 transition cursor-pointer'
                    disabled={listStatus.loading}
                  >
                    {listStatus.loading ? 'Refreshing...' : 'Refresh list'}
                  </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                  <div className='flex flex-col gap-1 text-left'>
                    <label className='text-xs font-semibold text-gray-600'>Restaurant name</label>
                    <input
                      name='name'
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder='e.g. Date Cafe'
                      className='rounded-xl border border-transparent bg-white px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-red-400'
                    />
                  </div>
                  <div className='flex flex-col gap-1 text-left'>
                    <label className='text-xs font-semibold text-gray-600'>Address</label>
                    <input
                      name='location'
                      value={formData.location}
                      onChange={handleFormChange}
                      placeholder='Full address'
                      className='rounded-xl border border-transparent bg-white px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-red-400'
                    />
                  </div>
                  
                  <div className='grid grid-cols-2 sm:grid-cols-2 gap-2'>
                    <div className='flex flex-col gap-1 text-left'>
                      <label className='text-xs font-semibold text-gray-600'>Male price</label>
                      <input
                        name='priceMale'
                        value={formData.priceMale}
                        onChange={handleFormChange}
                        type='number'
                        min='0'
                        className='rounded-xl border border-transparent bg-white px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-red-400'
                      />
                    </div>
                    <div className='flex flex-col gap-1 text-left'>
                      <label className='text-xs font-semibold text-gray-600'>Female price</label>
                      <input
                        name='priceFemale'
                        value={formData.priceFemale}
                        onChange={handleFormChange}
                        type='number'
                        min='0'
                        className='rounded-xl border border-transparent bg-white px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-red-400'
                      />
                    </div>
                  </div>
                </div>

                {formStatus.error && (
                  <div className='text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2'>
                    {formStatus.error}
                  </div>
                )}
                {formStatus.success && (
                  <div className='text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-3 py-2'>
                    {formStatus.success}
                  </div>
                )}

                <button
                  type='submit'
                  disabled={formStatus.loading}
                  className='self-start bg-red-500 text-white rounded-xl px-5 py-2 text-sm font-semibold hover:bg-red-600 transition cursor-pointer disabled:opacity-60'
                >
                  {formStatus.loading ? 'Adding...' : 'Add restaurant'}
                </button>
              </form>

              {listStatus.error && (
                <div className='bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl px-4 py-3'>
                  {listStatus.error}
                </div>
              )}

              <Restaurant
                restaurants={restaurants}
                loading={listStatus.loading}
                deletingId={deleteStatus.loading ? deleteStatus.id : ''}
                onDelete={handleDeleteRestaurant}
                onSelect={restaurant => setSelectedRestaurant(restaurant)}
              />
            </div>
          ) : (
            <SearchCoupon
              key={selectedRestaurant.id}
              restaurant={selectedRestaurant}
              onBack={() => setSelectedRestaurant(null)}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default AdminHome
