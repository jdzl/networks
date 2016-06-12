var express = require("express"),
    app     = express(),
    http = require('http').Server(app),
    io   = require('socket.io')(http),
    five = require("johnny-five"),

    board = new five.Board({
  //  port:  "/dev/rfcomm0"
    port: "/dev/ttyUSB0"
  });

  //  board = new five.Board();
var x,volt;
var rled = 11; // Pin PWN 11 para led rojo
var bled = 10; // Pin PWM 10 para led azul
var gled = 9;  // Pin PWM 9  para led verde

board.on("ready", function() {

this.pinMode(9, five.Pin.PWM);
this.pinMode(10, five.Pin.PWM);
this.pinMode(11, five.Pin.PWM);


i=18;
//board.analogWrite(9, 0); // B
//board.analogWrite(10, 255); //R
//board.analogWrite(11, 0); //G
/*
time = setInterval(function(){

     board.analogWrite(9, 0); // B
     board.analogWrite(10, 255); //R
     board.analogWrite(11, 0); //G
     i+=5;
     console.log("asd "+i);
     if(i >255)clearInterval(time);

  },800);


  */        // A1
        //  console.log("entro");
          this.pinMode(1, five.Pin.ANALOG);
          this.analogRead(1, function(voltage) {
              volt=(100*voltage*5)/1024;
              volt=Math.round(volt*100)/100;

              if(volt>34){

                      board.analogWrite(9,  0); // R
                      board.analogWrite(10, 255 ); // G
                      board.analogWrite(11, 255); // B

              }else if(volt >24 && volt <34){

                      board.analogWrite(9, 255); // R
                      board.analogWrite(10, 0); //G
                      board.analogWrite(11, 255); //B
              }else if(volt<24){
                      board.analogWrite(9, 255); // R
                      board.analogWrite(10, 255); //G
                      board.analogWrite(11,0); //B

              }else{
                board.analogWrite(9, 255); // R
                board.analogWrite(10, 255); //G
                board.analogWrite(11,255); //B

              }

             });
//------------------------------------------
/*
             var val = 0;
             var LEDPIN = 11;
             var OUTPUT = 1;
               // Set pin 13 to OUTPUT mode
               this.pinMode(LEDPIN, OUTPUT);
              //var p =new five.Pin(1);
               // Create a loop to "flash/blink/strobe" an led
               this.loop( 100, function() {
                 this.digitalWrite(LEDPIN, (val = val ? 0 : 1));
                 //p.write(0);
               });
               */
  //---------------------------------------
            //  x = new five.Led(6);
          //    x.on();
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
