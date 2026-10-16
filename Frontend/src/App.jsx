
import { useState } from 'react'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'
import { CardDemo } from './components/Card'
import VaultAccess from './components/VaultAccess'
import { encryptVault } from './utils/vaultCrypto'
import './App.css'

function App() {
  const [screen, setScreen] = useState('login')
  const [authData, setAuthData] = useState(null)
  const [masterPassword, setMasterPassword] = useState('')
  const [vaultPasswords, setVaultPasswords] = useState([])

  const handleSignup = (data) => {
    setAuthData(data)
    setScreen('setup')
  }

  const handleLogin = (data) => {
    setAuthData(data)
    setScreen('unlock')
  }

  const handleVaultComplete = (password, passwords) => {
    setMasterPassword(password)
    setVaultPasswords(passwords)
    setScreen('dashboard')
  }

  const saveVault = async (passwords) => {
    if (!authData?.token || !masterPassword) {
      throw new Error('Session expired. Please log in again.')
    }

    // Encrypt the complete vault in the browser before sending it.
    const encryptedVault = await encryptVault(masterPassword, passwords)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vault`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authData.token}`,
  },
  body: JSON.stringify(encryptedVault),
})

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Unable to save encrypted vault.')
    }
  }

  const handleLogout = () => {
    setAuthData(null)
    setMasterPassword('')
    setVaultPasswords([])
    setScreen('login')
  }

  if (screen === 'login') {
    return (
      <CardDemo
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    )
  }

  if (screen === 'setup' || screen === 'unlock') {
    return (
      <VaultAccess
        mode={screen}
        token={authData?.token}
        onComplete={handleVaultComplete}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <>
     <Navbar
  user={authData?.user}
  onLogout={handleLogout}
/>

      <div className="min-h-screen bg-emerald-50 bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]">
        <Manager
          token={authData?.token}
          passwords={vaultPasswords}
          setPasswords={setVaultPasswords}
          saveVault={saveVault}
        />
      </div>

        <Footer />
    </>
  )
}

export default App
