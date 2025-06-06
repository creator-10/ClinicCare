import React from 'react'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>
          About <span className='text-gray-700 font-medium '>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        {/*<img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" /> */}
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to HealthWist,Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis cum corporis ipsa dicta porro! Velit, eum voluptas, repellendus rerum nihil vitae nobis adipisci laborum blanditiis sapiente similique voluptatem molestiae? Sequi.</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed consequuntur, excepturi maiores voluptatum tempore ducimus voluptas nostrum omnis delectus, animi sint enim quae? Totam, pariatur magni consequuntur optio ipsam numquam!
          Culpa rerum, vero consequuntur magni soluta facere in omnis quis, eum corrupti earum placeat! Aspernatur saepe beatae non provident vero explicabo sed mollitia cupiditate error veritatis quas, magnam corporis dicta?
          Possimus excepturi ad, laudantium repellendus ab obcaecati nulla delectus praesentium cupiditate, accusamus placeat velit mollitia! Sed aspernatur rerum autem animi inventore itaque eligendi neque aperiam commodi, praesentium non pariatur delectus.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Lorem ipsum, Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex at, quibusdam quis voluptatum vel impedit dolorem mollitia quo ea hic ab cum nulla sunt officia ipsam quod laboriosam quam et!

          </p>
        </div>

      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>Choose Us</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
           <b>Convenience:</b>
           <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
       
    </div>
  )
}

export default About
