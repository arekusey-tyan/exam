import React, { useState, useEffect } from "react";
import Board from "./components/Board.js";
import initializeDeck from "./deck";
import bg from './uploads/bg2.mp4'
import {getLogin, regUser, saveResult, setTimer, timer, getTime} from './utils/Request.js'
import {md5} from './utils/md5.js'
import {BrowserRouter as Router, Route, Routes, useRoutes} from 'react-router-dom'
import {body} from "express-validator";

export default function App() {
	return (<>
		<Router>
			<AppRoute />
		</Router>
	</>)
}

function AppRoute() {
	let routes = useRoutes([
		{path: '/', element: <Main />},
		{path: '/register', element: <Register />}
	])
	return routes
}

function Register() {
	function register(e) {
		e.preventDefault()
		let el1 = document.querySelector("[name='username']").value,
			el2 = document.querySelector('[name="password"]').value,
			el3 = document.querySelector('[name="password2"]').value
		if (el2 === el3) {
			let json = JSON.stringify({login: el1, password: md5(md5(md5(md5(el2))))})
			let res = regUser(json)
			if (res.errs === void 0) {
				window.localStorage.setItem('uid', res.user.id)
				window.location.href = '/'
			} else {
				document.querySelector('.response').innerHTML = '<b>' + res.errs[0].param + '</b>: ' + res.errs[0].msg
			}
		}
	}
	document.body.style.padding = 0

	return (
		<>
			<video playsInline autoPlay muted loop style={{ zIndex: -1 }}>
				<source src={bg} />
			</video>
			<div id="login">
				<div className="login">
					<div id="authm" className="p-0">
						<div className="row no-gutters">
							<div className="col-12 p-md-4">
								<div className="h5 text-center" style={{ marginBottom: 200 + 'px' }}>Регистрация пользователя</div>
								<form className="py-3">
									<div className="form-group"><input type="text" className="form-control" id="inputEmail" name="username" placeholder="Ваш логин" /></div>
									<div className="form-group"><input type={'password'} className={'form-control'} id={'inputPassword'} name={'password'} placeholder={'Ваш пароль'} /></div>
									<div className="form-group"><input type={'password'} className={'form-control'} id={'inputPassword2'} name={'password2'} placeholder={'Повторите пароль'} /></div>
									<button className="btn btn-primary btn-block px-3" style={{ paddingTop: 10 + 'px' }} onClick={register}>Зарегестрироваться</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer f90 mt-auto" style={{margin: '0 auto'}}>
				<div className="container py-3 text-muted">
					<div className="row" style={{width: '150px', margin: '0 auto', display: 'block'}}>
						<div className="col-12 col-md-2" style={{maxWidth: '100%'}}>
							<div className="d-flex align-items-center h-100">
								<div className="ttle">© <span style={{fontWeight: 400}} /> 2023-{new Date(new Date()).getFullYear()}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

function Main() {
	const [cards, setCards] = useState([])
	const [flipped, setFlipped] = useState([])
	let [dimension, setDimension] = useState(400)
	const [solved, setSolved] = useState([])
	const [disabled, setDisabled] = useState(false)
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		resizeBoard();
		setCards(initializeDeck(getSize(+window.localStorage.getItem('selected'))))
	}, [])

	useEffect(() => {
		preloadImages()
	}, cards)

	useEffect(() => {
		const resizeListener = window.addEventListener('resize', resizeBoard)
		return () => window.removeEventListener('resize', resizeListener)
	})

	const getSize = size => {
		size = [0,2,4,6,8,10,12,14,16][size]
		let arr = new Array(size * size / 2)
		for (let i = 0; i < arr.length; i++) {
			arr[i] = i + 1
		}
		return arr
	}

	const preloadImages = () => {
		cards.map(card => {
			const src = `/img/${card.type}.png`
			return (new Image().src = src)
		})
	}

	const resizeBoard = () => {
		setDimension(Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight))
	}

	const someCardClickedTwice = id => flipped.includes(id)

	const isMatch = id => {
		const clickedCard = cards.find(card => card.id === id)
		const flippedCard = cards.find(card => flipped[0] === card.id)
		return flippedCard.type === clickedCard.type
	}

	const resetCards = () => {
		setFlipped([])
		setDisabled(false)
	}

	const handleClick = id => {
		setDisabled(true)
		if (flipped.length === 0) {
			setFlipped(flipped => [...flipped, id])
			setDisabled(false)
		} else {
			if (someCardClickedTwice(flipped, id)) return
			setFlipped(flipped => [...flipped, id])
			if (isMatch(id)) {
				setSolved([...solved, ...flipped, id])
				resetCards()
			} else {
				setTimeout(resetCards, 2000)
			}
		}
	}
	if (window.localStorage.getItem('uid')) {
		let i = void 0
		if (solved.length === cards.length && cards.length !== 0) {
			let time = window.localStorage.getItem('starttime')
			let time2 = Math.floor((Date.now() - time) / 1000)
			window.localStorage.removeItem('selected')
			window.localStorage.removeItem('starttime')

			function saveRes() {
				saveResult(time2 * 1000)
				window.location.reload()
			}

			return <>
				<div>Время прохождения:{time2}</div>
				<button onClick={saveRes}>Save Result</button>
			</>
		}
		if (window.localStorage.getItem('selected') !== null) {
			let selected = window.localStorage.getItem('selected')
			let width
			if (selected === '1') {
				width = dimension / 2
			} else if (selected === '2') {
				width = '900px'
			} else if (selected === '3') {
				width = '900px'
				dimension = 600
			} else if (selected === '4') {
				width = '900px'
				dimension = 480
			}
			return <>
				<Board size={+window.localStorage.getItem('selected')} cards={cards} dimension={dimension} flipped={flipped} handleClick={handleClick} disabled={disabled} solved={solved} width={width} height={width} />
			</>
		}

		function startGame() {
			let e = document.querySelector('[name="size"]')
			if (e.value !== 0) {
				window.localStorage.setItem('selected', e.value)
				setTimer()
				window.localStorage.setItem('starttime', timer)
				window.location.reload()
			}
		}

		function format(time) {
			time = +time
			time /= 1000
			let s, m, h, d
			d = Math.floor(time / 86400)
			time -= d * 86400
			h = Math.floor(time / 3600)
			time -= h * 3600
			m = Math.floor(time / 60)
			time -= m * 60
			s = time

			let types = [[], ['день', 'дня', 'дней'], ['час', 'часа', 'часов'], ['минута', 'минуты', 'минут'], ['секунда', 'секунды', 'секунд']],
				cases = [2, 0, 1, 1, 1, 2]

			function plural(n, t) {
				let type = types[t]
				console.log(type)
				return type[(n % 100 > 4 && n % 100 < 20) ? 2 : cases[Math.min(n % 10, 5)]]
			}

			return `${d} ${plural(d, 1)}, ${h} ${plural(h, 2)}, ${m} ${plural(m, 3)}, ${s} ${plural(s, 4)}`
		}

		function changeTheme() {
			if (isDark) {
				setIsDark(false);
			} else {
				setIsDark(true);
			}
		}

		if (isDark) {
			document.body.classList.add('dark')
		} else {
			document.body.classList.remove('dark')
		}

		return (
			<div>
				<h1>Игра "Память"</h1>
				<h3>Вспоминайте где какие карты. Задача: открыть попарно. Удачи.</h3>
				<h3>Настройки игры</h3>
				<h4>Ваш лучший результат: {format(getTime().time)}, кол-во игр: {getTime().game}</h4>
				<select name={'size'} >
					<option selected={true} disabled={true}>Размер поля</option>
					<option value={1}>2x2</option>
					<option value={2}>4x4</option>
					<option value={3}>6x6</option>
					<option value={4}>8x8</option>
				</select>
				<button onClick={startGame}>Начать игру</button>
				<button onClick={changeTheme}>Сменить на {isDark ? 'светлую' : 'темную'} тему</button>
			</div>
		)
	} else {
		document.body.style.padding = 0
		return (
			<>
				<video playsInline autoPlay muted loop style={{ zIndex: -1 }}>
					<source src={bg} />
				</video>
				<div id="login">
					<div className="login">
						<div id="authm" className="p-0">
							<div className="row no-gutters">
								<div className="col-12 p-md-4">
									<div className="h5 text-center" style={{ marginBottom: 200 + 'px' }}>Авторизация</div>
									<form className="py-3" onSubmit={login}>
										<div className="form-group">
											<input type="text" className="form-control" id="inputEmail" name="username" placeholder="Ваш логин" />
										</div>
										<div className="form-group">
											<input className="form-control" type="password" id="inputPassword" name="password" placeholder="Ваш пароль" />
										</div>
										<button className="btn btn-primary btn-block px-3" style={{ paddingTop: 10 + 'px' }}>Войти</button>
										<input name="login" type="hidden" id="login" value="submit" />
										<a className="btn btn-primary btn-block px-3 mt-2" href="/register">Создать аккаунт</a>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="footer f90 mt-auto" style={{margin: '0 auto'}}>
					<div className="container py-3 text-muted">
						<div className="row" style={{width: '150px', margin: '0 auto', display: 'block'}}>
							<div className="col-12 col-md-2" style={{maxWidth: '100%'}}>
								<div className="d-flex align-items-center h-100">
									<div className="ttle">© <span style={{fontWeight: 400}} /> 2023-{new Date(new Date()).getFullYear()}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}
}

function logOut(e) {
	e.preventDefault()
	window.localStorage.removeItem('user_id')
	window.location.reload()
}

function login(e) {
	e.preventDefault()
	let data = new FormData(e.target),
		pass = data.get('password'),
		json = JSON.stringify({username: data.get('username')}),
		res = getLogin(json)
	if (res.message === `It's ok`) {
		if (res.user.password === md5(md5(md5(md5(pass))))) {
			window.localStorage.setItem('uid', res.user.id)
			window.location.reload()
		} else
			document.querySelector('.response').innerHTML = '<b>Password</b>: Password not equals'
	} else {
		if (res.errs !== void 0) document.querySelector('.response').innerHTML = '<b>' + res.errs[0].param + '</b>: ' + res.errs[0].msg
		else document.querySelector('.response').innerHTML = '<b>' + res.message + '</b>'
	}
}
