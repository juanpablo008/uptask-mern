import { useState } from "react"
import { Link } from "react-router-dom"
import clientAxios from "../config/clientAxios"
import useAuth from "../hooks/useAuth"
import useProjects from "../hooks/useProjects"
import Spinner from "../components/Spinner"

const ForgotPassword = () => {

  const { load } = useAuth()
  const { showAlertSuccErr } = useProjects()

  const [email, setEmail] = useState('')
  
  const handleSubmit = async e => {
    e.preventDefault()

    if(email === ''){
      showAlertSuccErr({
        title: 'El correo es obligatorio',
        icon: 'error'
      })
      return
    }

    if(email.lengt < 6){
      showAlertSuccErr({
        title: 'El correo es muy corto',
        icon: 'error'
      })
      return
    }

    try {
      const url = '/users/forgot-password'
      const { data } = await clientAxios.post(url, {email})
      showAlertSuccErr({
        title: data.msg,
        icon:'success'
      })
    } catch (error) {
      showAlertSuccErr({
        title: error.response.data.msg,
        icon:'success'
      })
    }
  }

  if(load) return <Spinner />

  return (
    <>
    
      <h1 className="text-sky-600 font-black text-6xl capitalize">Recupera tu acceso y no pierdas tus {''}<span className="text-slate-700">proyectos</span></h1>
      <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
        <div className="my-5">
          <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
          <input type="email" placeholder="Email de registro" id="email" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={email} onChange={ e => setEmail(e.target.value)}/>
        </div>
        <input type="submit" value="Enviar instrucciones" className="bg-sky-600 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors"/>
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">¿Ya tienes una cuenta? Inicia sesión</Link>
        <Link to="sign-up" className="block text-center my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? Regístrate</Link>
      </nav>

    </>
  )
}

export default ForgotPassword