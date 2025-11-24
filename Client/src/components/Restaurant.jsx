import React from 'react'

function Restaurant({ restaurants = [], loading = false, deletingId = '', onSelect, onDelete }) {
  return (
    <div className='flex flex-col gap-6 flex-1 w-full overflow-hidden text-left'>
      <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/40 rounded-2xl px-4 py-3 shadow-sm'>
        <div>
          <p className='text-sm uppercase tracking-wide text-gray-600'>Admin Dashboard</p>
          <h1 className='text-2xl font-bold text-gray-900'>Partner Restaurants</h1>
          <p className='text-sm text-gray-700 mt-1'>
            Select a restaurant to view and manage its coupon activity.
          </p>
        </div>
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-1'>
        {loading && (
          <div className='col-span-full bg-white/50 rounded-2xl p-6 text-center text-gray-700'>
            Loading restaurants...
          </div>
        )}
        {!loading && restaurants.length === 0 && (
          <div className='col-span-full bg-white/50 rounded-2xl p-6 text-center text-gray-700'>
            No restaurants configured yet.
          </div>
        )}
        {restaurants.map(restaurant => (
          <button
            key={restaurant.id}
            onClick={() => onSelect?.(restaurant)}
            className='text-left bg-white/70 hover:bg-white focus-visible:ring-2 ring-red-400 transition cursor-pointer rounded-2xl p-5 shadow-md flex flex-col gap-2'
          >
            <span className='text-xs font-semibold uppercase tracking-wide text-red-600'>
              #{restaurant.id?.slice(-4)}
            </span>
            <h2 className='text-xl font-bold text-gray-900'>{restaurant.name}</h2>
            <p className='text-sm text-gray-700 leading-relaxed'>{restaurant.address}</p>
            <div className='flex items-center justify-between mt-2 text-sm'>
              <span className='text-red-600 font-medium'>View coupons →</span>
              <button
                type='button'
                className='text-xs px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-60'
                onClick={event => {
                  event.stopPropagation()
                  onDelete?.(restaurant.id)
                }}
                disabled={deletingId === restaurant.id}
              >
                {deletingId === restaurant.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Restaurant
