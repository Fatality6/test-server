import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoute from './routes/auth.js'

//создаём приложение express
const app = express()

//подключаем пакет dotenv
dotenv.config()

// Constants
//с помощью dotenv данные берутся из файла .env
const PORT = process.env.PORT

// MiddleWare
//cors разрешает браузеру делать запросы с других портов
app.use(cors())
// встроенный посредник, разбирающий входящие запросы в объект в формате JSON.
app.use(express.json())

// Routes
app.use('/api/auth', authRoute)

//объявляем асинхронную функцию start, которая будет запускать приложение express
async function start() {
    try {
        
        //затем запускаем приложение на заданном порту
        app.listen(`${PORT}`, ()=>console.log(`Server has been started on port:${PORT}`))

    } catch (error) {
        console.log(error)
    }
}

//запускаем функцию start
start()