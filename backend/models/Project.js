import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  deadline: {
    type: Date,
    default: Date.now(),
  },
  client: {
    type: String,
    trim: true,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  partners: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
})

const Project = mongoose.model("Project", ProjectSchema)

export default Project
