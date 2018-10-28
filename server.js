const express = require('express')
const app = express()
const port = process.env.PORT || 80

app.use(express.static('resources'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/resources/pl-program-converter.html')
})

app.listen(port)