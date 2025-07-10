//This file contains what every user will have in our database


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    unique: true,
    trim: true

},

email: {
    type: String,
    required: true,
    unique: true,
    trim: true
},

password: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
    trim: false
},

classes: [
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true

            //more to add for assignments
        },
    }
]


});

export default mongoose.model('User', userSchema);