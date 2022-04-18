import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import clientAxios from "../config/clientAxios"
import useAuth from "../hooks/useAuth"
import useProjects from "../hooks/useProjects"
import Spinner from "../components/Spinner"

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const { setAuth, load } = useAuth()
  const { showAlertSuccErr } = useProjects()

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    if([email, password].includes('')) {
      showAlertSuccErr({
        title:"Todos los campos son obligatorios",
        icon:'error'
      })
      return
    }


    try {
      const url = '/users/login'
      const { data } = await clientAxios.post(url, {email,password})
      localStorage.setItem('token', data.token)
      setAuth(data)
      navigate('/projects')

    } catch (error) {
      showAlertSuccErr({
        title: error.response.data.msg,
        icon:'error'
      })
    }

  }

  if(load) return <Spinner />

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia sesión y administra tus {''}<span className="text-slate-700">proyectos</span></h1>
      <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
        <div className="my-5">
          <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
          <input type="email" placeholder="Email de registro" id="email" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="my-5">
          <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
          <input type="password" placeholder="Password de registro" id="password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <input type="submit" value="Iniciar Sesión" className="bg-sky-600 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors"/>
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link to="/sign-up" className="block text-center my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? Regístrate</Link>
        <Link to="/forgot-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidé mi contraseña</Link>
      </nav>

    </>
  )
}

export default Login