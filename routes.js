const express = require('express')
const router = express.Router();


router.post('/add', (req, res) => {
    const task = req.body.task;
  
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

  module.exports = router ;