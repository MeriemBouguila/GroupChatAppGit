const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const db = mongoose.connection
const app = express()
const DB = require("./mongodb")

const bcrypt = require('bcrypt');
const { read } = require('fs');
const saltRounds = 10;

mongoose.connect('mongodb+srv://meriam:0000@cluster0.hxpmb.mongodb.net/Cluster0?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected")
});


app.use(express.json()); 
app.use(express.static(__dirname + '/client/dist'));
app.use(express.urlencoded({ extended: false }));


app.post('/register', function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
     const user = new DB.user_({ Name: req.body.name,password:hash });
    user.save(function (err) {
        if (err) return res.end(err);
        res.end("welcome "+req.body.name);
      });
    });
  });

app.post('/login', function(req, res) {
    DB.user_.find({Name:req.body.name}, function (err, docs) {
        if (err) return res.end(err);
        var user=docs[0]
        if(!user){
           return res.end(JSON.stringify("check again"));
        }
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if(result){
               var user_={
                   id:user._id,
                   name:user.Name,
                   isConnected:true
               }
               res.end(JSON.stringify(user_));
            }else{
                res.end(JSON.stringify("check again"));
            }
        });
    })
}); 

app.get('/channel_list', function(req, res) {
  DB.channels_.find({},function(err, result){
    res.end(JSON.stringify(result))
  })
 });

app.post('/send_msg/main_channel', function(req, res) {
    console.log(req.body)
    DB.welcome_channel.findById("6067138782a9593f407b871a",function(err, result) {
        var messages=[...result.messages]
        messages.push({message:req.body.message,user_id:req.body.id,name:req.body.name})
        DB.welcome_channel.update({id:0},{messages:messages},null,function(err, result) {
            if (err) return res.end(err);
            res.end("message sent successfully");
        })
    })
}); 

app.get('/fetch_messages/:id', function(req, res) {
   var channel_id=req.params.id
if(channel_id=="main"){
    DB.welcome_channel.findById("6067138782a9593f407b871a",function(err, result) {
        var messages=[...result.messages]
        res.end(JSON.stringify(messages))
    })
}else{
    console.log(channel_id)
    DB.channels_.find({name:channel_id},function(err, result) {
        if (err) return res.end(err);
        res.end(JSON.stringify(result[0].messages));
    })
}
}); 

app.post('/create_new_channel', function(req, res) {
    const channels_ = new DB.channels_({name:req.body.name,description:req.body.description,messages:[]});
    channels_.save(function(error, resp) {
        if (error) return res.end(error);
        res.end(resp.name + " got created");
    })
}); 

app.post('/send_message/:ChannelName', function(req, res) {
    var channel_name=req.params.ChannelName
    console.log(channel_name)
    DB.channels_.find({name:channel_name},function(err, result) {
        var messages=[...result[0].messages]
        messages.push({message:req.body.message,user_id:req.body.id,name:req.body.name})
        DB.channels_.update({name:channel_name},{messages:messages},null,function(err, result) {
            if (err) return res.end(err);
            res.end("message sent successfully");
        })
    })
}); 


app.listen(3000, () => {

    console.log('server started successfully')
})

