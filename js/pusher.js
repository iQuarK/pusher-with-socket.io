var pusher = {
    io: null,
    init: function () {
    console.log("initializing");
        pusher.io = io.connect('http://localhost:8080');
    },
    subscribe: function(channel) {
        pusher.io.emit('subscribe', {channel:channel});
        return this;
    },
    bind: function(name, func) {
        pusher.io.on(name, func);
    },
    publish: function(data) {
        pusher.io.emit('push', {event:data["event"], message:data["message"], channel:data["channel"]});
    }
};

pusher.init();


var channel = pusher.subscribe('my-channel');

channel.bind('my-event', function(data) {
    document.getElementById("mess").innerHTML += data.message;
});

function sendmsg() {
  var text=document.getElementById("text").value;
  if (text!="") {
     data = new Array();
     data["event"] = 'my-event';
     data["channel"] ='my-channel';
     data["message"] = "<div class='msg odd'><strong>- </strong>"+text+"</div>";
     pusher.publish(data);
  }
}    
