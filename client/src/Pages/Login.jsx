import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { loginAccount } from '../Redux/Slices/authSlice';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';

const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    function handleUserInput(e) {
        const { name, value } = e.target
        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    async function login(e) {
        e.preventDefault()
        const { email, password } = loginData
        if (!email || !password) {
            return toast.error('Please fill all the fields!')
        }


        if (!email.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
            return toast.error('Email is Invalid!')
        }

        if (password.length < 8) {
            return toast.error('Password must contain Minimum eight characters!')
        }

        const response = await dispatch(loginAccount(loginData))
        console.log(response)

        if (response?.payload?.success) {
            navigate("/");
        }


        setLoginData({
            email: "",
            password: ""
        })

    }

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className="relative py-4 max-w-xs sm:min-w-[22rem]">
                <form onSubmit={login} action='' noValidate
                    className="min-h-96 px-6 sm:px-8 py-8 mt-4 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg"
                >
                    <div className="flex flex-col justify-center items-center h-full select-none">
                        <div className="flex flex-col items-center justify-center gap-2 mb-8">
                            <FaUser className='text-[2rem] text-white' />
                            <p className="m-0 text-[16px] font-semibold dark:text-white">
                                Login to your Account
                            </p>
                            <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]"
                            >Get started with our app.
                            </span>
                        </div>
                        <div className="w-full flex flex-col gap-[0.35rem]">
                            <label className="font-semibold text-xs text-gray-400">Email</label>
                            <input
                                name='email'
                                type='email'
                                onChange={handleUserInput}
                                value={loginData.email}
                                placeholder="Email"
                                className="border text-white rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-[0.35rem]">
                        <label className="font-semibold text-xs text-gray-400">Password</label>
                        <input
                            onChange={handleUserInput}
                            value={loginData.password}
                            placeholder="••••••••"
                            className="border text-white rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                            type="password"
                            name='password'
                        />
                    </div>
                    <button type='submit'
                        className="py-1 px-8 bg-[#4F46E5] hover:bg-blue-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-md cursor-pointer select-none"
                    >
                        Login
                    </button>
                    <p className='text-gray-400 text-center pt-3'>Don&apos;t have an account? <Link to={'/register'} className='text-blue-300'>Register</Link> </p>
                </form>
            </div>
        </div>

    )
}

export default Login
