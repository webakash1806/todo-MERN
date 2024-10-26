import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
    fullName: {
        type: 'String',
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: 'String',
        required: [true, 'Email is required'],
        unique: true
    },
    phoneNumber: {
        type: Number,
    },
    password: {
        type: 'String',
        required: [true, 'Password is required']
    }
},
    {
        timestamps: true
    })

userSchema.methods = {
    generateJWTToken: async function () {
        return await jwt.sign(
            { id: this._id, email: this.email },
            process.env.SECRET,
            {
                expiresIn: "7d",
            }
        );
    },
    comparePassword: async function (plaintextPassword) {
        return await bcrypt.compare(plaintextPassword, this.password);
    },
};

const User = model('User', userSchema)

export default User