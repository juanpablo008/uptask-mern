import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"

const app = express()
app.use(express.json())

dotenv.config()

connectDB()

// Config CORS
const whitelist = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.includes(origin)) {
      // Can send access control headers
      callback(null, true)
    } else {
      // Cannot send access control headers
      callback(new Error("No permitido por CORS"))
    }
  },
}

app.use(cors(corsOptions))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})