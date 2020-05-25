const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    isCompleted : {
        type : Boolean,
        required: true
    },
    creator : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamps : true});

module.exports = mongoose.model('Todo' ,TodoSchema);