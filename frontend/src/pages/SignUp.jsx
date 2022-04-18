import { useState } from "react"
import { Link } from "react-router-dom"
import clientAxios from "../config/clientAxios"
import useAuth from "../hooks/useAuth"
import useProjects from "../hooks/useProjects"
import Spinner from "../components/Spinner"

const SignUp = () => {

  const { load } = useAuth()
  const { showAlertSuccErr } = useProjects()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if([name, email, password, repeatPassword].includes('')) {
      showAlertSuccErr({
        title:"Todos los campos son obligatorios",
        icon:'error'
      })
      return
    }

    if(password.length < 8){
      showAlertSuccErr({
        title:"La contraseña debe tener al menos 8 caracteres. También debe tener al menos una mayúscula, una minuscula y un número",
        icon:'error'
      })
      return
    }    

    if(!password.match(/[A-Z]/) || !password.match(/[a-z]/) || !password.match(/[0-9]/)) {
      showAlertSuccErr({
        title:"La contraseña debe tener al menos una mayúscula, una minuscula y un número",
        icon:'error'
      })
      return
    }

    if(password !== repeatPassword) {
      showAlertSuccErr({
        title:"Las contraseñas no coinciden",
        icons:'error'
      })
      return
    }

    // Create user
    try {
      const url = '/users'
      const { data } = await clientAxios.post(url, {name,email,password})
      showAlertSuccErr({
        title: data.msg,
        icon:'success'
      })
      setName('')
      setEmail('')
      setPassword('')
      setRepeatPassword('')
    } catch (error) {
      //onsole.log(error.response.data.msg)
      showAlertSuccErr({
        title: error.response.data.msg,
        icon:'error'
      })
    } 
  }
  
  if(load) return <Spinner />

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Crea tu cuenta y administra tus {''}<span className="text-slate-700">proyectos</span></h1>
      <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
        <div className="my-5">
          <label htmlFor="name" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
          <input type="text" placeholder="Tu nombre completo" id="name" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={name} onChange={e => setName(e.target.value)}/>
        </div>
        <div className="my-5">
          <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
          <input type="email" placeholder="Email de registro" id="email" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="my-5">
          <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Contraseña</label>
          <input type="password" placeholder="Contraseña" id="password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className="my-5">
          <label htmlFor="repeat-password" className="uppercase text-gray-600 block text-xl font-bold">Repetir contraseña</label>
          <input type="password" placeholder="Repetir contraseña" id="repeat-password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}/>
        </div>
        <input type="submit" value="Crear cuenta" className="bg-sky-600 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors"/>
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">¿Ya tienes una cuenta? Inicia sesión</Link>
        <Link to="/forgot-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidé mi contraseña</Link>
      </nav>

    </>
  )
}

export default SignUp