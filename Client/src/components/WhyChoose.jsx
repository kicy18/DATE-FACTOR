import React from 'react'
import whychoose from '../assets/whychoose.svg'
import { whychooseData, whychooseData2 } from '../assets/assets'
function WhyChoose() {
  return (
    <section className="bg-cover bg-center flex justify-center items-center text-white py-14 md:py-20" style={{ backgroundImage: `url(${whychoose})`}}>
        <div className='flex px-4 sm:px-8 lg:px-20 flex-col items-center gap-6 w-full max-w-6xl'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-semibold text-center mt-2'>Why Choose Date Factor?</h1>
            <div className='p-4 sm:p-6 bg-white/20 mt-4 sm:mt-6 w-full max-w-[360px] flex gap-3 flex-col text-center rounded-2xl shadow-2xl'>
                        <h2 className='text-lg sm:text-xl font-semibold'>🕊️ Safe & Comfortable Spaces</h2>
                        <p className='text-sm sm:text-base text-gray-100'>Our Date Coordinators and partner venues ensure a secure, respectful, and welcoming experience for everyone—especially women.</p>
            </div>
            <div className='flex flex-wrap justify-center gap-6 sm:gap-8 w-full'>
                {whychooseData.map((item) =>(
                    <div key={item.title} className='p-4 sm:p-5 bg-white/20 flex gap-3 flex-col w-full max-w-[320px] rounded-2xl shadow-2xl text-center md:text-left'>
                        <h3 className='text-lg sm:text-xl font-semibold'>{item.title}</h3>
                        <p className='text-sm sm:text-base text-gray-100 leading-relaxed'>{item.description}</p>
                    </div>
                ))}
            </div>
            <div className='flex flex-wrap justify-center gap-6 sm:gap-8 w-full'>
                {whychooseData2.map((item) =>(
                    <div key={item.title} className='p-4 sm:p-5 bg-white/20 flex gap-3 flex-col w-full max-w-[320px] rounded-2xl shadow-2xl text-center md:text-left'>
                        <h3 className='text-lg sm:text-xl font-semibold'>{item.title}</h3>
                        <p className='text-sm sm:text-base text-gray-100 leading-relaxed'>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
      
    </section>
  )
}

export default WhyChoose