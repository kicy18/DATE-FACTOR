import React from 'react'
import { Link } from 'react-router-dom'
import mdi_heart from '../assets/mdi_heart.svg'
import logo from '../assets/logo.svg'
function Header() {
  return (
    <div className='my-4 mx-4 sm:mx-8 md:mx-16 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 md:gap-14 justify-between'>
      <div className='flex gap-3 items-center'>
        <img src={mdi_heart} alt="" width={50} className='sm:w-[60px]'/>
        <img src={logo} alt="" width={110} className='pb-2 sm:w-[120px]' />
      </div>
      <div className='text-white pt-2 sm:pt-4 md:pt-6 sm:pr-6 md:pr-10 gap-4 sm:gap-6 flex text-sm sm:text-base'>
        <Link to='/#how-it-works'>How it Works?</Link>
        <Link to="/#about-us">About Us</Link>
      </div>
      <div className='text-black pt-2 sm:pt-4'>
        <Link to='/login' className='w-[110px] sm:w-[120px] h-10 bg-red-400 flex justify-center items-center rounded-2xl cursor-pointer hover:bg-red-500'>
            <span className='font-bold text-sm sm:text-base'>Login</span>
        </Link>
      </div>
    </div>
  )
}

export default Header
