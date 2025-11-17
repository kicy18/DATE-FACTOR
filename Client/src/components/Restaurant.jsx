import React from 'react'
import { restaurantDdata } from '../assets/assets'
function Restaurant() {
  return (
    <div className='flex flex-col  items-center gap-4 sm:gap-6 md:gap-15 text-center flex-1 px-4 overflow-y-auto'>
        <div className='px-2 w-100 py-2 rounded-2xl shadow-2xl bg-white/30'>
                    <h1 className='text-2xl font-bold'>Restaurant</h1>
              </div>
              <div className='flex gap-4'>
                {restaurantDdata.map((item , index)=>(
                    <div className='px-2 w-100 py-10 rounded-2xl shadow-2xl hover:bg-white/70 cursor-pointer flex flex-col text-center items-center justify-center bg-white/30'>
                            <h1 className='text-2xl font-bold'>{item.name}</h1>
                            <h1 className='text-md w-[300px]'>{item.address}</h1>
                    </div>
                ))}
        </div>
    </div>
  )
}

export default Restaurant
