import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

// Hash password
export async function hashPassword(password) {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

// Sign JWT token
export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

// Verify JWT token
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Get user from token
export async function getUserFromToken(token) {
  try {
    const payload = await verifyToken(token)
    return payload
  } catch (error) {
    return null
  }
}