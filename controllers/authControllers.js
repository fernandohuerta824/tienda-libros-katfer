import User from "../models/User.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

export function getLogin(req, res) {
    res.render("auth/index", {
        pageTitle: "Login",
        error: null,
        identifier: ''
    })
}

export async function postLogin(req, res) {
    try {

        if(req.session.isLoggedIn) return res.redirect('/');

        const { identifier } = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.render('auth/index', {
                pageTitle: "Login",
                error: errors.array()[0].msg,
                identifier,
            })
        }

        req.session.isLoggedIn = true;

        await req.session.save(() => {
            res.redirect('/');
        })
    } catch (error) {

    }
}

export async function getSignup(req, res) {
    res.render('auth/signup', {
        pageTitle: "Signup",
        error: null,
    })
}

export async function registerUser(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const { firstname, lastname, username,  password, email, address } = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password,12 );

        const newUser = new User({
            firstname, lastname, username, email, password: hashedPassword, address
        });
        req.session.user = newUser;
        req.session.isLoggedIn = true;
        await newUser.save();
        res.redirect('/');
    } catch(err){
        res.status(500).send('Server Error');
    }
}