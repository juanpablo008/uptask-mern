import useProjects from "../hooks/useProjects";

const Partner = ({partner}) => {

  const { showAlertConfirm, deletePartner } = useProjects()

  const { name, email } = partner

  const handleClickDelete = async () => {

    const response = await showAlertConfirm({
      title: "¿Estás seguro de eliminar este colaborador?",
      text:"Una vez eliminado, esta persona no podrá acceder al proyecto",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
      confirmButtonText: "Eliminar",
      icon: "error",
      iconHtml: "!"
    })
    
    if(response){
      deletePartner(partner)
    }
  }

  return (
    <div className="border-b p-5 flex gap-2 justify-between items-center">
      <div>
        <p>{name}</p>
        <p className="text-sm text-gray-700">{email}</p>
      </div>
      <div>
        <button className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-red-700 transition-colors" onClick={handleClickDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Partner