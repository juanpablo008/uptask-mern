import { useState, useEffect } from 'react'
import { useParams, Link } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import useAdmin from '../hooks/useAdmin'
import ModalTaskForm from "../components/ModalTaskForm"
import Task from '../components/Task'
import Partner from '../components/Partner'
import Spinner from '../components/Spinner'

const Project = () => {

  const params = useParams()
  const { getProject, project, handleModalTaskForm, load } = useProjects()
  const admin = useAdmin()

  useEffect( () => {
    getProject(params.id)
  }, [])

  const { name } = project

  return (
    load ? <Spinner /> : (
      <>
        <div className='flex justify-between'>
          <h1 className='font-black text-xl md::text-4xl'>{name}</h1>
          {admin && (
            <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <Link to={`/projects/edit/${params.id}`} className='uppercase font-bold'>Editar</Link>
            </div>
          )}
        </div>

        {admin && (
          <button 
            onClick={ handleModalTaskForm }
            type='button' 
            className='flex items-center justify-center gap-2 text-sm mt-5 px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 hover:bg-sky-500 transition-colors text-white text-center' 
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Nueva tarea
          </button>
        )}

        <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

        <div className='bg-white shadow mt-10 rounded-lg'>
          {project.tasks?.length ? project.tasks?.map(task => <Task key={task._id} task={task} />) : <p className='p-10 my-5 text-center text-gray-600 uppercase font-bold'>No hay tareas en este proyecto</p>}
        </div>
        
        {admin && (
          <>
            <div className='flex items-center justify-between mt-10'>
              <p className='font-bold text-xl'>Colaboradores</p>
              <Link to={`/projects/new-partner/${project._id}`} className='text-gray-400 hover:text-black transition-colors uppercase font-bold flex items-center gap-2'>
                Añadir
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </Link>
            </div>
          
            <div className='bg-white shadow mt-10 rounded-lg'>
              {project.partners?.length ? project.partners?.map( partner => <Partner key={partner._id} partner={partner} />) : <p className='p-10 my-5 text-center text-gray-600 uppercase font-bold'>No hay colaboradores en este proyecto</p>}
            </div>
          </>
        )}

        <ModalTaskForm />
      </>
    )
  )
}

export default Project