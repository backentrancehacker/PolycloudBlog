const app = require('express')()
const catchPromise = require('@adcharity/catch-promise')
const utils = require('./utils')

catchPromise.define(utils.log)
catchPromise.init()

require('./routes')(app)
utils.log('Routes Initialized')

app.listen(8080)
utils.log('Server Initialized')