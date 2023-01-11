import express from "express";
import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/')
    .post(checkAuth, createTask)
    .get(checkAuth ,getTasks)
;
router.route('/:id')
    .get(checkAuth, getTask)
    .put(checkAuth, updateTask)
    .delete(checkAuth, deleteTask)
;

export default router;