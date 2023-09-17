const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        min: 6,
        max: 20,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        min: 6,
    },
    password:{
        type: String,
        min: 5,
    },
    profilePicture: {
        type: String,
        default: '',
    },
    coverPicture: {
        type: String, 
        default: '',
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    }, 
    isAdmin: {
        type: Boolean,
        default: false,
    },
    bio:{
        type: String,
        max: 500,
    },
    city:{
        type: String,
        max: 50,
    },
    from:{
        type: String,
        max: 50,
    },
    relationship:{
        type: String,
        enum:[1, 2, 3]
    }
},
    { timestamps: true},
);

module.exports = mongoose.model('User', UserSchema);