const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:  {type:String, required: true},
    shopping_cart: Array,
})

const User = mongoose.model("User", userSchema);

module.exports = User;