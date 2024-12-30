import React from 'react'

const LocationMaps = () => {
  return (
    <>
    <div className='mx-auto max-w-7xl px-6 lg:px-8 py-8'> 
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.5007461610985!2d77.31112207555113!3d28.584750975690895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45f16150aab%3A0x6fe40b4511945251!2sBasement%2C%20B%2C%2088%2C%20B%20Block%2C%20Sector%202%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1734870506818!5m2!1sen!2sin" className='w-full h-[450px]  py-4' style={{border:0 }}allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>


      <div className='md:grid grid-cols-3 gap-3 py-6'>
        <div className='bg-slate-200 p-6 shadow-sm rounded-sm text-center'> 
          <h2 className='font-bold text-lg'>
            Email
          </h2> 
          <p className='pt-7'>
            <a href="mailto:info@trygon.in">
              info@testing
            </a>
          </p>
          </div>
        <div className='bg-slate-200 p-6 shadow-sm rounded-sm text-center'>
        <h2 className='font-bold text-lg'>
            Phone No
          </h2> 
          <p className='pt-7'>
            <a href="tel:+918851285655">
              +91-8888888888
            </a>
          </p>
        </div>
        <div className='bg-slate-200 shadow-sm p-6 rounded-sm text-center'>
        <h2 className='font-bold text-lg'>
            Address
          </h2> 
          <p className='pt-4'>
          B-88, B Block, Sector 2, Noida, Uttar Pradesh 201301
          </p>
        </div>
      </div>
    </div>

    
    
   
    </>
  )
}

export default LocationMaps