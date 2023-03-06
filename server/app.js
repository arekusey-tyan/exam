import express from 'express'
import mysql from 'mysql2'
import { body, validationResult } from "express-validator"

const validators = {
	signUpVal: [
		body("username").trim().isString().not().matches(/\s+/),
	],
	logInVal: [
		body("username").trim().isString().not().matches(/\s+/)
	],
	register: [
		body("username").trim().isString().not().matches(/\s+/),
	]
}
const bd = await mysql.createConnection({
	host:  '212.76.129.200', /* 'localhost',*/
	user: 'nm_root',
	password: 'NanoMagicRoot',
	database: 'exam',
	connectionLimit: 0,
	queueLimit: 0
}).promise()
const app = express()

app.use(express.json({limit: '40mb'}))

app.post('/api/login', validators.logInVal, async (req, res) => {
	const err = validationResult(req)
	if (!err.isEmpty()) {
		return res.status(422).json({ errs: err.array() })
	} else {
		let [rows, _] = await bd.execute(`SELECT * FROM users WHERE login = ?`, [req.body.username])
		rows[0] === undefined
			? res.status(422).send({ message: "Пользователь с таким логином не найден." })
			: res.status(200).send({ message: "It's ok", user: rows[0] })
	}
})
app.post('/api/reg', validators.register, async (req, res) => {
	const err = validationResult(req)
	if (!err.isEmpty()) {
		return res.status(422).json({errs: err.array()})
	} else {
		await bd.execute(`INSERT INTO users VALUES (NULL, '${req.body.password}', '${req.body.login}', 0, '0s')`)
		res.status(200).send({message: "ok"})
	}
})
app.post('/api/logout', async (req, res) => {
	res.status(200).send({message: "logouted"})
})
app.post('/api/result', async (req, res) => {
	let [row, _] = await bd.execute(`SELECT * FROM users WHERE id = ${req.body.id}`)
	let best = row[0].besttimes !== '0s' ? row[0].besttimes.split('s')[0] > req.body.time.split('s')[0] ? req.body.time : row[0].besttimes : req.body.time
	let games = row[0].games + 1
	await bd.execute(`UPDATE users SET besttimes = '${best}', games = ${games} WHERE id = ${req.body.id}`)
	res.sendStatus(200)
})
app.post('/api/time/:id', async (req, res) => {
	let [row, _] = await bd.execute(`SELECT * FROM users WHERE id = ${req.params.id}`)
	res.status(200).send({time: row[0].besttimes.split('s')[0], game: row[0].games})
})


app.listen(20001, () => console.log('Server start on port: 20001'))