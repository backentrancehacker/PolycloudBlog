const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')

const firestore = require('./firestore/db')

const server = app => {
	app.engine('html', require('ejs').renderFile)
	   .set('views', path.join(__dirname, '/templates'))
	   .set('view engine', 'html')

	app.use(express.json())
	   .use(express.urlencoded({ extended: true }))
	   .use(express.static('static'))
	   .use(cookieParser())

	app.get('/', (req, res) => {
		res.render('index')
	})

	app.use((req, res) => {	
		res.status(404).render('error', {
			error: 404
		})
	})
	app.use((err, req, res, next) => {
		res.status(500).render('error', {
			error: 500
		})
	})
}

module.exports = server