//imports 
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

//varibales 
const users = [];
const mensaje = [];
const dateTime = new Date();
// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

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
        const messeger = {
            username:socket.username,
            msg:msg,
            date: dateTime
        }

        mensaje.push(messeger)
 
        io.emit('msg', messeger);
        
       
        
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