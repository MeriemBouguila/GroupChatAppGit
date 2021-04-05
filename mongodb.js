const mongoose = require('mongoose');
const { Schema } = mongoose;

  const users = new Schema({
    Name:  String, // String is shorthand for {type: String}
    password: String,

  });
 
  const Main_channel = new Schema({
    messages:[Object]
  });
 
  const channels = new Schema({
    name:String,
    description:String,
    messages:[Object]
  });

  const user_ = mongoose.model('user', users);
  const welcome_channel = mongoose.model('welcome_channel', Main_channel);
  const channels_ = mongoose.model('channels', channels);

  module.exports={user_,welcome_channel,channels_}