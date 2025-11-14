import React from 'react'
import { Link } from 'react-router-dom'
import Coupon_bg from '../assets/Coupon_bg.svg'
import coupon_s from '../assets/coupon_s.svg'
const coupon = () => {
  return (
    <section  className="bg-cover bg-center flex flex-col justify-center items-center text-white py-12 md:py-20" style={{ backgroundImage: `url(${Coupon_bg})`}}>
      <div className='flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 px-4 sm:px-8 lg:px-20 w-full max-w-6xl'>
        <img src={coupon_s} alt="Coupon illustration" className='w-[240px] sm:w-[300px] md:w-[360px]' />
        <div className='flex gap-4 sm:gap-5 pb-4 md:pb-10 flex-col text-center md:text-left max-w-xl'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-medium'>Ready To Meet Someone <br className='hidden md:block'/> Real?</h1>
          <p className='text-lg sm:text-2xl font-light leading-relaxed'>Buy your Date Coupon today and experience dating the way it’s meant to be—real, warm, and alive.</p>
          <div className='text-black pt-2 sm:pt-4'>
                <Link to='/login' className='w-full max-w-[250px] h-11 sm:h-[45px] bg-red-400 flex justify-center items-center rounded-xl hover:bg-red-500 transition cursor-pointer mx-auto md:mx-0'>
                <span className='font-bold text-lg sm:text-xl '>Get Your Date Coupon</span>
            </Link>
            </div>
        </div>
      </div>
    </section>
  )
}

export default coupon