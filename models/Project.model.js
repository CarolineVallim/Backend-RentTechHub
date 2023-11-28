const mongoose = require('mongoose');
const {Schema, model} = mongoose; 

const projectSchema = new Schema({
    title: String, 
    description: String, 
    tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
});

module.exports = model("Project", projectSchema);