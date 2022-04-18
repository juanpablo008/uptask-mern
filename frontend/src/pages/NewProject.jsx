import ProjectForm from "../components/ProjectForm"

const NewProject = () => {
  return (
    <>
      <h1 className="text-4xl font-black">Crear Proyecto</h1>
      <div className="mt-10 flex justify-center">
        <ProjectForm />
      </div>
    </>
  )
}

export default NewProject