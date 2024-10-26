import Task from "../model/task.model.js"
import AppError from "../utils/error.util.js"


const addTask = async (req, res, next) => {
    try {
        const { task, deadline } = req.body

        const newTask = new Task({
            task,
            deadline: new Date(deadline),
            user: req.user.id
        })

        await newTask.save()

        res.status(201).json({
            success: true,
            message: 'Task added Successfully',
            newTask
        })

    } catch (err) {
        return next(new AppError(err.message, 500))
    }
}

const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Helper function to strip time from a date
        const stripTime = (date) => {
            const strippedDate = new Date(date);
            strippedDate.setHours(0, 0, 0, 0);
            return strippedDate;
        };

        // Filter and sort tasks within each category
        const expiredTasks = tasks
            .filter(task => stripTime(task.deadline).getTime() < today.getTime())
            .sort((a, b) => a.status === "COMPLETED" ? 1 : -1);

        const todayTasks = tasks
            .filter(task => stripTime(task.deadline).getTime() === today.getTime())
            .sort((a, b) => a.status === "COMPLETED" ? 1 : -1);

        const tomorrowTasks = tasks
            .filter(task => stripTime(task.deadline).getTime() === tomorrow.getTime())
            .sort((a, b) => a.status === "COMPLETED" ? 1 : -1);

        const upcomingTasks = tasks
            .filter(task => stripTime(task.deadline).getTime() > tomorrow.getTime())
            .sort((a, b) => a.status === "COMPLETED" ? 1 : -1);

        res.status(201).json({
            success: true,
            message: 'Tasks loaded successfully',
            data: {
                today: todayTasks,
                tomorrow: tomorrowTasks,
                upcoming: upcomingTasks,
                expired: expiredTasks
            }
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
};


const updateTask = async (req, res, next) => {

    try {
        const { task, deadline, status } = req.body

        console.log(status)

        const existingTask = await Task.findById(req.params.id)

        if (!existingTask) {
            return next(new AppError("Task not found", 401))
        }

        if (existingTask.user.toString() !== req.user.id) {
            return next(new AppError("Unauthorized", 401))
        }

        if (task) existingTask.task = task
        if (deadline) existingTask.deadline = new Date(deadline)
        if (status) existingTask.status = status

        await existingTask.save();
        res.status(201).json({
            success: true,
            message: 'Task loaded Successfully',
            existingTask
        })
    } catch (err) {
        return next(new AppError(err.message, 500))
    }
}

const deleteTask = async (req, res, next) => {
    try {

        console.log(1)

        const task = await Task.findById(req.params.id);


        if (!task) {
            return next(new AppError("Task not found", 401))
        }

        if (task.user.toString() !== req.user.id) {
            return next(new AppError("Unauthorized", 401))
        }

        console.log(2)

        await task.deleteOne();

        console.log(3)

        res.status(201).json({
            success: true,
            message: 'Task removed Successfully',
            task
        })
    } catch (err) {
        return next(new AppError(err.message, 500))
    }
};

export {
    addTask,
    getTasks,
    updateTask,
    deleteTask
}