import jwt from 'jsonwebtoken'
import fs from 'fs'



//Login user
export const login = (req, res) => {
    try {
        // получаем email и password от пользователя
        const { email, password } = req.body

        let rawdata = fs.readFileSync('./FrontendTest.json');
        let data = JSON.parse(rawdata);
        let users = data.users

        //ищем совпадения по email и password в БД
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
export const getMe = async (req,res) => {
    try {
        let rawdata = fs.readFileSync('./FrontendTest.json');
        let data = JSON.parse(rawdata);
        let users = data.users

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
                //возвращаем ответ пользователю, в котором есть токен, объект user и сообщение
                return res.json({
                    token, 
                    user,
                    message: 'Вы вошли в систему'
                })
            }
        }
        //если совпадений нет, то возвращаем ответ 'Такого пользователя не существует'
        res.json({message:'Такого пользователя не существует'})
    } catch (error) {
        res.json({message:'Нет доступа.'})
    }
}