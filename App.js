const express = require('express');
const router = express.Router();
const cors = require('cors')
// const dotenv= require('dotenv').config()
const bodyParser = require('body-parser') 
const employesRoutes = require('./routes');
const sqlite3 = require('sqlite3')
require('dotenv').config();
const BASE_URL= process.env.BASE_URL

router.post('/add', (req, res) => {
    const task = req.body.task;
    console.log("task", task)
  
    if (!task) {
      return res.status(400).json({ error: 'Task is required.' });
    }
  
    db.run('INSERT INTO todos (task) VALUES (?)', [task], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, task });
    });
  });

router.get('/tasks',(req,res)=>{
    db.all('SELECT * FROM todos', (error,rows)=>{
        if (error){
            res.status(500).json({error:error.message})
        }
        res.json({tasks: rows})
    })

})  

router.delete('/tasks/:id',(req,res)=>{
  const taskId=req.params.id
  db.run('DELETE FROM todos WHERE id =?',[taskId], function (err){
    if (err){
      res.status(500).json({error: err.message})
    }
    res.json({message: 'Task deleted successfully'})
  })

}) 

router.put('/tasks/:id',(req, res)=>{
  console.log("requestbody",req.body)
  console.log("requestparams,", req.params)
  const taskId=req.params.id
  const updatedTask = req.body.task; 
  db.run('UPDATE todos SET task =? WHERE id =?', [updatedTask,taskId], function(err){
    if (err){
      res.status(500).json({err: err.message})
      return;
    }
    res.json({id:taskId, task: updatedTask})
  })
})

const app = express();

const PORT = 5000;

// Use the router in your app
app.use(cors())
app.use(express.json())
app.use(router);
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use('/employee', employesRoutes);

// Listen on the app, not the router
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const db = new sqlite3.Database('./test.db', (err) => {
    if (err) {
      console.error('Error opening database', err.message);
    } else {
      console.log('Connected to the database.');
     
      db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)');
    }
  });