import User from "../models/User.js";
import { validationResult } from "express-validator";

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
        console.log('errors:', errors)
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