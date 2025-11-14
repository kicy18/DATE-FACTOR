import React from 'react'
import mdi_heart from '../assets/mdi_heart.svg'
import socmed from '../assets/socmed.svg'
const Footer = () => {
  return (
    <section className='bg-[#05050c] text-white'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-6 p-8 md:p-16 lg:px-24 justify-between'>
            <div className='flex flex-col gap-4 max-w-xl'>
                <div className='flex items-center gap-3'>
                    <img src={mdi_heart} alt='' className='w-10'/>
                    <h1 className='font-bold text-lg'>DATE FACTOR</h1>
                </div>
                <p className='text-sm sm:text-base text-gray-200'>Your personal data and details remain strictly confidential. We do not share, sell, or expose any private information to other participants or third parties.</p>
                <img src={socmed} alt='social media icons' width={200} className='mt-4 md:mt-8'/>
            </div>
            <div className='flex flex-col gap-3 mt-2 md:mt-3 text-sm sm:text-base'>
                <h2 className='text-xl sm:text-2xl font-semibold'>We’d love to hear from you!</h2>
                <div className='flex flex-col gap-1 text-gray-200'>
                    <span>💌 datefactor.official@gmail.com</span>
                    <span>📍 New Delhi, India</span>
                    <span>📱 Instagram: @datefactor.in</span>
                </div>
            </div>
        </div>
        <div className='bg-[#2B3238] p-4 px-6 md:px-20 text-center md:text-left text-sm'>
            Copyright © 2025 DATE FACTOR
        </div>
    </section>
  )
}

export default Footer