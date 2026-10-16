
const express = require("express")
const mongoose = require("mongoose")
const Vault = require("../models/Vault")
const authenticateToken = require("../middleware/auth")

const router = express.Router()

// GET: Fetch the logged-in user's encrypted vault
router.get("/", authenticateToken, async (req, res) => {
  try {
    const vault = await Vault.findOne({
      userId: req.userId,
    }).lean()

    if (!vault) {
      return res.status(404).json({
        message: "Vault not found. Set up your vault first.",
      })
    }

    return res.json({
      encryptedData: vault.encryptedData,
      iv: vault.iv,
      salt: vault.salt,
      version: vault.version,
    })
  } catch (error) {
    console.error("Fetch vault error:", error.message)
    return res.status(500).json({
      message: "Unable to fetch vault",
    })
  }
})

// PUT: Create or update the logged-in user's encrypted vault
router.put("/", authenticateToken, async (req, res) => {
  try {
    const { encryptedData, iv, salt, version } = req.body

    if (
      typeof encryptedData !== "string" ||
      !encryptedData ||
      typeof iv !== "string" ||
      !iv ||
      typeof salt !== "string" ||
      !salt
    ) {
      return res.status(400).json({
        message: "Valid encrypted vault fields are required",
      })
    }

    if (
      encryptedData.length > 5_000_000 ||
      iv.length > 100 ||
      salt.length > 200
    ) {
      return res.status(413).json({
        message: "Vault payload is too large or invalid",
      })
    }

    const safeVersion = version === undefined ? 1 : version

    if (!Number.isInteger(safeVersion) || safeVersion !== 1) {
      return res.status(400).json({
        message: "Unsupported vault version",
      })
    }

    const vault = await Vault.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          encryptedData,
          iv,
          salt,
          version: safeVersion,
        },
        $setOnInsert: {
          userId: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )

    return res.json({
      message: "Encrypted vault saved successfully",
      updatedAt: vault.updatedAt,
    })
  } catch (error) {
    console.error("Save vault error:", error.message)
    return res.status(500).json({
      message: "Unable to save vault",
    })
  }
})

module.exports = router
