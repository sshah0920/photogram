
const express = require('express')
const PORT = 5000
const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')
require ("dotenv").config();


mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.connection.on('connected', () => {
    console.log("Connected to MONGO")
})

mongoose.connection.on('error', (err) => {
    console.log("Not Connected", err)
})

require('./models/user')
require('./models/posts')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json())
app.use(require('./route/auth'))
app.use(require('./route/posts'))

if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


app.listen(process.env.PORT || PORT, ()=> {
    console.log("Server is running on PORT:", PORT)
}) 