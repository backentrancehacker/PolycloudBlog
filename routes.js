const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const md = require('markdown-it')()

const firestore = require('./firestore/db')
const utils = require('./utils')

const denied = '?error=denied'

const server = app => {
	app.engine('html', require('ejs').renderFile)
	   .set('views', path.join(__dirname, '/templates'))
	   .set('view engine', 'html')

	app.use(express.json())
	   .use(express.urlencoded({ extended: true }))
	   .use(express.static('static'))
	   .use(cookieParser())
	   
	app.all('/keep', (req, res) => {
		res.send('Kept Alive')
	})
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
			id
		})
		if(!article) res.status(404).render('error', {error: 404})
		else {
			let toRender = article.data
			let cache = toRender.content

			let user = utils.credentials(req)
			if(user !== 'denied') user = user.username == toRender.author ? cache : 'denied'

			Object.assign(toRender, {
				content: md.render(cache),
				id: article.id,
				user
			})
			res.render('page', toRender)
		}
	})
	app.get('/dash', async (req, res) => {
		let user = utils.credentials(req)
		if(user == 'denied') {
			res.redirect(`/login${denied}`)	
		}
		else {
			let articles = await firestore.fetch(firestore.articles, {method: 'GET'})
			res.render('dash', {username: user.username, articles})
		}
			
	})
	app.get('/logout', (req, res) => {
		res.clearCookie('user')
		res.redirect('/')
	})
	app.get('/preview', (req, res) => {
		res.render('preview')
	})

	app.post('/dash', async (req, res) => {
		let user = utils.credentials(req)
		if(user == 'denied') {
			res.redirect(`/login${denied}`)
		}
		else {
			const {title, content} = req.body
			await firestore.fetch(firestore.articles, {
				method: 'POST',
				data: {
					title: title.split(' ').map(val => utils.cap(val)).join(' '),
					content,
					meta: utils.stamp(),
					author: user.username
				}
			})
			res.redirect('/dash')
		}		
	})
	app.post('/post', async (req, res) => {
		let user = utils.credentials(req)
		if(user == 'denied') return res.redirect(`/login${denied}`)	
		if(req.body.hasOwnProperty('remove')) {
			await firestore.fetch(firestore.articles, {
				method: 'REMOVE',
				id: req.body.id
			})
			res.send('/')
		}
		else {
			const {id, title, content} = req.body
			try {
				await firestore.fetch(firestore.articles, {
					method: 'UPDATE',
					id,
					data: {
						title: title.split(' ').map(val => utils.cap(val)).join(' '), 
						content,
						meta: utils.stamp()
					}
				})
				res.redirect(`/posts/${id}`)
			}
			catch(e) {
				res.redirect(`/login${denied}`)	
			}
		}
	})
	app.post('/login', (req, res) => {
		const {username, password} = req.body
		if(utils.validate(username, password)) {
			res.cookie("user", `${username}|${password}`, {overwrite: true})
			res.redirect('/dash')
		}
		else {
			res.redirect(`/login${denied}`)
		}
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