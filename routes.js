const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
var md = require('markdown-it')()
// var result = md.render('# markdown-it rulezz!');

const firestore = require('./firestore/db')
const utils = require('./utils')

const users = utils.passwords()
const denied = '?error=denied'

const server = app => {
	app.engine('html', require('ejs').renderFile)
	   .set('views', path.join(__dirname, '/templates'))
	   .set('view engine', 'html')

	app.use(express.json())
	   .use(express.urlencoded({ extended: true }))
	   .use(express.static('static'))
	   .use(cookieParser())

	app.get('/', async (req, res) => {
		let articles = await firestore.fetch(firestore.articles, {
			method: 'GET'
		})
		res.render('index', {articles})
	})
	app.get('/login', (req, res) => {
		const {error} = req.query
		error == 'denied' ? res.render('login', {error}) : res.render('login')
	})
	app.get('/posts/:id', async (req, res) => {
		const {id} = req.params
		if(!id) res.status(404).render('error', {error: 404})
		let article = await firestore.fetch(firestore.articles, {
			method: 'GET',
			id: id.split('-').map(val => utils.cap(val)).join(' ')
		})
		if(!article) res.status(404).render('error', {error: 404})
		else {
			let {content, author, meta} = article.data
			content = md.render(content)
			res.render('page', {content, author, meta, id: article.id})
		}
	})
	app.get('/dash', async (req, res) => {
		let user = (req.cookies['user'] || '').toString().split('|')
		if(user.length !== 2) return res.redirect(`/login${denied}`)

		let [username, password] = user
		
		if(users.hasOwnProperty(username) && users[username] == password) {
			let articles = await firestore.fetch(firestore.articles, {
				method: 'GET'
			})
			res.render('dash', {username, articles})
		}
		else res.redirect(`/login${denied}`)	
	})
	app.get('/logout', (req, res) => {
		res.clearCookie('user')
		res.redirect('/')
	})
	app.get('/preview', (req, res) => {
		res.render('preview')
	})

	app.post('/dash', async (req, res) => {
		let user = (req.cookies['user'] || '').toString().split('|')
		if(user.length !== 2) return res.redirect(`/login${denied}`)

		let [username, password] = user
		
		if(users.hasOwnProperty(username) && users[username] == password) {
			const {title, content} = req.body
			await firestore.fetch(firestore.articles, {
				method: 'SET',
				id: title.split(' ').map(val => utils.cap(val)).join(' '),
				data: {
					content: content,
					meta: utils.stamp(),
					author: username
				}
			})
			res.redirect('/dash')
		}
		else {
			res.redirect(`/login${denied}`)
		}
	})
	app.post('/login', (req, res) => {
		const {username, password} = req.body
		if(users.hasOwnProperty(username) && users[username] == password) {
			res.cookie("user", `${username}|${password}`, {overwrite: true})
			res.redirect('/dash')
		}
		else res.redirect(`/login${denied}`)
	})

	app.use((req, res) => {	
		res.status(404).render('error', {error: 404})
	})
	app.use((err, req, res, next) => {
		utils.log(err)
		res.status(500).render('error', {error: 500})
	})
}

module.exports = server