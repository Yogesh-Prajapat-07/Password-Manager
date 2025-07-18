import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-800 text-white flex flex-col justify-center items-center fixed  w-full'>
         <div className="logo font-bold text-white text-2xl">
          <span className='text-emerald-500'>  &lt;</span>
       
          <span>Pass</span><span className='text-emerald-500'>OP/&gt;</span>
          </div>



          <div className='flex justify-center items-center'> Created with<img className='w-7 m-2' src="icons/heart.png" alt="" /> by Yogi</div>
    </div>
   
  )
}

export default Footer
