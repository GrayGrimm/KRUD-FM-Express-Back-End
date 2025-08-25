const { mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    hashedPassword:{
        type: String,
        required: true,
    },
    bio:{
        type: String,
        required: true
    },
    callSign:{
        type: String,
        required: true
    },
    broadcastLocation:{
        type: String,
    },
    logo:{
        type: String,
    },
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;