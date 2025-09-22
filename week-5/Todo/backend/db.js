const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://mishrasangeeta944_db_user:sangeeta@cluster0.8pi1xkc.mongodb.net/")
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