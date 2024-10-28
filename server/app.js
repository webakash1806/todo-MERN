import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import userRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'
import errorMiddleware from './middleware/error.middleware.js'
config()

const app = express()

app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173","https://akash.webakash1806.com"],
    credentials: true
}))

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use(cookieParser())

app.use(morgan("dev"))

app.use('/api/v1/test', function (req, res) {
    res.status(200).send({
        success: true,
        message: "API is running..."
    })
})

app.use('/api/v1/user', userRoutes)

app.use('/api/v1/task', taskRoutes)

app.use('*', function (req, res) {
    res.status(404).send("OOPS! 404 Page not found.")
})

app.use(errorMiddleware)

export default app
