import Task from "../models/Task.js";
import validateContent from "../validators/taskValidator.js";

const createTask = async (req, res) => {

    const { content } = req.body;

    const notValid = validateContent(content);
    if( notValid ) {
        return res.status(400).json(notValid);
    }

    const task = new Task({content});
    task.userId = req.user._id;

    try {
        const savedTask = await task.save();

        res.json(savedTask);

    } catch (error) {
        console.log(error);
    }
};

const getTasks = async (req, res) => {

    const tasks = await Task.find().where('userId').equals(req.user._id);

    res.json( tasks );
};

const getTask = async (req, res) => {

    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if( task.userId.toString() !== req.user._id.toString() ) {
            const error = new Error('Invalid action');
            return res.status(403).json({ msg: error.message });
        }
    
        res.json(task);

    } catch (e) {
        console.log(e);
        const error = new Error('Non-existent task');
        return res.status(404).json({ msg: error.message });
    }
};

const updateTask = async (req, res) => {

    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if( task.userId.toString() !== req.user._id.toString() ) {
            const error = new Error('Invalid action');
            return res.status(403).json({ msg: error.message });
        }

        const notValid = validateContent(req.body.content);
        if( notValid ) {
            return res.status(400).json(notValid);
        }

        task.content = req.body.content;

        const updatedTask = await task.save();
        res.json(updatedTask);

    } catch (e) {
        console.log(e);
        const error = new Error('Non-existent task');
        return res.status(404).json({ msg: error.message });
    }
};

const deleteTask = async (req, res) => {

    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if( task.userId.toString() !== req.user._id.toString() ) {
            const error = new Error('Invalid action');
            return res.status(403).json({ msg: error.message });
        }

        await task.deleteOne();
        res.json({ msg: 'The task was deleted successfully' });

    } catch (e) {
        console.log(e);
        const error = new Error('Non-existent task');
        return res.status(404).json({ msg: error.message });
    }
};

export {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
};