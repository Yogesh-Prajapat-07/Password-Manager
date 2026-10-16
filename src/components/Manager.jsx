import React, { useRef, useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import 'react-toastify/dist/ReactToastify.css'



const Manager = ({ passwords = [], setPasswords, saveVault }) => {
  const ref = useRef()
  const passwordRef = useRef()

  const [form, setform] = useState({
    site: '',
    username: '',
    password: '',
  })

  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const copyText = (text) => {
    toast('Copied to clipboard', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    navigator.clipboard.writeText(text)

  }


  const showPassword = () => {
    passwordRef.current.type = "text"
    console.log(ref.current.src)
    if (ref.current.src.includes("icons/eyecross.png")) {
      ref.current.src = "icons/eye.png"
      passwordRef.current.type = "password"
    }
    else {
      passwordRef.current.type = "text"
      ref.current.src = "icons/eyecross.png"
    }
  }

const savePassword = async () => {
  if (
    form.site.trim().length <= 3 ||
    form.username.trim().length <= 3 ||
    form.password.length <= 3
  ) {
    toast.error('Error: Password not saved!')
    return
  }

  if (saving) return

  const nextPasswords = editingId
    ? passwords.map((item) =>
        item.id === editingId
          ? { ...form, id: editingId }
          : item
      )
    : [...passwords, { ...form, id: uuidv4() }]

  setSaving(true)

  try {
    await saveVault(nextPasswords)

    setPasswords(nextPasswords)
    setform({ site: '', username: '', password: '' })
    setEditingId(null)

    if (passwordRef.current) {
      passwordRef.current.type = 'password'
    }
    if (ref.current) {
      ref.current.src = 'icons/eye.png'
    }

    toast.success(editingId ? 'Password updated!' : 'Password saved!', {
      position: 'bottom-right',
      autoClose: 3000,
      theme: 'dark',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to save password.')
  } finally {
    setSaving(false)
  }
}

 const deletePassword = async (id) => {
  const confirmed = window.confirm(
    'Do you really want to delete the password?'
  )

  if (!confirmed || saving) return

  const nextPasswords = passwords.filter((item) => item.id !== id)

  setSaving(true)

  try {
    await saveVault(nextPasswords)
    setPasswords(nextPasswords)

    if (editingId === id) {
      setEditingId(null)
      setform({ site: '', username: '', password: '' })
    }

    toast.success('Password deleted!', {
      position: 'bottom-right',
      autoClose: 3000,
      theme: 'dark',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to delete password.')
  } finally {
    setSaving(false)
  }
}
  

 const editPassword = (id) => {
  const selected = passwords.find((item) => item.id === id)

  if (!selected) return

  setform({
    site: selected.site,
    username: selected.username,
    password: selected.password,
  })

  setEditingId(id)

  if (passwordRef.current) {
    passwordRef.current.type = 'password'
  }

  if (ref.current) {
    ref.current.src = 'icons/eye.png'
  }
}

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      
      <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-emerald-50 bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div >
      <div className="p-3 md:mycontainer min-h-[88.2vh] pb-8">
        
       <div className="flex flex-col items-center justify-center mb-4">
  <img
    src="/pass-op.png"
    alt="PassOP Password Manager"
    className="h-36 w-auto object-contain"
  />

  
</div>

        
        <p className='text-emerald-900 text-lg text-center'>Your own Password Manager</p>

        <div className="flex flex-col p-4 text-black gap-8 items-center ">
          <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-emerald-500 w-full p-4 py-1' type="text" name="site" id="site" />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-emerald-500 w-full p-4 py-1' type="text" name="username" id="username" />
            <div className="relative">

              <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-emerald-500 w-full p-4 py-1' type="password" name="password" id="password" />
              <span className='absolute right-[3px] top-[4px] cursor-pointer ' onClick={showPassword}>
                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
              </span>
            </div>

          </div>
         <button
  onClick={savePassword}
  disabled={saving}
  className="flex justify-center items-center gap-2 bg-emerald-400 hover:bg-emerald-300 rounded-full px-8 py-2 w-fit border border-emerald-900 disabled:opacity-50"
>
  <lord-icon
    src="https://cdn.lordicon.com/efxgwrkc.json"
    trigger="hover"
  />
  {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
</button>
        </div>

        <div className="passwords">
          <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
         {passwords.length === 0 && <div>No passwords to show</div>}

         {passwords.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden  mb-10">
            <thead className='bg-emerald-800  text-white'>
              <tr>
                <th className='py-2'>Site</th>
                <th className='py-2'>Username</th>
                <th className='py-2'>Password</th>
                <th className='py-2'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-emerald-100'>
             {passwords.map((item, index) => {
                return <tr key={index}>
                  <td className='py-2 border border-white text-center'>
                    <div className='flex items-center justify-center '>
                      <a href={item.site} target='_blank'>{item.site}</a>
                      <div className=' lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }} >
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover" >
                        </lord-icon>
                      </div>
                    </div>
                  </td>
                  <td className='py-2 border border-white text-center'>
                    <div className='flex items-center justify-center '>
                      <span>{item.username}</span>
                      <div className=' lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }} >
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover" >
                        </lord-icon>
                      </div>
                    </div>
                  </td>
                  <td className='py-2 border border-white text-center'>
                    <div className='flex items-center justify-center '>
                      <span>
  {visiblePasswords[item.id] ? item.password : '••••••••'}
</span>

<img
  className="p-1 cursor-pointer"
  width={26}
  src={visiblePasswords[item.id] ? "icons/eyecross.png" : "icons/eye.png"}
  alt="Show/Hide password"
  onClick={() =>
    setVisiblePasswords((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }))
  }
/>
                      <div className=' lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }} >
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover" >
                        </lord-icon>
                      </div>
                    </div>
                  </td>

                  <td className='py-2 border border-white text-center'>
                    <span className='cursor-pointer mx-1' onClick={()=>{editPassword(item.id)}}>
                      <lord-icon
                      src="https://cdn.lordicon.com/gwlusjdu.json"
                      trigger="hover"
                      style={{ "width": "25px", "height": "25px" }}>
                    </lord-icon>
                    </span>

                    <span className='cursor-pointer mx-1'onClick={()=>{deletePassword(item.id)}}>
                      <lord-icon
                      src="https://cdn.lordicon.com/xyfswyxf.json"
                      trigger="hover"
                      style={{ "width": "25px", "height": "25px" }}>
                    </lord-icon>
                    </span>
                  </td>
                </tr>

              })}

            </tbody>
          </table>}
        </div>
      </div>
    </>

  )
}

export default Manager
