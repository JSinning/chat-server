//imports 
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
import { Socket } from 'dgram';

const app = express();
const server = http.Server(app);
const io = socketIO(server);
// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//routes
io.on('connection', function(socket){
    console.log("bienbenido");

    socket.on('incremet', function(counter){
        console.log("incremento");
        io.sockets.emit('COUNTER_INCREMET', counter + 1);
    });

    socket.on('decremet', function(counter){
        console.log("decremento");
        io.sockets.emit('COUNTER_DECREMET', counter - 1);
    });

});
// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), function(){
    console.log("ejemplo en el puerto " + app.get('puerto'));
});