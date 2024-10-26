import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout, userProfile } from '../Redux/Slices/authSlice';
import { FaUser } from 'react-icons/fa'
import { IoIosAddCircleOutline, IoIosCheckmarkCircle } from "react-icons/io";
import { toast } from 'sonner';
import { addTask, deleteTask, getAllTask, updateTask } from '../Redux/Slices/taskSlice';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { HiOutlineLogout } from "react-icons/hi";
import { FaXmark } from "react-icons/fa6";
const Home = () => {

    const dispatch = useDispatch()
    const [addFormActive, setAddFormActive] = useState(false)
    const [updateFormActive, setUpdateFormActive] = useState(false)

    const userData = useSelector((state) => state?.auth?.data)
    const taskData = useSelector((state) => state?.task?.taskData)

    console.log(taskData)

    const loadTaskData = async () => {
        await dispatch(getAllTask())
    }

    const loadUserData = async () => {
        await dispatch(userProfile())
    }

    const [addTaskData, setAddTaskData] = useState({
        task: "",
        deadline: ""
    })

    function handleTaskInput(e) {
        const { name, value } = e.target
        setAddTaskData({
            ...addTaskData,
            [name]: value
        })
    }

    async function handleAddTask(e) {
        e.preventDefault()

        const { task, deadline } = addTaskData

        if (!task) {
            return toast.error("Please enter task!")
        }

        if (!deadline) {
            return toast.error("Please enter deadline!")
        }

        const response = await dispatch(addTask(addTaskData))

        if (response?.payload?.success) {
            loadTaskData()
            setAddFormActive(false)
            setAddTaskData({
                task: "",
                deadline: ""
            })
        }
    }

    const [updateTaskData, setUpdateTaskData] = useState({
        task: "",
        deadline: "",
        id: ""
    })

    function handleUpdateTaskInput(e) {
        const { name, value } = e.target
        setUpdateTaskData({
            ...updateTaskData,
            [name]: value
        })
    }

    async function handleUpdateTask(e) {
        e.preventDefault()

        const { task, deadline } = updateTaskData

        if (!task) {
            return toast.error("Please enter task!")
        }

        if (!deadline) {
            return toast.error("Please enter deadline!")
        }

        const response = await dispatch(updateTask(updateTaskData))

        if (response?.payload?.success) {
            loadTaskData()
            setUpdateFormActive(false)
        }
    }

    const handleDelete = async (id) => {
        const res = await dispatch(deleteTask(id))

        if (res?.payload?.success) {
            loadTaskData()
        }
    }

    const dateInputRef = useRef(null);

    const handleClick = () => {
        // Programmatically focus the input to open the date picker
        if (dateInputRef.current) {
            dateInputRef.current.showPicker(); // Modern browsers support .showPicker()
        }
    };

    const handleToggleComplete = async (id) => {
        const status = "COMPLETED"
        const res = await dispatch(updateTask({ id: id, status: status }))

        if (res?.payload?.success) {
            loadTaskData()
        }
    }

    console.log(updateTaskData.deadline)

    useEffect(() => {
        loadUserData()
        loadTaskData()
    }, [])

    return (
        <div>
            <header className='flex sticky top-2 z-10 text-white items-center m-2 rounded-md shadow-[0px_0px_14px_-2px_#4F46E5] justify-between backdrop-blur-lg bg-[#111827] px-6 p-[0.6rem]'>
                <h2>{userData?.fullName}</h2>
                <div className='flex items-center gap-3'>
                    <div className='border p-[0.6rem] rounded-full border-gray-400'>
                        <FaUser />

                    </div>
                    <div onClick={() => dispatch(logout())} className=' p-[0.55rem] rounded-md bg-[#ff1919c6] text-white'>
                        <HiOutlineLogout />
                    </div>
                </div>
            </header>
            <div onClick={() => setAddFormActive(true)} className='fixed bottom-4 flex items-center justify-center gap-1 cursor-pointer bg-[#4F46E5] text-white px-4 p-2 rounded-md right-4'>
                <IoIosAddCircleOutline className='text-[1.4rem]' />
                <span className='font-semibold'>
                    Add task
                </span>
            </div>
            {addFormActive && <div className='flex  justify-center fixed items-center w-full  h-full bg-[#80808016] backdrop-blur-sm'>
                <div className="relative py-4  max-w-xs sm:min-w-[22rem]">

                    <div onClick={() => setAddFormActive(false)} className=' rounded-tr-lg p-[0.55rem] absolute right-0 rounded-md bg-[#ff1919c6] text-white'>
                        <FaXmark />
                    </div>
                    <form action='' onSubmit={handleAddTask} noValidate
                        className=" px-6 sm:px-8 py-8 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg"
                    >

                        <div className="flex flex-col justify-center items-center h-full select-none">
                            <div className="flex flex-col items-center justify-center gap-2 mb-6">
                                <p className="m-0 text-[16px] font-semibold dark:text-white">
                                    Add your task
                                </p>
                                <span className="m-0 text-xs max-w-[100%] text-center text-[#8B8E98]"
                                >Get started with our app.
                                </span>
                            </div>
                            <div className="w-full flex flex-col gap-[0.35rem]">
                                <label className="font-semibold text-xs text-gray-400">Task</label>
                                <textarea
                                    name='task'
                                    type='task'
                                    onChange={handleTaskInput}
                                    value={addTaskData.task}
                                    placeholder="Enter task"
                                    className="border h-40 resize-none text-white rounded-lg px-3 py-2 mb-4 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-[0.35rem]">
                            <label className="font-semibold text-xs text-gray-400">Deadline</label>
                            <input
                                ref={dateInputRef}
                                name="deadline"
                                onClick={handleClick}
                                onChange={handleTaskInput}
                                value={addTaskData.deadline}
                                className="border text-white rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                                type="date"
                            />
                        </div>

                        <button type='submit'
                            className="py-1 px-8 bg-[#4F46E5] hover:bg-blue-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-md cursor-pointer select-none"
                        >
                            Add task
                        </button>
                    </form>
                </div>
            </div>}

            {updateFormActive && <div className='flex  justify-center fixed items-center w-full  h-full bg-[#80808016] backdrop-blur-sm'>
                <div className="relative py-4 max-w-[22.5rem] w-full  sm:min-w-[22rem]">
                    <div onClick={() => setUpdateFormActive(false)} className=' rounded-tr-lg p-[0.55rem] absolute right-0 rounded-md bg-[#ff1919c6] text-white'>
                        <FaXmark />
                    </div>
                    <form action='' onSubmit={handleUpdateTask} noValidate
                        className=" px-6  sm:px-8 py-8 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg"
                    >

                        <div className="flex flex-col justify-center items-center h-full select-none">
                            <div className="flex flex-col items-center justify-center gap-2 mb-6">
                                <p className="m-0 text-[16px] font-semibold dark:text-white">
                                    Add your task
                                </p>
                                <span className="m-0 text-xs max-w-[100%] text-center text-[#8B8E98]"
                                >Get started with our app.
                                </span>
                            </div>
                            <div className="w-full flex flex-col gap-[0.35rem]">
                                <label className="font-semibold text-xs text-gray-400">Task</label>
                                <textarea
                                    name='task'
                                    type='task'
                                    onChange={handleUpdateTaskInput}
                                    value={updateTaskData.task}
                                    placeholder="Enter task"
                                    className="border h-40 resize-none text-white rounded-lg px-3 py-2 mb-4 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-[0.35rem]">
                            <label className="font-semibold text-xs text-gray-400">Deadline</label>
                            <input
                                ref={dateInputRef}
                                name="deadline"
                                onClick={handleClick}
                                onChange={handleUpdateTaskInput}
                                value={updateTaskData.deadline}

                                className="border text-white rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                                type="date"
                            />
                        </div>

                        <button type='submit'
                            className="py-1 px-8 bg-[#4F46E5] hover:bg-blue-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-md cursor-pointer select-none"
                        >
                            Update task
                        </button>
                    </form>
                </div>
            </div>}

            <div className='pt-1 p-2 mb-16 grid grid-cols-1 xl:grid-cols-4 sm:grid-cols-2 gap-4'>
                <div className=' bg-[#111827] min-h-[87vh] flex flex-col gap-4 items-center justify-start text-white p-4 pt-2  rounded-xl'>
                    <h3 className='text-center font-semibold tracking-wide text-[1.6rem]'>Today</h3>

                    {taskData?.today?.map((data) => {
                        return (
                            <div key={data?._id} className='w-full  rounded-md overflow-hidden bg-[#7E30E1]'>
                                <div className='flex p-2 items-center justify-between'>
                                    <button onClick={() => handleDelete(data?._id)} className='bg-red-100 text-red-600 w-fit p-1 rounded text-[1.1rem]'>
                                        <MdDelete />
                                    </button>

                                    {data?.status !== "COMPLETED" &&
                                        <button onClick={() => {
                                            setUpdateFormActive(true)
                                            setUpdateTaskData({
                                                task: data?.task,
                                                deadline: new Date(data?.deadline).toISOString().split('T')[0],
                                                id: data?._id
                                            })
                                        }} className='bg-pink-100 text-red-500 w-fit p-1 rounded text-[1.1rem]'>
                                            <CiEdit />
                                        </button>}
                                    {data?.status !== 'COMPLETED' &&
                                        <button onClick={() => handleToggleComplete(data?._id)} className='bg-green-100 text-green-900 flex items-center gap-1 w-fit p-1 rounded text-[0.8rem] px-2 font-semibold'>
                                            <IoIosCheckmarkCircle /> <span>Mark as Done</span>
                                        </button>}
                                    {
                                        data?.status === 'COMPLETED' &&
                                        <button className='bg-green-100 text-green-900 flex items-center gap-1 w-fit p-1 rounded text-[0.8rem] px-2 font-semibold'>
                                            <IoIosCheckmarkCircle /> <span>Completed</span>
                                        </button>}
                                </div>
                                <div className={`p-2 text-[0.95rem] tracking-wide py-3 ${data?.status === "COMPLETED" && "bg-green-100 text-black"} ${data?.status === "PENDING" && "bg-[#F9E400] text-black"} ${data?.status === "EXPIRED" && "bg-[#ff5400] text-white"}`}>
                                    {data?.task}
                                </div>
                                <div className='p-1 text-center px-2 text-[0.9rem] bg-red-100 text-red-800 tracking-wide font-semibold'>
                                    Deadline : {data?.deadline.split('T')[0]}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className=' bg-[#111827] flex flex-col gap-4 items-center justify-start text-white p-4 pt-2  rounded-xl'>
                    <h3 className='text-center font-semibold tracking-wide text-[1.6rem]'>Tomorrow</h3>

                    {taskData?.tomorrow?.map((data) => {
                        return (
                            <div key={data?._id} className='w-full  rounded-md overflow-hidden bg-[#7E30E1]'>
                                <div className='flex p-2 items-center justify-between'>
                                    <button onClick={() => handleDelete(data?._id)} className='bg-red-100 text-red-600 w-fit p-1 rounded text-[1.1rem]'>
                                        <MdDelete />
                                    </button>

                                    {data?.status !== "COMPLETED" &&
                                        <button onClick={() => {
                                            setUpdateFormActive(true)
                                            setUpdateTaskData({
                                                task: data?.task,
                                                deadline: new Date(data?.deadline).toISOString().split('T')[0],
                                                id: data?._id
                                            })
                                        }} className='bg-pink-100 text-red-500 w-fit p-1 rounded text-[1.1rem]'>
                                            <CiEdit />
                                        </button>}
                                    {data?.status !== 'COMPLETED' &&
                                        <button onClick={() => handleToggleComplete(data?._id)} className='bg-green-100 text-green-900 flex items-center gap-1 w-fit p-1 rounded text-[0.8rem] px-2 font-semibold'>
                                            <IoIosCheckmarkCircle /> <span>Mark as Done</span>
                                        </button>}
                                    {
                                        data?.status === 'COMPLETED' &&
                                        <button className='bg-green-100 text-green-900 flex items-center gap-1 w-fit p-1 rounded text-[0.8rem] px-2 font-semibold'>
                                            <IoIosCheckmarkCircle /> <span>Completed</span>
                                        </button>}
                                </div>
                                <div className={`p-2 text-[0.95rem] tracking-wide py-3 ${data?.status === "COMPLETED" && "bg-green-100 text-black"} ${data?.status === "PENDING" && "bg-[#F9E400] text-black"} ${data?.status === "EXPIRED" && "bg-[#ff5400] text-white"}`}>
                                    {data?.task}
                                </div>
                                <div className='p-1 text-center px-2 text-[0.9rem] bg-red-100 text-red-800 tracking-wide font-semibold'>
                                    Deadline : {data?.deadline.split('T')[0]}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className=' bg-[#111827] flex flex-col gap-4 items-center justify-start text-white p-4 pt-2  rounded-xl'>
                    <h3 className='text-center font-semibold tracking-wide text-[1.6rem]'>Upcoming</h3>

                    {taskData?.upcoming?.map((data) => {
                        return (
                            <div key={data?._id} className='w-full  rounded-md overflow-hidden bg-[#7E30E1]'>
                                <div className='flex p-2 items-center justify-between'>
                                    <button onClick={() => handleDelete(data?._id)} className='bg-red-100 text-red-600 w-fit p-1 rounded text-[1.1rem]'>
                                        <MdDelete />
                                    </button>

                                    {data?.status !== "COMPLETED" &&
                                        <button onClick={() => {
                                            setUpdateFormActive(true)
                                            setUpdateTaskData({
                                                task: data?.task,
                                                deadline: new Date(data?.deadline).toISOString().split('T')[0],
                                                id: data?._id
                                            })
                                        }} className='bg-pink-100 text-red-500 w-fit p-1 rounded text-[1.1rem]'>
                                            <CiEdit />
                                        </button>}
                                    {data?.status !== 'COMPLETED' &&
                                        <button onClick={() => handleToggleComplete(data?._id)} className='bg-green-100 text-green-900 flex items-center gap-1 w-fit p-1 rounded text-[0.8rem] px-2 font-semibold'>
                                            <IoIosCheckmarkCircle /> <span>Mark as Done</span>
                                        </button>}
                                    {
                                        data?.status === 'COMPLETED' &&
                                        <button className='bg-green-100 text-green-900 flex items-center gap-1 w-fit p-1 rounded text-[0.8rem] px-2 font-semibold'>
                                            <IoIosCheckmarkCircle /> <span>Completed</span>
                                        </button>}
                                </div>
                                <div className={`p-2 text-[0.95rem] tracking-wide py-3 ${data?.status === "COMPLETED" && "bg-green-100 text-black"} ${data?.status === "PENDING" && "bg-[#F9E400] text-black"} ${data?.status === "EXPIRED" && "bg-[#ff5400] text-white"}`}>
                                    {data?.task}
                                </div>
                                <div className='p-1 text-center px-2 text-[0.9rem] bg-red-100 text-red-800 tracking-wide font-semibold'>
                                    Deadline : {data?.deadline.split('T')[0]}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className=' bg-[#111827] flex flex-col gap-4 items-center justify-start text-white p-4 pt-2  rounded-xl'>
                    <h3 className='text-center font-semibold tracking-wide text-[1.6rem]'>Expired</h3>

                    {taskData?.expired?.map((data) => {
                        return (
                            <div key={data?._id} className='w-full  rounded-md overflow-hidden bg-[#7E30E1]'>
                                <div className='flex p-2 items-center justify-between'>
                                    <button onClick={() => handleDelete(data?._id)} className='bg-red-100 text-red-600 w-fit p-1 rounded text-[1.1rem]'>
                                        <MdDelete />
                                    </button>

                                    {data?.status !== "COMPLETED" &&
                                        <button onClick={() => {
                                            setUpdateFormActive(true)
                                            setUpdateTaskData({
                                                task: data?.task,
                                                deadline: new Date(data?.deadline).toISOString().split('T')[0],
                                                id: data?._id
                                            })
                                        }} className='bg-pink-100 text-red-500 w-fit p-1 rounded text-[1.1rem]'>
                                            <CiEdit />
                                        </button>}
                                    {data?.status !== 'COMPLETED' &&
                                        <button onClick={() => handleToggleComplete(data?._id)} className='bg-red-100 text-red-900 flex items-center gap-1 w-fit p-1 rounded text-[0.8rem] px-2 font-semibold'>
                                            <span>Expired</span>
                                        </button>}
                                    {
                                        data?.status === 'COMPLETED' &&
                                        <button className='bg-green-100 text-green-900 flex items-center gap-1 w-fit p-1 rounded text-[0.8rem] px-2 font-semibold'>
                                            <IoIosCheckmarkCircle /> <span>Completed</span>
                                        </button>}
                                </div>
                                <div className={`p-2 text-[0.95rem] tracking-wide py-3 ${data?.status === "COMPLETED" && "bg-green-100 text-black"} ${data?.status === "PENDING" && "bg-[#F9E400] text-black"} ${data?.status === "EXPIRED" && "bg-[#ff5400] text-white"}`}>
                                    {data?.task}
                                </div>
                                <div className='p-1 text-center px-2 text-[0.9rem] bg-red-100 text-red-800 tracking-wide font-semibold'>
                                    Deadline : {data?.deadline.split('T')[0]}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}

export default Home
