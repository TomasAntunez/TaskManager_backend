import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;