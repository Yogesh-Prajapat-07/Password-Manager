
const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token required",
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication is not configured",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded.userId) {
      return res.status(401).json({
        message: "Invalid authentication token",
      })
    }

    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    })
  }
}

module.exports = authenticateToken
