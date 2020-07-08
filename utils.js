const time = () => {
	let today = new Date(),
		date = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0'),
		_time = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0')
	return `${date} ${_time}`
}
function log() {
	let fullList = `${time()} |`
	for(let argument of arguments) fullList += ` ${argument}`
	fullList += '\n'
	console.log(fullList)
}
const stamp = () => {
	const months = ['Jan', 'Feb', 'Mar', "Apr", 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const weekdays = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
	let today = new Date()
	
	let day = weekdays[today.getDay()],
		month = weekdays[today.getMonth()],
		year = today.getFullYear()

	return `${day} ${month} ${today.getDate()} ${year}`
}
const cap = str => str.trim().charAt(0).toUpperCase() + str.slice(1)

const passwords = () => {
	let _passwords = process.env.passwords.toString().split('|')
	let tree = {}
	for(let user of _passwords) {
		let parts = user.split('=')
		tree[parts[0]] = parts[1]
	}
	return tree
}

const users = passwords()

const validate = (username, password) => users.hasOwnProperty(username) && users[username] == password
const credentials = req => {
	let user = (req.cookies['user'] || '').toString().split('|')
	let [username, password] = user
	if(user.length !== 2) {
		return 'denied'
	}
	else if(validate(username, password)) {
		return {
			username,
			password
		}
	}
	else {
		return 'denied'
	}
}

module.exports = {
	log,
	cap,
	time,
	stamp,
	validate,
	passwords,
	credentials
}
