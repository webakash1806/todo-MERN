import User from "../model/auth.model.js"
import AppError from "../utils/error.util.js"
import bcrypt from 'bcryptjs'

const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
}

const register = async (req, res, next) => {

    try {
        const { fullName, email, password, phoneNumber } = req.body

        if (!fullName || !email || !password) {
            return next(new AppError('All Fields are required', 400))
        }

        const uniqueEmail = await User.findOne({ email })
        if (uniqueEmail) {
            return next(new AppError('Email is already registered', 400))
        }

        const encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            email,
            password: encryptedPassword,
            phoneNumber
        })

        if (!user) {
            return next(new AppError('Registration Failed!', 400))
        }

        const token = await user.generateJWTToken()
        res.cookie('token', token, cookieOption)

        await user.save()
        user.password = undefined
        user.confirmPassword = undefined
        res.status(201).json({
            success: true,
            message: 'Registered Successfully',
            user
        })
    }

    catch (err) {
        return next(new AppError(err.message, 500))
    }

}


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(new AppError('Email and Password is required', 400))
        }

        console.log(1)

        const user = await User.findOne({
            email
        }).select('+password')

        if (!user) {
            return next(new AppError('Email is not registered', 401))
        }

        console.log(2)


        const passwordCheck = await user.comparePassword(password)
        if (!passwordCheck) {
            return next(new AppError('Password is wrong', 400))
        }

        console.log(3)

        const token = await user.generateJWTToken()
        res.cookie('token', token, cookieOption)

        console.log(1)


        res.status(200).json({
            success: true,
            message: 'Login Successfull!',
            user
        })

    }
    catch (err) {
        return next(new AppError(err.message, 500))
    }

}


const logout = (req, res, next) => {
    const token = ""
    const cookiesOption = {
        logoutAt: new Date(), httpOnly: true, secure: true,
        sameSite: 'None',
    }

    try {
        res.cookie("token", token, cookiesOption)
        res.status(200).json({ success: true, message: "Logged out" })
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
}


const profile = async (req, res, next) => {
    try {
        console.log(1)
        const userId = req.user.id

        const user = await User.findById(userId)

        res.status(200).json({
            success: true,
            message: "",
            user
        })
    }
    catch (err) {
        return next(new AppError("Failed to fetch" + err.message, 500))
    }
}


const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body
        const { id } = req.user

        if (!oldPassword || !newPassword) {
            return next(new AppError('All fields are required', 400))
        }

        if (oldPassword === newPassword) {
            return next(new AppError('New password is same as old password', 400))
        }

        const user = await User.findById(id).select('+password')

        if (!user) {
            return next(new AppError('User does not exist', 400))
        }

        const passwordValid = await user.comparePassword(oldPassword)

        if (!passwordValid) {
            return next(new AppError('Old Password is wrong', 400))
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        user.password = undefined

        res.status(200).json({
            status: true,
            message: 'Password Changed successfully'
        })
    }
    catch (e) {
        return next(new AppError(e.message, 500))
    }

}


export {
    register,
    login,
    logout,
    profile,
    changePassword,
}