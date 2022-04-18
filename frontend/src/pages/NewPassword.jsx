import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import clientAxios from "../config/clientAxios"
import useAuth from "../hooks/useAuth"
import useProjects from "../hooks/useProjects"
import Spinner from "../components/Spinner"

const NewPassword = () => {

  const { load } = useAuth()
  const { showAlertSuccErr } = useProjects()
  
  const [validToken, setValidToken] = useState(false)
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [changedPassword, setChangedPassword] = useState(false)

  const params = useParams()
  const { token } = params
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const url = `/users/forgot-password/${token}`
        await clientAxios(url)
        setValidToken(true)
      } catch (error) {
        showAlertSuccErr({
          title: error.response.data.msg,
          icon:'error'
        })
      }
    }
    checkToken()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

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
        icon:'error'
      })
      return
    }

    try {
      const url = `/users/forgot-password/${token}`
      const { data } = await clientAxios.post(url, {password})
      showAlertSuccErr({
        title: data.msg,
        icon:'success'
      })
      setChangedPassword(true)
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
      <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu contraseña y no pierdas acceso a tus {''}<span className="text-slate-700">proyectos</span></h1>
      {validToken && (
        <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
          <div className="my-5">
            <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Nueva contraseña</label>
            <input type="password" placeholder="Nueva contraseña" id="password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={password} onChange={ e => setPassword(e.target.value)} />
          </div>
          <div className="my-5">
            <label htmlFor="repeat-password" className="uppercase text-gray-600 block text-xl font-bold">Repetir nueva contraseña</label>
            <input type="password" placeholder="Repetir nueva contraseña" id="repeat-password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={repeatPassword} onChange={ e => setRepeatPassword(e.target.value)} />
          </div>
          <input type="submit" value="Guardar nueva contraseña" className="bg-sky-600 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors"/>
        </form>
      )}

      {changedPassword && ( 
        <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Inicia sesión</Link>
      )}
    </>
  )
}

export default NewPassword