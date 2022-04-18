import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import { validateDate } from '../helpers/validateDate'

const ProjectForm = () => {

  const [id, setId] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [client, setClient] = useState('')

  const params = useParams()
  const { showAlertSuccErr, submitProject, project } = useProjects()

  useEffect(() => {
    if(params.id) {
      setId(project._id)
      setName(project.name)
      setDescription(project.description)
      setDeadline(project.deadline?.split('T').shift())
      setClient(project.client)
    }
  }, [params])

  const handleSubmit = async e => {
    e.preventDefault()
    if([name, description, deadline, client].includes('')) {
      showAlertSuccErr({
        icon: 'error',
        title: "Todos los campos son obligatorios"
      })
      return
    }

    if(validateDate(deadline)) {
      showAlertSuccErr({
        title: "La fecha debe ser mayor a la actual",
        icon: 'error'
      })
      return
    }

    await submitProject({
      id,
      name,
      description,
      deadline,
      client
    })

    setId(null)
    setName('')
    setDescription('')
    setDeadline('')
    setClient('')
  }

  return (
    <form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow' onSubmit={handleSubmit}>
      <div className='mb-5'>
        <label htmlFor="name" className='text-gray-700 uppercase font-bold text-sm'>Nombre Proyecto:</label>
        <input id='name' type="text" className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' placeholder='Nombre del Proyecto' value={name || ''} onChange={e => setName(e.target.value)} />
      </div>
      <div className='mb-5'>
        <label htmlFor="description" className='text-gray-700 uppercase font-bold text-sm'>Descripción:</label>
        <textarea id='description' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' placeholder='Description del Proyecto' value={description || ''} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className='mb-5'>
        <label htmlFor="deadline" className='text-gray-700 uppercase font-bold text-sm'>Fecha de entrega del Proyecto:</label>
        <input id='deadline' type="date" className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' value={deadline || ''} onChange={e => setDeadline(e.target.value)} />
      </div>
      <div className='mb-5'>
        <label htmlFor="client" className='text-gray-700 uppercase font-bold text-sm'>Nombre del Cliente:</label>
        <input id='client' type="text" className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' placeholder='Nombre del Cliente' value={client || ''} onChange={e => setClient(e.target.value)} />
      </div>
      <input type="submit" value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'} className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors' />
    </form>
  )
}

export default ProjectForm