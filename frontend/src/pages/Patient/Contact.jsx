import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';


const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-16">
      {/* Header */}
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      {/* Main Content Section */}
      <div className='my-10 flex flex-col md:flex-row justify-center gap-10 mb-28 text-sm'>

        {/* Left: Image */}
        <img className='w-full md:max-w-[360px]' src={assets.contact} alt="Contact" />

        {/* Right: Contact Info */}
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>Our Office</p>
          <p className='text-gray-500'>
            12300 Thampanur Station<br />
            Chamber no:01, Trivandrum, Kerala
          </p>
          <p className='text-gray-500'>
            Tel: (0473) 438-24301<br />
            Email: medicoHub@gmail.com
          </p>

          <p className='font-semibold text-lg text-gray-600'>Suggestions</p>
          <p className='text-gray-500'>Let us know what you think</p>
          <button 
          onClick={() => navigate('/feedback')} 
          className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
            Feedback
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
