import jwt from 'jsonwebtoken'
import fs from 'fs'

let rawdata = fs.readFileSync('./FrontendTest.json')
let data = JSON.parse(rawdata)
let users = data.users

//Login user
export const login = (req, res) => {
    try {
        // получаем email и password от пользователя
        const { email, password } = req.body

        //ищем совпадения по email и password
        for (let i = 0; users.length > i; i++) {
            if (email === users[i].email && password === users[i].password) {
                const user = {
                    name: users[i].name,
                    email: users[i].email
                }
                const token = jwt.sign(
                    { id: users[i].name },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                )
                //возвращаем ответ пользователю, в котором есть токен, объект user и сообщение
                return res.json({
                    token, 
                    user,
                    message: 'Вы вошли в систему'
                })
            }
        }
        res.json({ message: 'Проверьте данные для входа' })
    } catch (error) {
        res.json({ message: 'Ошибка авторизации' })
    }
}

//Get me
export const getMe = (req,res) => {
    try {
        const {count, select} = req.body.data
        let sort

        for (let i = 0; users.length > i; i++) {
            if(users[i].name === req.username) {
                const user = {
                    name: users[i].name,
                    email: users[i].email
                }

                const token = jwt.sign(
                    { id: users[i].name },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                )

                if(select === '1') {
                sort = data.orders.sort((a,b)=>{
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })}
                if(select === '2') {
                sort = data.orders.sort((a,b)=>{
                    if (a.amount < b.amount) return 1
                    if (a.amount > b.amount) return -1
                    return 0
                })}
                if(select === '3') {
                sort = data.orders.sort((a,b)=>{
                    if (a.date < b.date) return 1
                    if (a.date > b.date) return -1
                    return 0
                })}
                const orders = sort.slice([0], [count])
                
                const isNext = Boolean(data.orders[count])
         
                return res.json({
                    token, 
                    user,
                    orders,
                    isNext
                })
            }
        }
        //если совпадений нет, то возвращаем ответ 'Такого пользователя не существует'
        res.json({message:'Такого пользователя не существует'})
    } catch (error) {
        res.json({message:'Нет доступа.'})
    }
}