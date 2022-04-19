import { useEffect } from "react"
import useProjects from "../hooks/useProjects"
import PreviewProject from "../components/PreviewProject"
import Spinner from "../components/Spinner"

const Projects = () => {

  const { projects, load } = useProjects()

  if(load) return <Spinner />

  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>
      <div className="bg-white shadow mt-10 rounded-lg">
        {projects.length ? projects.map(project => <PreviewProject key={project._id} project={project}  />) : <p className="p-5 mt-5 text-center text-gray-600 uppercase">No hay proyectos</p>}
      </div>
    </>
  )
}

export default Projects