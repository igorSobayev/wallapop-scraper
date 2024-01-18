import express from 'express'
import cors from 'cors'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv'

import * as DB from './app/config/db.config.js'

import routes from './app/routes/index.js'

dotenv.config()

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use(
  cookieSession({
    name: "token",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
)

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to igor's application." })
})

// routes
await routes(app)

await DB.init()

// set port, listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
