import { useEffect } from "react"
import PartnerForm from "../components/PartnerForm"
import useProjects from "../hooks/useProjects"
import { useParams } from "react-router-dom"
import Spinner from "../components/Spinner"

const NewPartner = () => {

  const { getProject, project, partner, load, loadComponent, addPartner } = useProjects()

  const params = useParams()

  useEffect(() => {
    getProject(params.id)
  }, [])

  if(load) return <Spinner />

  return (
    <>
      <h1 className="text-xl md:text-4xl font-black">Añadir Colaborador(a) al Proyecto: {project.name}</h1>
      <div className="mt-10 flex justify-center">
        <PartnerForm />
      </div>
      { loadComponent ? <Spinner /> : partner?._id && (
        <div className="flex justify-center mt-10">
          <div className="bg-white py-10 px-5 w-full md:w-2/3 rounded-lg shadow">
            <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>{partner.name}</p>
              <button type="button" className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm hover:bg-slate-600 transition-colors mt-5 md:mt-0" onClick={() => addPartner({email: partner.email}, params.id)}>Agregar al Proyecto</button>
            </div>
          </div>
        </div>
      ) }
    </>
  )
}

export default NewPartner