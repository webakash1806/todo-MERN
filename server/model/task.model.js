import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "PENDING"],
        default: "PENDING"
    }
})

const Task = model('Task', TaskSchema)

export default Task