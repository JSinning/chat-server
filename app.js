//imports 
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
import mongoose from 'mongoose';
import chatRoom from './Schemas/chatRoom';
const app = express();
const server = http.Server(app);
const io = socketIO(server);

//conexion DB
const url = "mongodb://localhost:27017/chat";
const opcion = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
mongoose.connect(url, opcion).then(
    ()=>{console.log("Conexion exitosa a DB");},
    err => {console.log(err)}
);


//varibales 
const users = [];
let mensaje = [];
const dateTime = new Date();
const bot = "hi...."

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


//llamada del ChatRoom
chatRoom.find((err, result)=>{
    if (err) throw result;
    
    mensaje = result;
})
//conexion con socket
io.on('connection', (socket)=>{
    console.log("conexion socket")
    
    socket.emit('loggedIn', {
        users: users.map(s=>s.username),
        mensaje: mensaje
    });

    socket.on('newuser', username =>{
        console.log(`${username} usuario conectado`)
        socket.username = username;
        users.push(socket);

        io.emit('useronline', socket.username);
    });

    socket.on('msg', msg=>{
        const message =  new chatRoom({
            username:socket.username,
            msg:msg,
            date: dateTime
        })

        message.save((err, result) => {
			if (err) throw err;

			mensaje.push(result);

			io.emit('msg', result);
		});
    });
    

    socket.on('disconect', ()=>{
        console.log(`${socket.username} desconectado`);
        io.emit('userLef', username);
        users.splice(users.indexOf(socket), 1)
    })
});




// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
server.listen(app.get('puerto'), function(){
    console.log("ejemplo en el puerto " + app.get('puerto'));
});