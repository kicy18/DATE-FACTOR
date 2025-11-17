import React from 'react'
function SearchCoupon() {
  return (
    <div className='flex flex-col  items-center gap-4 sm:gap-6 md:gap-15 text-center flex-1 px-4 overflow-y-auto'>
        <form className='px-1 w-100 py-2 rounded-2xl shadow-2xl bg-white/30'>
          <input className='text-2xl font-bold placeholder-gray-600 outline-none' placeholder='Search Coupon...'/>
        </form>
        <div className='flex gap-4'>
                
        </div>
    </div>
  )
}

export default SearchCoupon
