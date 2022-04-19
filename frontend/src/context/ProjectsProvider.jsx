import { useState, useEffect, createContext } from "react"
import clientAxios from "../config/clientAxios"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Swal from 'sweetalert2'
import io from 'socket.io-client'
let socket

const ProjectsContext = createContext()

const ProjectsProvider = ({ children }) => {

  const [projects, setProjects] = useState([])
  const [project, setProject] = useState({})
  const [load, setLoad] = useState(false)
  const [loadComponent, setLoadComponent] = useState(false)
  const [modalTaskForm, setModalTaskForm] = useState(false)
  const [task, setTask] = useState({})
  const [partner, setPartner] = useState({})
  const [browser, setBrowser] = useState(false)

  const navigate = useNavigate()

  const { auth } = useAuth()

  useEffect(() => {
    const getProjects = async () => {
      setLoad(true)
      try {
        const token = localStorage.getItem("token")
        if(!token) return

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }

        const url = '/projects'

        const { data } = await clientAxios(url, config)
        setProjects(data)
      } catch (error) {
        console.log(error)
      }
      setLoad(false)
    }
    getProjects()
  }, [auth])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
  }, [])

  const showAlertConfirm = async  alert => {
    let response
    await Swal.fire(alert).then((result) => {
      
      if (result.isConfirmed) {
        response = true
      } else if (result.isDenied) {
        response = false
      }
    })
    return response
  }

  const showAlertSuccErr = alert => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire(alert)
  }

  const handleModalTaskForm = () => {
    setModalTaskForm(!modalTaskForm)
    setTask({})
  }

  const handleModalEditTask = task => {
    setTask(task)
    setModalTaskForm(true)
  }

  const handleBrowser = () => {
    setBrowser(!browser)
  }

  // Socket io 
  const submitTasksProject = async (task) => {
    const updatedProject = { ...project }
    updatedProject.tasks = [...updatedProject.tasks, task]
    setProject(updatedProject)
  }

  const submitTask = async task => {

    if(task?.id){
      await editTask(task)
    }else{
      await createTask(task)
    }
  }

  const sumbitPartner = async email => {
    setLoadComponent(true)
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = '/projects/partners'

      const { data } = await clientAxios.post(url, {email}, config)

      setPartner(data)

    } catch (error) {
      showAlertSuccErr({
        title: error.response.data.msg,
        icon: 'error'
      })
    } 
    setLoadComponent(false)
  }

  const addPartner = async (email, projectId) => {
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = `/projects/partners/${project._id}`

      const { data } = await clientAxios.post(url, email, config)

      showAlertSuccErr({
        title: data.msg,
        icon: 'success'
      })

      setPartner({})
      navigate(`/projects/${projectId}`)

    } catch (error) {
      showAlertSuccErr({
        title: error.response.data.msg,
        icon: 'error'
      })
    }
  }

  const deletePartner = async (partner) => {

    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = `/projects/delete-partner/${project._id}`

      const { data } = await clientAxios.post(url, partner, config)

      const updatedProject = { ...project }
      updatedProject.partners = updatedProject.partners.filter(partnerState => partnerState._id !== partner._id)

      setProject(updatedProject)

      showAlertSuccErr({
        title: data.msg,
        icon: 'success'
      })
    } catch (error) {
      showAlertSuccErr({
        title: error.response.data.msg,
        icon: 'error'
      })  
    }
  }

  const editTask = async task => {
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = `/tasks/${task.id}`

      const { data } = await clientAxios.put(url, task, config)

      showAlertSuccErr({
        title: 'Tarea actualizada correctamente',
        icon: 'success'
      })

      const updatedProject = { ...project }
      updatedProject.tasks = updatedProject.tasks.map(taskState => taskState._id === data._id ? data : taskState)
      setProject(updatedProject)

      setTimeout(() => {
        setModalTaskForm(false)
      }, 1000);

    } catch (error) {
      console.log(error)  
    }
  }

  const changeTaskStatus = async id => {
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = `/tasks/status/${id}`

      const { data } = await clientAxios.post(url, {}, config)
      
      const updatedProject = { ...project }
      updatedProject.tasks = updatedProject.tasks.map(taskState => taskState._id === data._id ? data : taskState)
      setProject(updatedProject)
      setTask({})

    } catch (error) {
      console.log(error.response)
      showAlertSuccErr({
        title: error.response.data.msg,
        icon: 'error'
      })
    }
  }

  const createTask = async task => {
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = '/tasks'

      const { data } = await clientAxios.post(url, task, config)

      showAlertSuccErr({
        title: 'Tarea creada correctamente',
        icon: 'success'
      })

      setTimeout(() => {
        setModalTaskForm(false)
      }, 1000);

      // Socket io
      socket.emit('new task', data)

    } catch (error) {
      console.log(error)  
    }
  }

  const deleteTask = async id => {
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = `/tasks/${id}`

      const { data } = await clientAxios.delete(url, config)

      const updatedProject = {...project}
      updatedProject.tasks = updatedProject.tasks.filter(stateTask => stateTask._id !== id)
      setProject(updatedProject)

      showAlertSuccErr({
        icon: 'success',
        title: data.msg
      })

    } catch (error) {
      console.log(error)
    }
  }

  const getProject = async id => {

    setLoad(true)

    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = `/projects/${id}`

      const { data } = await clientAxios(url, config)

      setProject(data)

    } catch (error) {
      showAlertSuccErr({
        title: error.response.data.msg,
        icon: 'error'
      })
      navigate('/projects')
      console.log(error)
    }
    setLoad(false)
  }

  const submitProject = async project => {

    if(project.id){
      await editProject(project)
    } else {
      await newProject(project)
    }
  }

  const editProject = async project => {
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = `/projects/${project.id}`

      const { data } = await clientAxios.put(url, project, config)

      const updatedProjects = projects.map(stateProject => stateProject._id === data._id ? data : stateProject)

      setProjects(updatedProjects)

      showAlertSuccErr({
        icon: 'success',
        title: "Proyecto actualizado correctamente"
      })

      setTimeout(() => {
        navigate("/projects")
      }, 1500);

    } catch (error) {
      console.log(error)
    }
  }

  const newProject = async project => {
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = '/projects'

      const { data } = await clientAxios.post(url, project, config)

      setProjects([...projects, data])

      showAlertSuccErr({
        icon: 'success',
        title: "Proyecto creado correctamente"
      })

      setTimeout(() => {
        navigate("/projects")
      }, 1500);

    } catch (error) {
      console.log(error)
    }
  }

  const deleteProject = async id => {
    try {
      const token = localStorage.getItem("token")
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const url = `/projects/${id}`

      const { data } = await clientAxios.delete(url, config)

      const updatedProjects = projects.filter(stateProject => stateProject._id !== id)

      setProjects(updatedProjects)

      showAlertSuccErr({
        icon: 'success',
        title: data.msg
      })

      setTimeout(() => {
        navigate("/projects")
      }, 1500);

    } catch (error) {
      console.log(error)
    }
  }

  return(
    <ProjectsContext.Provider 
      value={{
        projects,
        showAlertSuccErr,
        showAlertConfirm,
        submitProject,
        getProject,
        project,
        load,
        setLoad,
        loadComponent,
        setLoadComponent,
        deleteProject,
        handleModalTaskForm,
        modalTaskForm,
        submitTask,
        handleModalEditTask,
        task,
        deleteTask,
        sumbitPartner,
        partner,
        addPartner,
        deletePartner,
        changeTaskStatus,
        browser,
        handleBrowser,
        submitTasksProject
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }

export default ProjectsContext