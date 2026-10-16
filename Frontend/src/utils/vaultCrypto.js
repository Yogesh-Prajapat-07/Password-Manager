

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function toBase64(bytes) {
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (char) =>
    char.charCodeAt(0)
  )
}

async function deriveKey(masterPassword, salt) {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(masterPassword),
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 600000,
      hash: "SHA-256",
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  )
}

export async function encryptVault(masterPassword, vaultData) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(masterPassword, salt)

  const plaintext = encoder.encode(JSON.stringify(vaultData))

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext
  )

  return {
    encryptedData: toBase64(new Uint8Array(ciphertext)),
    iv: toBase64(iv),
    salt: toBase64(salt),
    version: 1,
  }
}
export async function decryptVault(masterPassword, vault) {
  const salt = fromBase64(vault.salt)
  const iv = fromBase64(vault.iv)
  const ciphertext = fromBase64(vault.encryptedData)
  const key = await deriveKey(masterPassword, salt)

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  )

  return JSON.parse(decoder.decode(plaintext))
}
