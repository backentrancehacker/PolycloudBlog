const admin = require('firebase-admin')
const credentials = require('./credentials')

admin.initializeApp({
	credential: admin.credential.cert(credentials),
	databaseURL: "https://polycloudblog.firebaseio.com"
})

const db = admin.firestore()
const users = db.collection('users')
const articles = db.collection('articles')

const fetch = async (collection, {method, id, data, settings, query}) => {
	if(!collection) throw new Error('Cannot fetch "undefined" collection.')
	switch(method) {
		case 'REMOVE': {
			if(!id) throw new Error('Cannot remove "undefined" id.')
			await collection.doc(id).delete()
		}
		case 'QUERY': {
			if(!query) {
				const res = await fetch(collection, {
					method: 'GET'
				})
				return res
			}
			else {
				let processed = query.split(' ').map(val => val.trim())
				if(processed.length !== 3) throw new Error('Cannot query, invalid parameters.')
				const ref = await collection.where.apply(null, processed)
				const snapshot = ref.get()
				let fetched = []
				if(snapshot.empty) return false
				else {
					snapshot.forEach(doc => {
						fetched.push({
							id: doc.id,
							data: doc.data()
						})
					})
					return fetched
				}
			}
		}
		case 'SET': {
			if(!id) throw new Error('Cannot set "undefined" id.')
			const res = await collection.doc(id).set(data, settings || {})
			return res
		}
		case 'GET': {
			if(id) {
				const doc = await collection.doc(id).get()
				return !doc.exists ? false : {id, data: doc.data()}
			}
			else {
				const snapshot = await collection.get()
				let fetched = []
				snapshot.forEach(doc => {
					fetched.push({
						id: doc.id,
						data: doc.data()
					})
				})
				return fetched	
			}
		}
		default: {
			throw new Error('Cannot fetch with "undefined" method.')
		}
	}
}

module.exports = {
	db,
	fetch,
	users,
	articles
}