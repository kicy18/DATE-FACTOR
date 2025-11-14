import React from 'react'
import howitworks_bg from '../assets/howitworks_bg.svg'
import { howitworksData } from '../assets/assets'

const HowItWorks = () => {
  return (
    <section
      className='relative min-h-screen bg-black text-white py-12 sm:py-16 lg:py-24 overflow-hidden'
      style={{ backgroundImage: `url(${howitworks_bg})` }}
    >
      <div className='absolute inset-0 bg-black/70 lg:bg-black/60' />

      <div className='relative mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-8 lg:px-12'>
        <div className='flex flex-col items-center text-center gap-4'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight'>
            How It Works?
          </h1>
          <div className='pt-1 sm:pt-2'>
            <button className='inline-flex items-center justify-center rounded-full bg-red-600 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-red-500'>
              Explore Services
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
          {howitworksData.map((item) => (
            <div
              key={item.title}
              className='flex min-h-[140px] items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5 md:p-6 shadow-2xl backdrop-blur-md transition hover:bg-white/15'
            >
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-900/80 sm:h-14 sm:w-14'>
                <img src={item.icon} alt='' className='h-7 w-7 sm:h-8 sm:w-8' />
              </div>
              <div className='flex flex-col gap-2 text-left'>
                <h3 className='text-lg sm:text-xl font-semibold'>{item.title}</h3>
                <p className='text-sm sm:text-base text-gray-200 leading-relaxed'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
