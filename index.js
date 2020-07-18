// just saying, couldn't you use Knex for this with the data-
// base folder that is in polycloud on github than firebase?
// Lethdev2019

// I have to learn SQL but you could definitely use these styles and html if you want
// AdCharity

// something is not in your ideas - live markdown preview in <object data='url'></object>
// Lethdev2019

const app = require('express')()
const catchPromise = require('@adcharity/catch-promise')
const utils = require('./utils')

catchPromise.define(utils.log)
catchPromise.init()

require('./routes')(app)
utils.log('Routes Initialized')

app.listen(8080)
utils.log('Server Initialized')