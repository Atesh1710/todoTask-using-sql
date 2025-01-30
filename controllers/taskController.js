const { pool } = require("../db")

const getTask = async (req, res) => {
     try {
          const getTask = await pool.query(
               `SELECT * FROM public.tasks `
          )
          res.status(200).json({ message: getTask.rows })
     }
     catch (err) {
          console.log(err);
          res.status(500).json({ message: "Failed to fetch tasks ", err: err.message })
     }
};

const addTask = async (req, res) => {
     try {
          const { title } = req.body
          const addTask = await pool.query(
               `INSERT INTO public.tasks (title)  VALUES($1) RETURNING *`,
               [title]
          )
          res.status(200).json({ message: "Task Added Successfully!", task: addTask })
     }
     catch (err) {
          console.log(err);
          res.status(500).json({ Message: "Error adding tasks!", Error: err.message })
     }
}
const updateTask = async (req, res) => {
     try {
          const { id, title } = req.body
          if (!id || !title) {
               return res.status(400).json({ message: "ID and title are required!" });
          }
          const updateTask = await pool.query(
               `UPDATE tasks SET title=$1 WHERE id=$2 RETURNING *`, [title, id]
          )
              if (updateTask.rowCount === 0)  {
               return res.status(404).json({ message: "Task not found!" }) 
              }
               res.status(200).json({ message: "Task Updated successfully!" , UpdatedTask:updateTask.rows[0]})
     }
     catch (err) {
          console.log("Error updating task! ", err);
          res.status(500).json({ message: "Task not updated! ", error: err.message })
     }
}
const deleteTask = async (req, res) => {
     try {
          const { id } = req.params

          const deleteTask = await pool.query(
               `DELETE FROM public.tasks WHERE id=${id}`
          )
          res.status(200).json({ Message: "Task deleted !" })
     }
     catch (err) {
          console.log("Error deleting  task!");
          res.status(500).json({ message: "Error deleting tasks", error: err.message })
     }
}
module.exports = { getTask, addTask, deleteTask, updateTask }