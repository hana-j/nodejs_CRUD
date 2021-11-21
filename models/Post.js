const mongoose = require('mongoose');

//schema
const postSchema = mongoose.Schema({
    title:{type: String, required:true},
    content:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},//ref:user를 통해 이항목의 데이터가 userCollection의 id와 연결됨을 몽구스가 알게해준다.
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date},
});

//model 
const Post = mongoose.model('post', postSchema);
module.exports = Post;