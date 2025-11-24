import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import login_bg from '../assets/login_bg.svg'
import login_df_logo from '../assets/login_df_logo.svg'
import email from '../assets/email.svg'
import lock from '../assets/lock.svg'
import apiClient from '../services/apiClient'

const Login = () => {
  const [isSignup, setIsSignup] = useState(false)
  const [loginGender, setLoginGender] = useState('female')
  const [signupGender, setSignupGender] = useState('female')
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  })
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    message: ''
  })
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const navigate = useNavigate()

  const handleToggleMode = () => {
    setIsSignup(prev => !prev)
    setStatus({
      loading: false,
      error: '',
      message: ''
    })
  }

  const handleLoginInputChange = event => {
    const { name, value } = event.target
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignupInputChange = event => {
    const { name, value } = event.target
    setSignupForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    setStatus({
      loading: true,
      error: '',
      message: ''
    })

    try {
      if (isSignup) {
        const numericPhone = signupForm.phone.replace(/\D/g, '')
        if (!numericPhone) {
          setStatus({
            loading: false,
            error: 'Please provide a valid phone number.',
            message: ''
          })
          return
        }
      }

      const endpoint = isSignup ? '/api/user/register' : '/api/user/login'
      const payload = isSignup
        ? {
            name: signupForm.name.trim(),
            phone: signupForm.phone.replace(/\D/g, ''),
            email: signupForm.email.trim(),
            password: signupForm.password,
            gender: signupGender
          }
        : {
            email: loginForm.email,
            password: loginForm.password
          }

      const { data } = await apiClient.post(endpoint, payload)

      if (!data.success) {
        setStatus({
          loading: false,
          error: data.message || 'Unable to complete request.',
          message: ''
        })
        return
      }

      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      if (data.user?.name) {
        localStorage.setItem('userName', data.user.name)
      }
      if (data.user?.email) {
        localStorage.setItem('userEmail', data.user.email)
      }

      const userRole = data.user?.role || 'user'
      localStorage.setItem('userRole', userRole)

      const isAdminUser = userRole === 'admin'
      let chosenGender = null

      if (!isAdminUser) {
        chosenGender = data.user?.gender || (isSignup ? signupGender : loginGender)
        if (chosenGender) {
          localStorage.setItem('gender', chosenGender)
        }
      } else {
        localStorage.removeItem('gender')
      }

      setStatus({
        loading: false,
        error: '',
        message: isSignup ? 'Account created successfully!' : 'Logged in successfully!'
      })

      if (isAdminUser) {
        navigate('/adminhome')
      } else {
        navigate('/buycoupon', { state: { gender: chosenGender } })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Something went wrong.'
      setStatus({
        loading: false,
        error: errorMessage,
        message: ''
      })
    }
  }

  return (
    <section
      className='min-h-screen flex flex-col bg-[#0b0e13] text-white bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage: `url(${login_bg})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <div className='flex justify-center md:justify-start mx-6 md:mx-20 my-10'>
        <img src={login_df_logo} alt='Date Factor logo' className='w-36 md:w-48' />
      </div>
      <h1 className='text-4xl sm:text-6xl font-bold text-center text-red-600'>
        {isSignup ? 'Create Account' : 'Welcome'}
      </h1>
      <p className='text-center text-md mb-4'>
        {isSignup ? 'Join Date Factor by filling in the details below' : 'Please enter your login details below'}
      </p>
      <div className='flex flex-1 items-center justify-center px-4 pb-16'>
        <div className='w-full max-w-md px-6 py-5 border border-white/10 rounded-3xl shadow-lg backdrop-blur'>
          <form className='flex flex-col gap-4 items-center justify-center w-full' onSubmit={handleSubmit}>
            {!isSignup && (
              <>
                <label className='flex flex-col text-sm gap-2 w-full'>
                  <span>Email</span>
                  <div className='flex items-center gap-3 w-full bg-white text-black rounded-xl px-3 py-2 border border-transparent focus-within:border-red-400'>
                    <img src={email} alt='' className='w-5 h-5 opacity-70' />
                    <input
                      type='email'
                      name='email'
                      className='flex-1 bg-transparent outline-none p-2 placeholder-gray-500'
                      placeholder='you@example.com'
                      autoComplete='email'
                      value={loginForm.email}
                      onChange={handleLoginInputChange}
                      required
                    />
                  </div>
                </label>
                <label className='flex flex-col text-sm gap-2 w-full'>
                  <span>Password</span>
                  <div className='flex items-center gap-3 w-full bg-white text-black rounded-xl px-3 py-2 border border-transparent focus-within:border-red-400'>
                    <img src={lock} alt='' className='w-5 h-5 opacity-70' />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      name='password'
                      className='flex-1 bg-transparent outline-none p-2 placeholder-gray-500'
                      placeholder='••••••••'
                      autoComplete='current-password'
                      value={loginForm.password}
                      onChange={handleLoginInputChange}
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className='text-gray-600 cursor-pointer hover:text-gray-800 focus:outline-none text-sm font-medium'
                    >
                      {showLoginPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>
                
                <div className='items-start w-full text-end flex justify-end cursor-pointer hover:text-red-500'>
                  <h1>Forgot your password?</h1>
                </div>
                <button
                  type='submit'
                  className='mt-1 bg-red-500 hover:bg-red-600 w-full text-white font-semibold py-2 rounded-md transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
                  disabled={status.loading}
                >
                  {status.loading ? 'Processing...' : 'LOGIN'}
                </button>
                <div
                  className='w-full text-center text-sm cursor-pointer hover:text-red-500'
                  onClick={handleToggleMode}
                >
                  Don’t have an account? Register now
                </div>
              </>
            )}
            {isSignup && (
              <>
                <label className='flex flex-col text-sm gap-2 w-full'>
                  <span>Full Name</span>
                  <div className='flex items-center gap-3 w-full bg-white text-black rounded-xl px-3 py-2 border border-transparent focus-within:border-red-400'>
                    <input
                      type='text'
                      name='name'
                      className='flex-1 bg-transparent outline-none p-2 placeholder-gray-500'
                      placeholder='John Doe'
                      autoComplete='name'
                      value={signupForm.name}
                      onChange={handleSignupInputChange}
                      required
                    />
                  </div>
                </label>
                <label className='flex flex-col text-sm gap-2 w-full'>
                  <span>Phone Number</span>
                  <div className='flex items-center gap-3 w-full bg-white text-black rounded-xl px-3 py-2 border border-transparent focus-within:border-red-400'>
                    <input
                      type='tel'
                      name='phone'
                      className='flex-1 bg-transparent outline-none p-2 placeholder-gray-500'
                      placeholder='+91 98765 43210'
                      autoComplete='tel'
                      value={signupForm.phone}
                      onChange={handleSignupInputChange}
                      required
                    />
                  </div>
                </label>
                <label className='flex flex-col text-sm gap-2 w-full'>
                  <span>Email</span>
                  <div className='flex items-center gap-3 w-full bg-white text-black rounded-xl px-3 py-2 border border-transparent focus-within:border-red-400'>
                    <img src={email} alt='' className='w-5 h-5 opacity-70' />
                    <input
                      type='email'
                      name='email'
                      className='flex-1 bg-transparent outline-none p-2 placeholder-gray-500'
                      placeholder='you@example.com'
                      autoComplete='email'
                      value={signupForm.email}
                      onChange={handleSignupInputChange}
                      required
                    />
                  </div>
                </label>
                <label className='flex flex-col text-sm gap-2 w-full'>
                  <span>Password</span>
                  <div className='flex items-center gap-3 w-full bg-white text-black rounded-xl px-3 py-2 border border-transparent focus-within:border-red-400'>
                    <img src={lock} alt='' className='w-5 h-5 opacity-70' />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      name='password'
                      className='flex-1 bg-transparent outline-none p-2 placeholder-gray-500'
                      placeholder='Create a password'
                      autoComplete='new-password'
                      value={signupForm.password}
                      onChange={handleSignupInputChange}
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className='text-gray-600 cursor-pointer hover:text-gray-800 focus:outline-none text-sm font-medium'
                    >
                      {showSignupPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>
                <fieldset className='flex flex-col text-sm gap-3 w-full'>
                  <legend className='font-medium'>Gender</legend>
                  <div className='flex flex-wrap gap-3'>
                    {[
                      { value: 'female', label: 'Female' },
                      { value: 'male', label: 'Male' }
                    ].map(option => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition ${
                          signupGender === option.value
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-transparent text-white border-white/40 hover:border-red-400'
                        }`}
                      >
                        <input
                          type='radio'
                          name='signup-gender'
                          value={option.value}
                          checked={signupGender === option.value}
                          onChange={() => setSignupGender(option.value)}
                          className='hidden'
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <button
                  type='submit'
                  className='mt-2 bg-red-500 hover:bg-red-600 w-full text-white font-semibold py-2 rounded-md transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
                  disabled={status.loading}
                >
                  {status.loading ? 'Processing...' : 'CREATE ACCOUNT'}
                </button>
                <div
                  className='w-full text-center text-sm cursor-pointer hover:text-red-500'
                  onClick={handleToggleMode}
                >
                  Already have an account? Log in
                </div>
              </>
            )}
            {status.error && (
              <p className='text-red-400 text-sm text-center mt-3'>{status.error}</p>
            )}
            {status.message && (
              <p className='text-green-400 text-sm text-center mt-3'>{status.message}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login

