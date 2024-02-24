const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const http = require('http')
const connectDB = require('./config/Database')

connectDB.dbconnect()
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','POST','PUT','PATCH'],
    credentials:true
}));

const userRoutes = require('./routes/userRoutes')
app.use('/', userRoutes)
const adminRoutes = require('./routes/adminRoutes')
app.use('/admin', adminRoutes)

const server = http.createServer(app)
server.listen(3004,()=>{console.log('app is running on 3004 works successfullyyy')})