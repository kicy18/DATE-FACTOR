import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import bg_hero from '../assets/bg_hero.svg'
function Hero() {
  return (
    <section className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${bg_hero})`}}>
      <Header/>
      <section className = 'flex justify-center items-center flex-1 min-h-[60vh] md:min-h-[70vh] px-4'>    
        <div className="flex text-white items-center justify-center pb-[60px] sm:pb-[80px] gap-6 sm:gap-10 md:gap-12 flex-col text-center max-w-[1100px]">
            <h1 className='text-3xl sm:text-5xl md:text-6xl font-semibold'>Meet  <span className = "text-red-600">Real</span> People<br></br> in <span className = "text-red-400 ">Real</span> Life</h1>
            <h2 className = 'text-base sm:text-xl md:text-2xl leading-relaxed'>India’s first offline dating platform that lets you experience face-to-face connections that are safe, verified and spontaneous at our partner restaurants.</h2>
            <div className='text-black pt-2 sm:pt-4 w-full px-4 sm:px-0'>
                <Link to='/login' className='w-full max-w-[300px] mx-auto h-12 sm:h-[52px] bg-red-400 flex justify-center items-center rounded-3xl hover:bg-red-500 transition cursor-pointer '>
                <span className='font-bold text-lg sm:text-xl '>Get Your Date </span>
            </Link>
            </div>
        </div>
        
      </section>
    </section>
  )
}

export default Hero
