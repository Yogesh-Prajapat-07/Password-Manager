
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

export function CardDemo({ onLogin, onSignup }) {
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }


const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")

  if (isSignup && form.password.length < 8) {
    setError("Password must be at least 8 characters.")
    return
  }

  if (isSignup && form.password !== form.confirmPassword) {
    setError("Passwords do not match.")
    return
  }

  setLoading(true)

  try {
    const endpoint = isSignup ? "signup" : "login"

    const payload = isSignup
      ? {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }
      : {
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }

    const response = await fetch(
      `http://localhost:5000/api/auth/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.")
    }

   if (isSignup) {
  onSignup?.(data)
} else {
  onLogin?.(data)
}
  } catch (err) {
    setError(err.message || "Cannot connect to the server.")
  } finally {
    setLoading(false)
  }
}


  const toggleMode = () => {
    setIsSignup(!isSignup)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setError("")
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="w-full max-w-md [perspective:1200px]">
        <div
          className={`relative grid transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isSignup ? "[transform:rotateY(180deg)]" : ""
            }`}
        >
          {/* LOGIN SIDE */}
          <div className="col-start-1 row-start-1 [backface-visibility:hidden]">
            <Card className="w-full border-emerald-100/80 bg-white/95 shadow-2xl shadow-emerald-900/10 backdrop-blur">
              <CardHeader className="space-y-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={30} />
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  Welcome to PassOP
                </CardTitle>
                <CardDescription>
                  Login to access your password manager.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
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

                  {error && !isSignup && (
                    <p role="alert" className="text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="mt-5 flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"

                  >
            
                    {loading ? "Logging in..." : "Login"}
                    </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                    
                      {loading ? "Creating account..." : "Create Account"} 
                        </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* SIGNUP SIDE */}
          <div className="col-start-1 row-start-1 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <Card className="w-full border-emerald-100/80 bg-white/95 shadow-2xl shadow-emerald-900/10 backdrop-blur">
              <CardHeader className="space-y-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={30} />
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  Create Account
                </CardTitle>
                <CardDescription>
                  Create your PassOP account to get started.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className="pr-11"
                        minLength={8}
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

                  <div className="grid gap-2">
                    <Label htmlFor="signup-confirm-password">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className="pr-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isSignup && error && (
                    <p role="alert" className="text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="mt-5 flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Create Account
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      Login
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
