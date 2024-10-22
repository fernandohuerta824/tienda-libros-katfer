import express from  'express'
import path from 'path'
import mongoose from 'mongoose'
import authRoutes from "./routes/authRoutes.js";
import MongoStore   from "connect-mongo";
import User from "./models/User.js";
import session from "express-session";
import shopRoutes from "./routes/shopRoutes.js";
import bcrypt from "bcryptjs";

const uri = "mongodb+srv://nodejsmax:cr7eselmejorjugador@cluster0.njj8za8.mongodb.net/Katfer?retryWrites=true&w=majority&appName=Cluster0";

const app = express()

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(session({
    secret: 'cr7eselmejorjugador',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 1000,
        httpOnly: true,
    },
    store: MongoStore.create({
        mongoUrl: uri,
        collection: 'sessions',
        stringify: false
    })
}))
app.use(async (req, res, next) => {
    try {

        if(!req.session.user) return next();
        const user = await User.findById(req.session.user._id);

        if(!user) return next();

        req.session.user = user;

        next();
    } catch(error) {
        console.log(error);
    }

})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(process.cwd(), 'public')))
app.use(shopRoutes)
app.use('/auth', authRoutes)


mongoose.connect(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    },
    dbName: 'Katfer',
    minPoolSize: 1,
    maxPoolSize: 10
})
    .then(() => {

        console.log('Connected to Katfer')
        app.listen(port, () => console.log(`Listening on ${port}`))
    })
    .catch(err => console.log(err))
