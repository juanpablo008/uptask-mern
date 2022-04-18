import { formatDate } from "../helpers/formatDate"
import useProjects from "../hooks/useProjects"
import useAdmin from "../hooks/useAdmin"

const Task = ({ task }) => {

  const { handleModalEditTask, showAlertConfirm, deleteTask, changeTaskStatus } = useProjects()
  const admin = useAdmin()

  const PRIORITY = [
    {value:'low', text: 'Baja'},
    {value:'medium', text: 'Media'},
    {value:'high', text: 'Alta'}
  ]
  
  const { name, description, deadline, priority, state, _id, complete } = task

  const newPriority = PRIORITY.find(item => item.value === priority)

  const handleClickDelete = async () => {
    const response = await showAlertConfirm({
      title: "¿Estás seguro de eliminar esta tarea?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
      confirmButtonText: "Eliminar",
      icon: "error",
      iconHtml: "!"
    })
    
    if(response) {
      deleteTask(task._id)
    }
  }

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="text-xl mb-1">{name}</p>
        <p className="text-sm text-gray-500 uppercase mb-1">{description}</p>
        <p className="text-sm mb-1">{formatDate(deadline)}</p>
        <p className="text-gray-600 mb-1">Prioridad: {newPriority.text}</p>
        {state && <p className="text-xs bg-green-500 p-1 rounded-lg text-white">Completada por: {complete.name}</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {admin && (
          <button className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors" onClick={() => handleModalEditTask(task)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        <button className={`${state ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-700'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg  transition-colors`} onClick={() => changeTaskStatus(_id)}>
          {state ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        {admin && (
          <button className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-red-700 transition-colors" onClick={handleClickDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Task