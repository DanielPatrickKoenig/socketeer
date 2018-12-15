var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app); 
var io = require('socket.io')(server);
var port = 8081;
// var port = 8080;

var players = [];
var playerSockets = {};
function updatePlayer(p){
    console.log('updatePlayer');
    var player = p;
    var hasPlayer = false;
    for(var i = 0;i<players.length;i++){
        if(p.id == players[i].id){
            hasPlayer = true;
            for(var prop in p){
                if(prop != 'id'){
                    players[i][prop] = p[prop];
                }
            }
        }
    }
    if(!hasPlayer){
        players.push(p);
    }
}
function getPlayerIndexByID(id){
    var index = -1;
    for(var i = 0;i<players.length;i++){
        if(id == players[i].id){
            index = i
        }
    }
    return index;
}
function broadcastPlayerUpdate(socket){
    var playerList = [];
    for (var i = 0; i < players.length;i++){
        playerList.push(players[i].id);
    }
    socket.broadcast.emit('player-action-broadcast',{
        players: players, list: playerList
    });
}
app.use(express.static(path.join(__dirname,"public")));

io.on('connection', function (socket) {
    console.log('new connection made');
    console.log(players.length);
    socket.emit('session-begin',{
        players: players
    });
    socket.on('message-from-server', function(m){
        console.log(m);
    })
    socket.on('player-action', function(p){
        // players.push(p);
        console.log('action');
        if(p != undefined && p != null){
            updatePlayer(p);
            console.log(players);
            broadcastPlayerUpdate(socket);
            // socket.broadcast.emit('player-action-broadcast',{
            //     players: players
            // });
            if(playerSockets[p.id] == undefined){
                playerSockets[p.id] = socket;
            }
        }
    })
    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        var removeIndex = -1;
        var updatedPlayerSockets = {}
        for(var p in playerSockets){
            if(playerSockets[p] == socket){
                removeIndex = getPlayerIndexByID(p);
            }
            else{
                updatedPlayerSockets[p] = playerSockets[p];
            }
        }
        if(removeIndex >= 0){
            players.splice(removeIndex,1);
            broadcastPlayerUpdate(socket);
            playerSockets = updatedPlayerSockets;
        }
        socket.broadcast.emit('player-remove',{
            players: players
        });
     });
});

server.listen(port, function () {
    console.log('port exposed - '+port);
});