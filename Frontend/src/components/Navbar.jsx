import React from 'react'

const Navbar = ({ user, onLogout }) => {
  return (
 <nav className="bg-slate-900 text-white border-b border-emerald-500/30 shadow-lg">
     <div className="mycontainer flex justify-between items-center px-4 py-5 min-h-14">

        <div className="logo font-bold text-white text-2xl cursor-pointer transition-transform hover:scale-105">
          <span className='text-emerald-500'>  &lt;</span>
       
          <span>Pass</span><span className='text-emerald-500'>OP/&gt;</span>
          </div>
        <ul>
           
        </ul>
         <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 font-bold uppercase">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>

            <span className="max-w-[180px] truncate text-sm font-medium">
              {user?.email || user?.name || 'User'}
            </span>
          </div>

         <button
            type="button"
            onClick={onLogout}
           className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500"
          >
            Logout
          </button>
        </div>
          </div>
      
    </nav>
  )
}

export default Navbar
