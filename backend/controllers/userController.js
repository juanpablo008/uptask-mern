import User from "../models/User.js"
import generateId from "../helpers/generateId.js"
import generateJWT from "../helpers/generateJWT.js"
import { emailRegister, emailForgotPassword } from "../helpers/emails.js"

const register = async (req, res) => {

  // Check if user already exists
  const { email } = req.body;
  const existingUser = await User.findOne({ email })
  if (existingUser){
    const error = new Error("El usuario ya existe")
    return res.status(404).json({msg: error.message})
  } 

  try {
    const user = new User(req.body)
    user.token = generateId()
    await user.save()

    // Send email
    emailRegister({
      email: user.email,
      name: user.name,
      token: user.token
    })

    res.json({msg: "El usuario ha sido creado correctamente, revisa tu email para confirmar tu cuenta"})
  } catch (error) {
    console.log(error)
  }
}

const authenticate = async (req, res) => {
  
  const { email, password } = req.body

  // Check if user exists
  const user = await User.findOne({ email })
  if(!user){
    const error = new Error("El usuario no existe")
    return res.status(404).json({msg: error.message}) 
  }

  // Check if user is confirmed
  if(!user.confirmed){
    const error = new Error("Tu cuenta no ha sido confirmada")
    return res.status(404).json({msg: error.message}) 
  }

  // Check if token exists
  if(user.token){
    const error = new Error("Has solicitado un cambio de contraseña, revisa tu email")
    return res.status(404).json({msg: error.message}) 
  }

  // Check if password is correct
  if(await user.comparePassword(password)){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id)
    })
  } else {
    const error = new Error("La contraseña es incorrecta")
    return res.status(403).json({msg: error.message}) 
  }
}

// Confirm a user
const confirm = async (req, res) => {
  const { token } = req.params
  const userConfirm = await User.findOne({ token })
  if(!userConfirm){
    const error = new Error("El token es inválido")
    return res.status(403).json({msg: error.message})
  }
  try {
    userConfirm.confirmed = true
    userConfirm.token = ""
    await userConfirm.save()
    res.json({msg: "El usuario ha sido confirmado"}) 
  } catch (error) {
    console.log(error)
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if(!user){
    const error = new Error("El usuario no existe")
    return res.status(404).json({msg: error.message})
  }

  if(user.token){
    const error = new Error("Ya has solicitado un cambio de contraseña")
    return res.status(404).json({msg: error.message})
  }

  try {
    user.token = generateId()
    await user.save()

    // Send email
    emailForgotPassword({
      email: user.email,
      name: user.name,
      token: user.token
    })

    res.json({msg: "Hemos enviado un email con las instrucciones"})
  } catch (error) {
    console.log(error)
  }
}

const checkToken = async (req, res) => {
  const { token } = req.params
  const user = await User.findOne({ token })
  if(user){
    res.json({msg: "El token es válido"})
  }else{
    const error = new Error("El token es inválido")
    return res.status(404).json({msg: error.message})
  }
}

const newPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  const user = await User.findOne({ token })
  if(user){
    try {
      user.password = password
      user.token = ""
      await user.save()
      res.json({msg: "La contraseña ha sido cambiada"})
    } catch (error) {
      console.log(error)
    }
  }else{
    const error = new Error("El token es inválido")
    return res.status(404).json({msg: error.message})
  }
  
}


const profile = async (req, res) => {
  const { user } = req
  res.json(user)
}

export {
  register,
  authenticate,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile
}