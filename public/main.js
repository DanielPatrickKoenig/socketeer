var _socketapp = (function () {
    function SocketApp(){
        // console.log('sup')
        var self = this;
        var playerManifest = [];
        this.setInitaHandler = function(h){
            initHandler = h;
        }
        this.setUpdateSocketHandler = function(h){
            updateSocketHandler = h;
        }
        this.setUpdatePlayerHandler = function(h){
            updatePlayerHandler = h;
        }
        this.setRemovePlayerHandler = function(h){
            removePlayerHandler = h;
        }
        this.setListUpdateHandler = function(h){
            listUpdateHandler = h;
        }
        var initHandler = function (socket,id){}
        var updateSocketHandler = function (socket,id){}
        var updatePlayerHandler = function (id, props){}
        var removePlayerHandler = function (id){}
        var listUpdateHandler = function (list){}
        function onInit(socket,id){
            initHandler(socket,id);
        }
        
        function onUpdateSocket(socket,id){
            updateSocketHandler(socket,id);
        }
        function updatePlayerOnClient(id, props, pid){
            updateManifest(id);
            return updatePlayerHandler(id, props, pid);
        }
        function removePlayer(id){
            updateManifest(id, true);
            removePlayerHandler(id);
        }

        function updateManifest(id, remove){
            var inManifest = false;
            for(var i = playerManifest.length-1;i>=0;i--){
                if(id == playerManifest[i]){
                    inManifest = true;
                    if(remove){
                        playerManifest.splice(i,1)
                    }
                }
            }
            if(!remove && !inManifest){
                playerManifest.push(id);
            }
            // console.log(playerManifest)
        }

        function updateOtherPlayers(players){
            for(var i = 0;i<players.length;i++){
                // console.log(players[i])
                var extractedProperties = {};
                for (var p in players[i]) {
                    if(p != 'id'){
                        extractedProperties[p] = players[i][p]
                    }
                }
                updatePlayerOnClient(players[i].id,extractedProperties,playerID);
            }
        }
        function validatePlayer(id, players){
            var validated = false;
            for(var i = 0;i<players.length;i++){
                if(players[i].id == id){
                    validated = true;
                }
            }
            return validated;
        }

        function getRemoveList(players){
            var rList = [];
            for(var i = 0; i < playerManifest.length;i++){
                if(!validatePlayer(playerManifest[i], players)){
                    rList.push(playerManifest[i]);
                }
            }
            return rList;
        }

        this.getSocket = function () {
            return socket;
        }

        this.getPlayerList = function () {
            return playerManifest;
        }
        
        var playerID = ''
        var socket = io(document.location.href);
        this.init = function (pid){
            playerID = pid;
            // console.log('hello');
            // onUpdateSocket(socket,playerID);
            onUpdateSocket(socket,playerID);
            onInit(socket,playerID);
            setInterval(function () {
                onUpdateSocket(socket,playerID);
            },30);
            socket.on('session-begin',function (e) {
                // console.log('began');
                var spirte = updatePlayerOnClient(playerID);
                
                updateOtherPlayers(e.players);
            });
            socket.on('player-action-broadcast',function (e) {
                //var playerList = e.players;
                //console.log(e.list);
                listUpdateHandler(e.list);
                updateOtherPlayers(e.players);
                var rList = getRemoveList(e.players);
                // console.log(rList);
                for(var i = rList.length-1;i>=0;i--){
                    removePlayer(rList[i]);
                }
            });
            socket.on('player-remove',function(e){
                //alert('player remove');
                var rList = getRemoveList(e.players);
                for(var i = rList.length-1;i>=0;i--){
                    removePlayer(rList[i]);
                }
                //alert(e.id);
            });
        }
    }
    return new SocketApp();
    
})();