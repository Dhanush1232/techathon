const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the Post schema
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  tag:{
    type: String,
    required: true
},

filename: { 
    type: String, 
    required: true, 
    unique: true 
},
originalName: { 
    type: String, 
    required: true 
},
path: { 
    type: String, 
    required: true 
},
avatar: {
    type: String,
    required:true
  },
created: { 
    type: Date, 
    default: Date.now 
},
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  // Reference the posts created by the user
  posts: [postSchema],
});

// Hashing the password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Generate Token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

// Export the User schema
const User = mongoose.model('ADMIN', userSchema);

module.exports = User;
