 const express = require('express');
  const bodyParser = require('body-parser');
  
  const app = express();
  
  app.use(bodyParser.json());

let todos = [];


app.get('/todos',(req,res)=>{
    res.json(todos);
})

app.get('/todos/:id',(req,res)=>{
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if(!todos){
        res.status(404).send();
    }
    else{
        res.json(todo);
    }
})


app.post('/todos',(req,res)=>{
    const newTodo = {
        id:Math.floor(Math.random() * 10000000),
        title:req.body.title,
        description:req.body.description
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);

})


app.put('/todos/:id',(req,res)=>{
    const todoIndex = todos.findIndex(t => t.id == parseInt(req.params.id));
    if(todoIndex == -1){
        res.status(404).send();
    }else{
        todos[todoIndex].title = req.body.title;
        todos[todoIndex].description = req.body.description;
        res.json(todos[todoIndex]);

    }
})

app.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todos.splice(todoIndex, 1);
      res.status(200).send();
    }
  });

  
  module.exports = app;
  // Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});