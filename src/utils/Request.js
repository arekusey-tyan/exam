export function getLogin(body) {
	let xhr = new XMLHttpRequest()
	xhr.open('POST', `/api/login`, false)
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
	xhr.send(body)
	return JSON.parse(xhr.response)
}
export function regUser(body) {
	let xhr = new XMLHttpRequest()
	xhr.open('POST', `/api/reg`, false)
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
	xhr.send(body)
	return JSON.parse(xhr.response)
}
export let timer
export function saveResult(time) {
	let xhr = new XMLHttpRequest()
	xhr.open('POST', `/api/result`, false)
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
	xhr.send(JSON.stringify({time: time + 's', id: window.localStorage.getItem('uid')}))
}
export function setTimer() {
	timer = Date.now()
}
export function getTime() {
	let xhr = new XMLHttpRequest()
	xhr.open('POST', `/api/time/${window.localStorage.getItem('uid')}`, false)
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
	xhr.send()
	return JSON.parse(xhr.response)
}