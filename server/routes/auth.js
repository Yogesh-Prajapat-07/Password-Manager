
const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router()

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    })

    if (!process.env.JWT_SECRET) {
  return res.status(500).json({
    message: "Authentication is not configured",
  })
}

const token = jwt.sign(
  { userId: user._id.toString() },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
)

return res.status(201).json({
  message: "Account created successfully",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
})
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists",
      })
    }

    console.error("Signup error:", error.message)
    return res.status(500).json({ message: "Unable to create account" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing")
      return res.status(500).json({
        message: "Authentication is not configured",
      })
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error.message)
    return res.status(500).json({ message: "Unable to login" })
  }
})

module.exports = router
