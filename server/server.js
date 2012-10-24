var app = require('http').createServer(handler), 
    io = require('socket.io').listen(app), 
    fs = require('fs');

app.listen(8080);

function handler (req, res) {
    // serves any file the clientside asks for
    fs.readFile(__dirname + req.url,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            
            // check if the current file is a script in javascript
            // to change the content-type
            var contentType = 'text/html';
            var patt1=/\.js$/i;
            
            if (patt1.test(req.url)) {
                contentType = 'text/javascript';
            }
            
           res.writeHead(200, {'Content-Type':  contentType});
           res.end(data);
        }
    );
}

io.sockets.on('connection', function (socket) {
    // add the user to a room (or channel)
    socket.on('subscribe', function(data) {
        if (data!=null && data.channel!=null && data.channel!=="") {
            socket.join(data.channel);       
        }
    });
    // remove the user from a room (or channel)
    socket.on('unsubscribe', function(data) { 
        if (data!=null && data.channel!=null && data.channel!=="") {
            socket.leave(data.channel); 
        }
    })
    // the user pushes data to the channel
    socket.on('push', function(data) {
        if (data!=null && data.channel!=null && data.channel!==""
         && data.event!=null && data.event!==""
         && data.message!=null && data.message!=="") {
            
            io.sockets.in(data.channel).emit(data.event, data);
        }
    });
  
});
