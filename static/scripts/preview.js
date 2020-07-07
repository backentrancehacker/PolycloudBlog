const months = ['Jan', 'Feb', 'Mar', "Apr", 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weekdays = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']

const time = () => {
	let today = new Date()
	
	let day = weekdays[today.getDay()],
		month = weekdays[today.getMonth()],
		year = today.getFullYear()

	return `${day} ${month} ${today.getDate()} ${year}`
}

const main = document.querySelector('main')

const div = document.createElement('div')
div.className = 'card'

const h1 = document.createElement('h1')
h1.textContent = window.localStorage.getItem('title') || 'Title'

const meta = document.createElement('p')
meta.textContent = `${time()} by Author`

let md = markdownit()
const p = document.createElement('div')
p.innerHTML = md.render(window.localStorage.getItem('text') || 'Powered by Markdown it')

main.appendChild(div)
div.appendChild(h1)
div.appendChild(meta)
div.appendChild(p)