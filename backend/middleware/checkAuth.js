import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import mongoose from 'mongoose'

const checkAuth = async (req, res, next) => { 
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      token = req.headers.authorization.split(' ').pop()
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      if(!mongoose.Types.ObjectId.isValid(decoded.id)){
        const error = new Error('Usuario no válido')
        return res.status(401).json({ msg: error.message })
      }
      req.user = await User.findById(decoded.id).select('-password -confirmed -token -updatedAt -createdAt -__v') 
      return next()
    } catch (error) {
      console.log(error)
    }
  }

  if(!token){
    const error = new Error("Token no válido");
    return res.status(401).json({msg: error.message})
  }
}

export default checkAuth