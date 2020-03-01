import mongoose from 'mongoose';

const Schema = mongoose.Schema

const chatSchema = new Schema({
    username: String,
    msg:String,
    date:Date
});


const chatRoom = mongoose.model('chatRoom', chatSchema);

export default chatRoom;