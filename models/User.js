const mongoose = require('mongoose');
//create an instance of mongoose Schema
const Schema = mongoose.Schema;

//create model schema, have object required
const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('users',UserSchema);
//'users' means cluster or collection (table)
//document is analogous to record in SQL