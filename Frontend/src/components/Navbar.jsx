import React from 'react'

const Navbar = ({ user, onLogout }) => {
  return (
 <nav className="bg-slate-900 text-white border-b border-emerald-500/30 shadow-lg w-full min-w-0 overflow-hidden">
     <div className= "mycontainer mx-auto flex w-full min-w-0 items-center justify-between gap-2 !py-3 !px-3 sm:!px-4 sm:!py-5">

        <div className="logo  text-lg font-bold text-white  cursor-pointer transition-transform hover:scale-105 sm:text-2xl">
          <span className='text-emerald-500'>  &lt;</span>
       
          <span>Pass</span><span className='text-emerald-500'>OP/&gt;</span>
          </div>
        <ul>
           
        </ul>
         <div className="flex min-w-0  items-center  gap-2sm:gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-bold uppercase sm:h-9 sm:w-9 ">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>

            <span className="hidden max-w-[180px] truncate text-sm font-medium sm:block">
              {user?.email || user?.name || 'User'}
            </span>
          </div>

         <button
            type="button"
            onClick={onLogout}
           className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500 sm:px-4"
          >
            Logout
          </button>
        </div>
          </div>
      
    </nav>
  )
}

export default Navbar
