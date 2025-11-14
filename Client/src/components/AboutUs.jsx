import React from 'react'
import { aboutusdata } from '../assets/assets'

function AboutUs() {
  return (
    <section className='w-full bg-[#0b0e13] bg-[radial-gradient(circle_at_top_left,_rgba(128,0,0,0.15)_0%,_#0b0e13_70%)] text-white flex items-center flex-col justify-center'>
        <div className='flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-20 py-16 md:py-24 gap-8 md:gap-10'>
            <h1 className='text-3xl md:text-4xl font-bold'>ABOUT US</h1>
            <p className='w-full max-w-4xl text-lg md:text-xl font-extralight leading-relaxed'>In a world full of swipes, filters, and fake profiles, real connection has become rare. We saw how online dating has left millions feeling disconnected, anxious, and lonely, even in crowded cities. So we created Date Factor—a new kind of dating platform built around in-person experiences, not algorithms.</p>
            <h1 className='text-3xl md:text-4xl font-bold'>OUR VISION</h1>
            <div className='flex flex-wrap justify-center gap-4 md:gap-6 mt-6 md:mt-10 w-full'>
                {aboutusdata.map((item)=> (
                    <div key={item.title} className='flex gap-2 flex-col bg-white/5 p-6 md:p-7 rounded-xl w-full max-w-[300px] shadow-2xl text-left'>
                        <h2 className='text-xl md:text-2xl font-semibold'>{item.title}</h2>
                        <p className='text-sm md:text-base text-gray-200 leading-relaxed'>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
        <hr className="border w-full max-w-4xl border-white mx-4" />
        <div className='flex flex-col items-center gap-6 md:gap-8 px-4 sm:px-8 lg:px-20 py-12 md:py-16 justify-center text-center'> 
            <h1 className='text-3xl md:text-4xl font-bold'>Join as a Partner</h1>
            <p className='w-full max-w-3xl text-lg md:text-xl text-gray-200 leading-relaxed'>If you own a restaurant or café and want to be part of this movement, apply today. We’ll take care of matchmaking and coordination—you just host the magic.</p>
            <form className="flex flex-col sm:flex-row bg-white/10 border border-white/20 px-3 sm:px-4 py-2 items-center justify-between gap-3 sm:gap-4 rounded-3xl w-full max-w-3xl">
        <input
            type="email"
            placeholder="Enter email address to connect with us"
            className="bg-transparent outline-none text-white w-full placeholder-gray-300"
            required
        />
            <button className="cursor-pointer hover:text-white bg-red-500 flex items-center rounded-3xl text-black font-bold px-4 py-2 justify-center whitespace-nowrap">
                Connect
            </button>
        </form>

        </div>
      
    </section>
  )
}

export default AboutUs
