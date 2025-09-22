const express = require('express');
const { createTodo, updateTodo } = require('./types');
const { todos } = require('./db');
const cors = require('cors')

const app = express();
app.use(cors({
    origin:'http://localhost:5173/'
}))

app.use(express.json());

app.post('/todo',async(req,res)=>{

    const createPayload = req.body;
    const passLoad = createTodo.safeParse(createPayload);
    if(!passLoad.success){
        res.status(411).json({
            msg:"You sent wrong input",
        })
        return;
    }
    await todos.create({
        title:createPayload.title,
        description:createPayload.description,
        completed:false
    })
    res.json({
        msg:'Todo created'
    })

})

app.get('/todos', async (req, res) => {
  const todo = await todos.find({});
  res.json({ todo });
  console.log(todo);
});




app.put('/completed',async(req,res)=>{
const updatePayload = req.body;
    const updateLoad = updateTodo.safeParse(updatePayload);
    if(!updateLoad.success){
        res.status(411).json({
            msg:"You sent wrong input",
        })
        return;
    }
    await todos.update({
        _id:req.body.id
    },{
        completed:true
    })
    res.json({
        msg:'Todo marked as completed'
    })

})

app.listen(3000);
