const mongoose = require('mongoose');


mongoose.connect("")
const todoSchema = mongoose.Schema({
    title:String,
    description:String,
    completed:{
        type:Boolean,
        default:false
    }
    
})

const todos = mongoose.model('todos',todoSchema);
module.exports={
    todos
}