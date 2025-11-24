import React, { useEffect, useMemo, useState } from 'react'
import apiClient from '../services/apiClient'

function SearchCoupon({ restaurant, onBack }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState({ loading: false, error: '' })
  const [coupons, setCoupons] = useState([])
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [actionStatus, setActionStatus] = useState({ loading: false, error: '', message: '' })

  useEffect(() => {
    setQuery('')
    if (restaurant?.id) {
      fetchCoupons('')
    }
  }, [restaurant?.id])

  const fetchCoupons = async searchText => {
    if (!restaurant?.id) return
    setStatus({ loading: true, error: '' })
    try {
      const { data } = await apiClient.get('/api/user/coupons', {
        params: {
          restaurantId: restaurant.id,
          search: searchText.trim()
        }
      })

      if (!data.success) {
        throw new Error(data.message || 'Unable to fetch coupons')
      }

      setCoupons(data.coupons)
      setSelectedCoupon(data.coupons[0] ?? null)
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setCoupons([])
      setSelectedCoupon(null)
      setStatus({
        loading: false,
        error: error.response?.data?.message || error.message || 'Unable to fetch coupons'
      })
    }
  }

  const handleCouponAction = async (endpoint, successMessage) => {
    if (!selectedCoupon?.couponCode) return
    setActionStatus({ loading: true, error: '', message: '' })
    try {
      const { data } = await apiClient.post(endpoint, {
        couponCode: selectedCoupon.couponCode
      })
      if (!data.success) {
        throw new Error(data.message || 'Unable to process coupon')
      }
      setActionStatus({
        loading: false,
        error: '',
        message: successMessage
      })
      fetchCoupons(query)
    } catch (error) {
      setActionStatus({
        loading: false,
        error: error.response?.data?.message || error.message || 'Unable to process coupon',
        message: ''
      })
    }
  }

  const handleValidateCoupon = () =>
    handleCouponAction('/api/user/validate-coupon', 'Coupon validated and user notified.')

  const handleRejectCoupon = () =>
    handleCouponAction('/api/user/reject-coupon', 'Coupon deleted successfully.')

  const handleMarkUsed = () =>
    handleCouponAction('/api/user/mark-used-coupon', 'Coupon marked as used.')

  const handleSearchSubmit = event => {
    event.preventDefault()
    fetchCoupons(query)
  }

  const formatDate = value => {
    if (!value) return '—'
    return new Date(value).toLocaleDateString()
  }

  const selectedStatusBadge = useMemo(() => {
    if (!selectedCoupon) return null
    const badgeMap = {
      active: 'bg-green-100 text-green-700 border-green-200',
      used: 'bg-gray-200 text-gray-700 border-gray-300',
      expired: 'bg-orange-100 text-orange-700 border-orange-200',
      pending_validation: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return badgeMap[selectedCoupon.status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }, [selectedCoupon])

  return (
    <div className='flex flex-col gap-5 flex-1 w-full overflow-hidden'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3'>
        <div>
          <p className='text-sm text-gray-600 uppercase tracking-wide'>Restaurant</p>
          <h2 className='text-2xl font-bold text-gray-900'>{restaurant?.name}</h2>
          <p className='text-sm text-gray-700'>{restaurant?.address}</p>
        </div>
        <button
          onClick={onBack}
          className='self-start lg:self-auto px-4 py-2 rounded-full border border-gray-300 hover:border-red-400 hover:text-red-600 transition cursor-pointer text-sm font-medium'
        >
          ← Back to restaurants
        </button>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className='flex flex-col sm:flex-row gap-3 bg-white/60 rounded-2xl p-4 shadow-sm'
      >
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder='Search by coupon code, customer name or email'
          className='flex-1 rounded-xl border border-transparent bg-white px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:border-red-400'
        />
        <div className='flex gap-2'>
          <button
            type='submit'
            className='px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition cursor-pointer disabled:opacity-60'
            disabled={status.loading}
          >
            {status.loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type='button'
            onClick={() => {
              setQuery('')
              fetchCoupons('')
            }}
            className='px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:border-red-400 hover:text-red-500 transition cursor-pointer'
          >
            Reset
          </button>
        </div>
      </form>

      {status.error && (
        <div className='bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm'>
          {status.error}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-[1.4fr_2fr] gap-5 flex-1 overflow-hidden'>
        <div className='bg-white/70 rounded-2xl p-4 flex flex-col gap-3 overflow-hidden'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>Available coupons</h3>
            <span className='text-sm text-gray-600'>{coupons.length} found</span>
          </div>
          <div className='flex-1 overflow-y-auto pr-1 space-y-2'>
            {status.loading && (
              <div className='text-gray-600 text-sm'>Loading coupons...</div>
            )}
            {!status.loading && coupons.length === 0 && (
              <div className='text-gray-600 text-sm'>No coupons match the search.</div>
            )}
            {coupons.map(coupon => (
              <button
                key={coupon.couponCode}
                onClick={() => setSelectedCoupon(coupon)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition cursor-pointer ${
                  selectedCoupon?.couponCode === coupon.couponCode
                    ? 'border-red-400 bg-red-50'
                    : 'border-transparent bg-white hover:border-red-200'
                }`}
              >
                <p className='text-sm text-gray-500'>#{coupon.couponCode}</p>
                <p className='text-base font-semibold text-gray-900'>{coupon.customer?.name}</p>
                <p className='text-xs text-gray-500'>{coupon.customer?.email}</p>
              </button>
            ))}
          </div>
        </div>

        <div className='bg-white/80 rounded-2xl p-5 flex flex-col gap-3 overflow-y-auto'>
          <h3 className='text-lg font-semibold text-gray-900'>Coupon details</h3>
          {!selectedCoupon && (
            <p className='text-gray-600 text-sm'>Select a coupon to view its information.</p>
          )}
          {selectedCoupon && (
            <>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-2xl font-bold text-gray-900'>
                  {selectedCoupon.couponCode}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${selectedStatusBadge}`}>
                  {selectedCoupon.status}
                </span>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                <div className='bg-white rounded-xl p-3 shadow-sm'>
                  <p className='text-gray-500 text-xs uppercase tracking-wide'>Customer</p>
                  <p className='font-semibold text-gray-900'>{selectedCoupon.customer?.name}</p>
                  <p className='text-gray-700'>{selectedCoupon.customer?.email}</p>
                  <p className='text-gray-700 capitalize'>{selectedCoupon.customer?.gender}</p>
                  <p className='text-gray-700'>{selectedCoupon.customer?.phone}</p>
                </div>
                <div className='bg-white rounded-xl p-3 shadow-sm'>
                  <p className='text-gray-500 text-xs uppercase tracking-wide'>Coupon info</p>
                  <p className='text-gray-700'>Restaurant: {selectedCoupon.restaurantName || restaurant?.name}</p>
                  <p className='text-gray-700'>Purchase: {formatDate(selectedCoupon.purchaseDate)}</p>
                  <p className='text-gray-700'>Expires: {formatDate(selectedCoupon.expiryDate)}</p>
                </div>
              </div>
              {actionStatus.error && (
                <div className='text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2'>
                  {actionStatus.error}
                </div>
              )}
              {actionStatus.message && (
                <div className='text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-3 py-2'>
                  {actionStatus.message}
                </div>
              )}
              <div className='mt-2 flex flex-wrap gap-2'>
                {selectedCoupon.status !== 'active' && selectedCoupon.status !== 'used' && (
                  <button
                    type='button'
                    onClick={handleValidateCoupon}
                    disabled={actionStatus.loading || status.loading}
                    className='rounded-xl bg-green-600 text-white font-semibold px-4 py-2 cursor-pointer disabled:opacity-60'
                  >
                    {actionStatus.loading ? 'Processing...' : 'Validate coupon'}
                  </button>
                )}
                {selectedCoupon.status === 'active' && (
                  <button
                    type='button'
                    onClick={handleMarkUsed}
                    disabled={actionStatus.loading || status.loading}
                    className='rounded-xl bg-blue-600 text-white font-semibold px-4 py-2 cursor-pointer disabled:opacity-60'
                  >
                    {actionStatus.loading ? 'Processing...' : 'Mark as used'}
                  </button>
                )}
                <button
                  type='button'
                  onClick={handleRejectCoupon}
                  disabled={actionStatus.loading || status.loading}
                  className='rounded-xl bg-red-600 text-white font-semibold px-4 py-2 cursor-pointer disabled:opacity-60'
                >
                  {actionStatus.loading ? 'Processing...' : 'Reject / Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchCoupon
