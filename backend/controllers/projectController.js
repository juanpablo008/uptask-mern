import Project from '../models/Project.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

const getProjects = async (req, res) => {
  const projects = await Project.find({
    '$or' : [
      { creator: { '$in': req.user} },
      { partners: { '$in': req.user } }
    ]
  }).select('-tasks')
  res.json(projects)
}

const newProject = async (req, res) => {
  const project = new Project(req.body)
  project.creator = req.user._id

  try {
    const storedProject = await project.save()
    res.json(storedProject)
  } catch (error) {
    console.log(error)    
  }
}

const getProject = async (req, res) => {
  const { id } = req.params

  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Proyecto no válido')
    return res.status(404).json({ msg: error.message })
  }

  const project = await Project.findById(id).populate({ path: 'tasks', populate: { path: 'complete', select: 'name' } }).populate('partners', "name email")

  if(!project){
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ msg: error.message })
  } 

  if(project.creator.toString() !== req.user._id.toString() && !project.partners.some(partner => partner._id.toString() === req.user._id.toString())){
    const error = new Error('No tienes permisos para ver este proyecto')
    return res.status(403).json({ msg: error.message })
  } 

  res.json(project)
}

const updateProject = async (req, res) => {
  const { id } = req.params

  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Proyecto no válido')
    return res.status(404).json({ msg: error.message })
  }
  
  const project = await Project.findById(id)

  if(!project){
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ msg: error.message })
  } 
  if(project.creator.toString() !== req.user._id.toString()){
    const error = new Error('No tienes permisos para actualizar este proyecto')
    return res.status(403).json({ msg: error.message })
  } 
  
  project.name = req.body.name || project.name
  project.description = req.body.description || project.description
  project.deadline = req.body.deadline || project.deadline
  project.client = req.body.client || project.client

  try {
    const storedProject = await project.save()
    res.json(storedProject)
  } catch (error) {
    console.log(error)      
  }

}

const deleteProject = async (req, res) => {
  const { id } = req.params

  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Proyecto no válido')
    return res.status(404).json({ msg: error.message })
  }
  
  const project = await Project.findById(id)

  if(!project){
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ msg: error.message })
  } 
  if(project.creator.toString() !== req.user._id.toString()){
    const error = new Error('No tienes permisos para eliminar este proyecto')
    return res.status(403).json({ msg: error.message })
  } 

  try {
    await project.deleteOne();
    res.json({ msg: 'Proyecto eliminado correctamente' })
  } catch (error) {
    console.log(error)        
  }
}

const getPartner = async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email }).select('-password -token -confirmed -__v -createdAt -updatedAt') 

  if(!user){
    const error = new Error('Usuario no encontrado')
    return res.status(404).json({ msg: error.message })
  }

  res.json(user)

}

const addPartner = async (req, res) => {
  const { id } = req.params

  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Usuario no válido')
    return res.status(404).json({ msg: error.message })
  }
  
  const project = await Project.findById(id).populate('creator', 'email')

  if(!project){
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ msg: error.message })
  } 
  if(project.creator._id.toString() !== req.user._id.toString()){
    const error = new Error('No tiene permisos para agregar un colaborador a este proyecto')
    return res.status(403).json({ msg: error.message })
  } 

  const { email } = req.body

  if(email === project.creator.email){
    const error = new Error('No puedes agregarte a ti mismo')
    return res.status(400).json({ msg: error.message })
  }
  
  const user = await User.findOne({ email }).select('-password -token -confirmed -__v -createdAt -updatedAt') 

  if(!user){
    const error = new Error('Usuario no encontrado')
    return res.status(404).json({ msg: error.message })
  }

  if(project.partners.includes(user._id)){
    const error = new Error('El usuario ya es parte del proyecto')
    return res.status(400).json({ msg: error.message })
  }

  project.partners.push(user._id)
  await project.save()

  res.json({ msg: 'Colaborador(a) agregado correctamente' })

  
}

const removePartner = async (req, res) => {
  const { id } = req.params

  if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error('Proyecto no válido')
    return res.status(404).json({ msg: error.message })
  }
  
  const project = await Project.findById(id)

  if(!project){
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ msg: error.message })
  } 
  if(project.creator._id.toString() !== req.user._id.toString()){
    const error = new Error('No tienes permisos para eliminar eliminar este colaborador')
    return res.status(403).json({ msg: error.message })
  } 

  try {
    project.partners.pull(req.body._id)
    await project.save()
    res.json({ msg: 'Colaborador(a) eliminado correctamente' })
  } catch (error) {
    console.log(error)
  }
  

}



export {
  getProjects,
  newProject,
  getProject,
  updateProject,
  deleteProject,
  getPartner,
  addPartner,
  removePartner
}