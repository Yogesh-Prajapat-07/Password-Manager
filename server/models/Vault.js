
const mongoose = require("mongoose")

const vaultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    encryptedData: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Vault", vaultSchema)
