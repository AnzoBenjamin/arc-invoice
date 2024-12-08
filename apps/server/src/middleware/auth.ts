import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

// Extend the Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

// Define types for JWT payload
interface CustomTokenPayload {
  id: string
  // Add other custom fields as needed
  iat?: number
  exp?: number
}

interface GoogleTokenPayload {
  sub: string
  // Add other Google OAuth fields as needed
  email?: string
  name?: string
  iat?: number
  exp?: number
}

dotenv.config()
const SECRET = process.env.SECRET || ''

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new Error('Authorization header is missing')
    }

    const token = authHeader.split(" ")[1]
    const isCustomAuth = token.length < 500

    let decodedData: CustomTokenPayload | GoogleTokenPayload | null

    // If token is custom token do this
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, SECRET) as CustomTokenPayload
      req.userId = decodedData?.id

    } else {
      // Else if token is google token then do this
      decodedData = jwt.decode(token) as GoogleTokenPayload
      req.userId = decodedData?.sub
    }

    next()

  } catch (error) {
    console.log(error)
    // Consider sending an error response instead of just logging
    // res.status(401).json({ message: 'Authentication failed' })
  }
}

export default auth