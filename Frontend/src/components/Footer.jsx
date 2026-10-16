import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-slate-800 text-white flex flex-col justify-center items-center py-4 mt-auto relative z-10">
      <div className="logo font-bold text-white text-2xl">
        <span className="text-emerald-500">&lt;</span>
        <span>Pass</span>
        <span className="text-emerald-500">OP/&gt;</span>
      </div>

      <div className="flex justify-center items-center text-sm">
        Created with
        <img
          className="w-7 mx-2"
          src="/icons/heart.png"
          alt="heart"
        />
        by Yogesh
      </div>
    </footer>
  )
}

export default Footer