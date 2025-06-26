import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

// redirect to the doctor list page of the particular speciality  eg. when clicked on logo of the cardiology show the list of cardiology doctors

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
        <h1 className='text-3xl font-medium'>Find by Speciality </h1>
        <p className='sm:w-1/3 text-center text-sm'>Browse top-rated doctors and schedule your appointment without the hassle. Trusted care is just a few clicks away—quick, simple, and secure.</p>
      <div className='flex flex-wrap sm:justify-center gap-4 pt-5 w-full '>
        {specialityData.map((item,index)=>(
            <Link onClick={()=>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${item.speciality}`}>
                <img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
                <p>{item.speciality}</p>
            </Link>
        ))}
      </div>
      
    </div>

    
  )
}

export default SpecialityMenu
