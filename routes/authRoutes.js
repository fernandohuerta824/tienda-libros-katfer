import { Router } from "express";
import {getLogin, getSignup, postLogin} from "../controllers/authControllers.js";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = Router();

router.get('/', getLogin)
router.post('/', [
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({
            min: 8,
            max: 40,
        })
        .withMessage('Password must be between 8 and 40 characters'),
    body("identifier")
        .trim()
        .notEmpty()
        .withMessage("Please enter your email or username")
        .bail()
        .isLength({
            min: 5,
            max: 50,
        })
        .withMessage("The email or user name must be between 6 to 50 characters in length")
        .bail()
        .custom(async (identifier, { req }) => {
            const user = await User.findOne({ $and: [
                    {email: identifier},
                    {username: identifier},
                ]
            })
            if(!user)
                throw new Error("Invalid email/username or password");
            const password = req.body.password;
            if(! await bcrypt.compare(password, user.password))
                throw new Error("Invalid email/username or password");
            req.session.user = user;
            return true
        })
], postLogin)

router.get('/signup', getSignup)
export default router;