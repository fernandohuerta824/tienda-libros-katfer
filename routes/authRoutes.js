import {Router} from "express";
import {getLogin, getSignup, postLogin, registerUser} from "../controllers/authControllers.js";
import {body} from "express-validator";
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
        .custom(async (identifier, {req}) => {
            console.log(identifier)
            const user = await User.findOne({
                $or: [
                    {email: identifier},
                    {username: identifier},
                ]
            })
            console.log(user)
            if (!user)
                throw new Error("Invalid email/username or password");
            const password = req.body.password;
            console.log(password, user.password)
            if(!(await bcrypt.compare(password, user.password)))
                throw new Error("Invalid email/username or password");
            req.session.user = user;
            return true
        })
], postLogin)

router.get('/signup', getSignup)
router.post('/signup', [
    body('firstname')
        .trim()
        .notEmpty()
        .withMessage('Firstname is required')
        .isLength({
            min: 8,
            max:20
        })
        .withMessage('Firstname must be between 8 and 20 characters'),
    body('lastname')
        .trim()
        .notEmpty()
        .withMessage(' is required')
        .isLength({
            min: 8,
            max:20
        })
        .withMessage('Lastname must be between 8 and 20 characters'),
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({
            min: 5,
            max: 50
        })
        .withMessage('Username must be between 6 and 18 characters')
        .custom(async (username, { req }) => {
            const user = await User.findOne({ username });
            if (user){
                throw new Error('Username already in use');
            }
            return true;
        }),
    body("email")
        .isEmail()
        .withMessage('Fernando GAY')
        .custom(async (email,{req}) => {
            const user = await User.findOne({ email });
            if (user){
                throw new Error('Email already in use');
            }
            return true;
        }),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({
            min: 8,
            max: 40
        })
        .withMessage('Password must be between and 8 and 40 characters'),
    body('address.street')
        .trim()
        .notEmpty()
        .withMessage('Street address is required'),
    body('address.neighborhood')
        .trim()
        .notEmpty()
        .withMessage('Neighborhood is required'),
    body('address.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    body('address.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    body('address.zip')
        .trim()
        .notEmpty()
        .withMessage('Zip is required'),
], registerUser);
export default router;
/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠚⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠦⣀⠉⠙⢦⣄⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠖⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣆⠀⠈⠳⡀⠀⠈⠣⡀⠀⠀⠀⠀⠈⡇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⡶⣤⠜⠁⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡆⠀⠀⢻⣦⠀⠀⠙⢦⠀⠀⠀⠨⡇⠀⠀
⠀⠀⠀⠀⠀⠀⢠⠏⣠⠋⠀⠀⢠⠏⠁⠀⠀⠀⢠⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⣴⠚⢿⡷⠚⢹⠈⢇⠀⠀⣲⡇⠀⠀
⠀⠀⠀⠀⠀⠀⣾⣶⠃⠀⠀⢠⠇⠀⠀⠀⠀⢀⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢹⡀⠈⣷⡄⠸⡄⠈⡆⠀⢹⡇⠀⠀
⠀⠀⠀⠀⠀⠀⢀⡏⠀⠀⢀⡏⠀⠀⠀⠀⢀⡾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠀⢳⣤⡿⡷⠴⡇⠀⢸⡀⠘⣏⠀⠀
⠀⠀⠀⠀⠀⠀⡼⠀⠀⠀⡸⠀⠀⠀⠀⠀⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠈⣿⠀⢻⠀⢹⡀⠀⡇⢰⣿⠆⠀
⠀⠀⠀⠀⠀⢠⠃⠀⠀⢀⡇⠀⠀⠀⠀⠀⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⠀⠘⡆⠈⣇⠀⠇⢸⡧⠀⠀
⠀⠀⠀⠀⠀⡸⠀⡄⠀⢸⠀⠀⡼⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⣄⠀⢠⠀⠀⢠⠀⠀⠀⠀⠀⠸⡅⢸⣿⠀⠀⣧⠀⢿⠀⠘⢸⣿⠀⠀
⠀⠀⠀⠀⠀⡇⢰⠁⠀⣼⠀⣰⡇⠀⠀⡟⡇⠀⠀⠀⠀⠀⠀⢰⣿⠀⣼⠀⠀⡸⡆⠀⠀⠀⠀⠠⡇⢸⡟⠀⠀⢸⠀⠸⠀⠀⢸⡟⠀⠀
⠀⠀⠀⠀⢸⠀⢸⡆⠀⣿⢀⣿⣧⠀⢸⠁⢠⠀⠀⠀⠀⠀⠀⢸⣶⠀⣿⡀⠀⡇⠹⡄⠀⠀⠀⢠⠇⢸⡇⠀⠀⢸⠀⠀⠀⠀⢸⣇⠀⠀
⠀⠀⠀⠀⡜⠀⢸⣇⠀⣧⢸⡧⢼⣄⣜⡀⢸⡀⠀⠀⠀⠀⠀⢸⣍⠀⡇⢧⠀⢻⠀⠱⡀⠀⠀⢸⠀⢸⠃⠀⠀⣸⠀⠀⠀⠀⣸⣿⠀⠀
⠀⠀⠀⢀⠇⠀⠀⣿⡆⣿⣾⠁⠀⢳⡍⠈⠉⢯⠹⣧⡀⠀⠀⠈⣿⡀⡷⠼⣦⢼⣧⣄⡹⣄⠀⣿⠀⣿⠀⠀⠀⡧⠀⠀⠀⠀⢸⣯⠀⠀
⠀⠀⠀⢸⡇⠀⠀⢹⡿⢸⡇⢰⣶⣶⣿⣤⣄⡸⢷⣇⠙⢦⣀⠀⢹⣧⣇⠀⠘⢦⣏⠻⣭⡙⠺⣿⢸⡇⠀⠀⠀⡇⠀⠀⠀⠀⢸⣿⠀⠀
⠀⠀⠀⣿⣧⠀⠀⠀⢻⣈⣷⠸⡏⠉⣾⣿⣿⣿⣷⠉⠀⠀⠈⠉⠒⠛⠛⣫⣯⣟⣛⣆⠈⠻⣄⡜⢸⠀⠀⠀⢰⡇⠀⠀⡇⠀⢸⣿⠀⠀
⠀⠀⠀⣿⡟⣆⠀⠀⠀⠙⣿⡄⠀⠀⠘⠻⠿⠿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠛⣿⣽⣿⣿⣿⣶⣿⡇⡇⠀⠀⠀⠘⢿⠀⠀⡇⠀⢸⣿⣤⣤
⠀⠀⠀⡟⢿⡏⢧⡀⠀⠀⠈⠳⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠯⠝⠿⠋⢹⡾⠀⠀⠀⠀⢸⣸⠁⣾⠀⠀⢸⣯⠿⢿
⠀⠀⠀⣧⠀⠙⠚⠻⠦⣄⡀⠀⠀⠙⢦⡀⠀⠀⠀⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡇⠀⠀⠀⠀⣿⠏⠀⢹⠀⠀⢸⡗⠀⠀
⠀⠀⠀⠘⣦⡀⠀⠀⠀⣀⣈⣙⣢⣄⠀⠉⠢⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡟⠀⠀⠀⠀⡄⣿⠀⠀⡼⠀⠀⢸⣟⠀⠀
⠀⠀⠀⠀⢿⡿⢶⣶⣾⣿⣿⣿⣿⣿⣷⣦⣀⠈⠳⣄⠠⠤⢤⣀⡀⠀⠀⠀⠀⠀⠀⢀⣤⣿⠁⠀⢀⠄⢰⡀⣷⠀⠀⣷⠀⠀⢸⣿⠀⠀
⠀⠀⠀⠀⢸⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠈⠳⣄⠀⠀⠀⠀⠀⣀⣤⢴⣾⠋⣸⠃⢠⢠⠇⠀⢸⡇⣇⠀⠀⡏⠀⠀⢸⣿⠀⠀
⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿dd⣿⣦⡀⠈⢷⡖⠒⠋⠉⠁⣠⣟⣽⢀⡏⢠⠏⠘⠀⠀⣼⣧⡇⠀⠠⡇⠀⠀⢸⣿⠀⠀
⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⢷⣄⠀⢳⡁⠀⢀⡾⢿⣿⣿⡿⠀⡟⠀⠀⠀⠀⣿⢿⣇⠀⠐⡇⠀⠀⢸⡟⠀⠀
⠀⠀⠰⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⡄⠻⣆⠀⢻⡄⠞⠀⠈⣿⣿⡇⢸⠇⠀⠀⠀⠀⣿⢸⣏⠀⢸⡇⠀⠀⢸⣏⠀⠀
⢀⡀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢸⡄⠹⣧⡈⣿⡄⠂⠀⢹⣿⠃⣾⡆⠀⠀⠀⢰⣿⢸⠹⡇⢸⠇⠀⠀⣸⣿⠀⠀
*/