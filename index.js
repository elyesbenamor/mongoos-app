const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('connect to mongodb'))