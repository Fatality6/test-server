import jwt from 'jsonwebtoken'
import fs from 'fs'

//читаем фаил json
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
            //если есть совпадение
            if (email === users[i].email && password === users[i].password) {
                //формируем объект user для ответа
                const user = {
                    name: users[i].name,
                    email: users[i].email
                }
                //при помощи jsonwebtoken создаём токен шифруя имя и используя секретную строку на период в 30 дней
                const token = jwt.sign(
                    { id: users[i].name },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                )
                //возвращаем ответ пользователю, в котором есть токен, объект user и сообщение
                return res.status(200).json({
                    token,
                    user,
                    message: 'Вы вошли в систему'
                })
            }
        }
        res.status(401).json({ message: 'Проверьте данные для входа' })
    } catch (error) {
        res.status(500).json({ message: 'Ошибка авторизации' })
    }
}

//Get me
export const getMe = (req, res) => {
    try {
        const { count, select } = req.body.data

        let sort

        for (let i = 0; users.length > i; i++) {
            if (users[i].name === req.username) {
                const user = {
                    name: users[i].name,
                    email: users[i].email
                }
                //создание токена
                const token = jwt.sign(
                    { id: users[i].name },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                )
                //сортировка
                switch (select) {
                    case '1':
                        sort = data.orders.sort((a, b) => {
                            if (a.id > b.id) return 1
                            if (a.id < b.id) return -1
                            return 0
                        });
                        break;
                    case '2':
                        sort = data.orders.sort((a, b) => {
                            if (a.amount < b.amount) return 1
                            if (a.amount > b.amount) return -1
                            return 0
                        });
                        break;
                    case '3':
                        sort = data.orders.sort((a, b) => {
                            if (a.date < b.date) return 1
                            if (a.date > b.date) return -1
                            return 0
                        });
                        break;
                    default:
                        throw new Error("Invalid sort type");
                }
                //выбор диапазона ответа в зависимости от count
                const orders = sort.slice([0], [count])
                //есть ли ещё заказы после последнего переданного
                const isNext = Boolean(data.orders[count])
                //возвращаем ответ
                return res.status(200).json({
                    token,
                    user,
                    orders,
                    isNext
                })
            }
        }
        res.status(404).json({ message: 'Такого пользователя не существует' })
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении информации о пользователе' })
    }
}