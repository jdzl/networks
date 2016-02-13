var express = require("express"),
    app     = express(),
    http = require('http').Server(app),
    io   = require('socket.io')(http),
    five = require("johnny-five"),
    board = new five.Board();
var x,volt;
board.on("ready", function() {
          // A1
          this.pinMode(1, five.Pin.ANALOG);
          this.analogRead(1, function(voltage) {
              volt=(voltage*5)/1023
              volt=Math.round(volt*100)/100;
             });
                x = new five.Led(5);
                //x.strobe("1000");
                //x.fade(128, 2000);
                //setTimeout(function(){x.off();},5000);
}); // end board
app.set('view engine', 'ejs');
app.get('/', function (req, res) {  res.render('pages/index'); });
app.use(express["static"](__dirname + '/public'));

//  Sockets
var interval;
io.on('connection', function(socket) {

            log('New user connected Id ---> '+ socket.id);

            interval = setInterval(function(){
                                              socket.emit('voltaje',volt);
                                  },500);

            socket.on('disconnect',function() {  });

            socket.on('OnNoise', function(Status) {
                  if(Status){    clearInterval(interval);
                  }else{
                    interval = setInterval(function(){      socket.emit('voltaje',volt);      },500);}
             });

            //  io.to(id_session_sock).emit('event',{ user : socket.name , msg: msgfull });
            //  io.emit('infoUsers', resp);
            //  socket.broadcast.emit('infoUsers', resp);

});
http.listen(8080, function() {
        log('Running Server... \033[32m✓\033[37m');
        log('listening on *:8080 \033[32m✓\033[37m');
});
function log(message){  console.log(message);}
