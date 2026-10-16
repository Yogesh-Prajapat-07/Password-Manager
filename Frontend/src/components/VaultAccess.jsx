
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { encryptVault, decryptVault } from "@/utils/vaultCrypto"

export default function VaultAccess({
  mode,
  token,
  onComplete,
  onLogout,
}) {
  const [masterPassword, setMasterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isSetup = mode === "setup"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (masterPassword.length < 8) {
      setError("Master Password must be at least 8 characters.")
      return
    }

    if (isSetup && masterPassword !== confirmPassword) {
      setError("Master Passwords do not match.")
      return
    }

    if (!token) {
      setError("Your session is missing. Please log in again.")
      return
    }

    setLoading(true)

    try {
      if (isSetup) {
        const encryptedVault = await encryptVault(masterPassword, [])

       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vault`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
   Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(encryptedVault),
})

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Unable to create vault.")
        }

        onComplete(masterPassword, [])
      } else {
       const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/vault`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Vault not found. Please set up your vault first."
              : data.message || "Unable to fetch vault."
          )
        }

        let passwords

        try {
          passwords = await decryptVault(masterPassword, data)
        } catch {
          throw new Error("Incorrect Master Password or corrupted vault.")
        }

        if (!Array.isArray(passwords)) {
          throw new Error("Vault data is invalid.")
        }

        onComplete(masterPassword, passwords)
      }
    } catch (err) {
      setError(err.message || "Unable to access vault.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50 bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)] px-4 py-10">
      <Card className="w-full max-w-md border-emerald-100 bg-white/95 shadow-2xl shadow-emerald-900/10">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <ShieldCheck size={30} />
          </div>

          <CardTitle className="text-2xl font-bold">
            {isSetup ? "Create Your Master Password" : "Unlock Your Vault"}
          </CardTitle>

          <CardDescription>
            {isSetup
              ? "Create a separate password to protect your saved passwords."
              : "Enter your Master Password to access your saved passwords."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="master-password">Master Password</Label>

              <div className="relative">
                <Input
                  id="master-password"
                  type={showPassword ? "text" : "password"}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  className="pr-11"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSetup && (
              <div className="grid gap-2">
                <Label htmlFor="confirm-master-password">
                  Confirm Master Password
                </Label>
                <Input
                  id="confirm-master-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter it again"
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Keep this password safe. If you lose it, your encrypted vault
              may not be recoverable.
            </p>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {loading
                ? "Please wait..."
                : isSetup
                  ? "Create Secure Vault"
                  : "Unlock Vault"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onLogout}
              disabled={loading}
            >
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
