import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import clientAxios from "../config/clientAxios"
import useAuth from "../hooks/useAuth"
import useProjects from "../hooks/useProjects"
import Spinner from "../components/Spinner"

const ConfirmAccount = () => {

  const { load } = useAuth()
  const { showAlertSuccErr } = useProjects()

  const [accountConfirmed, setAccountConfirmed] = useState(false)
  const params = useParams()
  const { id } = params

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const url = `/users/confirm/${id}`
        const { data } = await clientAxios(url)
        showAlertSuccErr({
          title: data.msg,
          icon:'success'
        })

        setAccountConfirmed(true)
      } catch (error) {
        showAlertSuccErr({
          title: error.response.data.msg,
          icon:'error'
        })
      }
    }
    confirmAccount()
  }, [])

  if(load) return <Spinner />

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Confirma tu cuenta y comienza a crear tus {''}<span className="text-slate-700">proyectos</span></h1>

      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {accountConfirmed && (
          <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Inicia sesión</Link>
        )}
      </div>
    </>
  )
}

export default ConfirmAccount