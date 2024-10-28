import AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
    const { token } = await req.cookies
    console.log(1)
    console.log(token)

    if (!token) {
        return next(new AppError('Unauthenticated! Please Login again', 401))
    }

    console.log(2)

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET)

    req.user = userDetails;

    next()
}

const loginAuth = async (req, res, next) => {
    const { token } = await req.cookies

    if (token) {
        return next(new AppError('Already Logged in! Please Logout First', 404))
    }

    next()
}


export {
    isLoggedIn,
    loginAuth
}