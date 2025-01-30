const express = require("express")
const router = express.Router();
const {getTask, addTask,deleteTask, updateTask}  =require("../controllers/taskController")

router.get('/',getTask)
router.post('/',addTask)
router.delete('/:id',deleteTask)
router.put('/update',updateTask)

module.exports=router;