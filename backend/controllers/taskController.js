import Project from "../models/Project.js"
import Task from "../models/Task.js"
import mongoose from "mongoose"

const addTask = async (req, res) => {
  const { project } = req.body

  if(!mongoose.Types.ObjectId.isValid(project)){
    const error = new Error('Proyecto no válido')
    return res.status(404).json({ msg: error.message })
  }

  const projectExists = await Project.findById(project)

  if(!projectExists){
    const error = new Error('El proyecto no existe')
    return res.status(404).json({ msg: error.message })
  }

  if(projectExists.creator.toString() !== req.user._id.toString()){
    const error = new Error('no tiene permisos para agregar tareas')
    return res.status(403).json({ msg: error.message })
  }

  try {
    const storedTask = await Task.create(req.body)
    projectExists.tasks.push(storedTask._id)
    await projectExists.save()
    res.json(storedTask)
  } catch (error) {
    console.log(error)  
  }
}

const getTask = async (req, res) => {
  const { id } = req.params
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Tarea no válida')
    return res.status(404).json({ msg: error.message })
  }

  const task = await Task.findById(id).populate('project')

  if(!task){
    const error = new Error('La tarea no existe')
    return res.status(404).json({ msg: error.message })
  }

  if(task.project.creator.toString() !== req.user._id.toString()){
    const error = new Error('No tiene permisos para ver esta tarea')
    return res.status(403).json({ msg: error.message })
  }

  res.json(task)
}

const updateTask = async (req, res) => {
  const { id } = req.params
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Tarea no válida')
    return res.status(404).json({ msg: error.message })
  }

  const task = await Task.findById(id).populate('project')

  if(!task){
    const error = new Error('La tarea no existe')
    return res.status(404).json({ msg: error.message })
  }

  if(task.project.creator.toString() !== req.user._id.toString()){
    const error = new Error('No tiene permisos para modificar esta tarea')
    return res.status(403).json({ msg: error.message })
  }

  task.name = req.body.name || task.name
  task.description = req.body.description || task.description
  task.priority = req.body.priority || task.priority
  task.deadline = req.body.deadline || task.deadline

  try {
    const storedTask = await task.save()
    res.json(storedTask)
  } catch (error) {
    console.log(error)  
  }
}

const deleteTask = async (req, res) => {
  const { id } = req.params
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Tarea no válida')
    return res.status(404).json({ msg: error.message })
  }

  const task = await Task.findById(id).populate('project')

  if(!task){
    const error = new Error('La tarea no existe')
    return res.status(404).json({ msg: error.message })
  }

  if(task.project.creator.toString() !== req.user._id.toString()){
    const error = new Error('No tiene permisos para eliminar esta tarea')
    return res.status(403).json({ msg: error.message })
  }

  try {
    const project = await Project.findById(task.project)
    project.tasks.pull(task._id)
    await Promise.allSettled([await project.save(), await task.deleteOne()])
    res.json({ msg: 'Tarea eliminada correctamente' })
  } catch (error) {
    console.log(error)  
  }
}

const changeTaskStatus = async (req, res) => {
  const { id } = req.params
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Tarea no válida')
    return res.status(404).json({ msg: error.message })
  }

  const task = await Task.findById(id).populate('project')

  if(!task){
    const error = new Error('La tarea no existe')
    return res.status(404).json({ msg: error.message })
  }

  if(task.project.creator.toString() !== req.user._id.toString() && !task.project.partners.some( partner => partner._id.toString() === req.user._id.toString() )){
    const error = new Error('No tiene permisos para cambiar el estado de esta tarea')
    return res.status(403).json({ msg: error.message })
  }

  task.state = !task.state
  task.complete = req.user._id

  try {
    await task.save()
    const storedTask = await Task.findById(id).populate('project').populate('complete')
    res.json(storedTask)
  } catch (error) {
    console.log(error)  
  }
}

export {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeTaskStatus
}