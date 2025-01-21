export class SocketClient{

	constructor ( socketServerAddress , service ){	
		this.session_data = session_data;
		this.socketServerAddress = socketServerAddress;
		this.mainService = service;
		this.isConnected = false;
		this.socketIdentity = this.session_data.empid+':'+this.session_data.SESSION_ID_DATA;
	}
	
	/* SOCKET LISTENERS */
	_onConnect ( ){
		this.websocket = new WebSocket ( this.socketServerAddress );

		
		this.websocket.onopen = ( arg )=> {
			this.websocket.send ( JSON.stringify({
				user : this.socketIdentity,
				room : "BTTHS:vims",
				onconnect : true,
			}) );
			this.isConnected = true;
		}
		
		this.websocket.onmessage = ( arg ) => {
			console.log(arg);
		}
		
		this.websocket.onerror = ( ) => {
			this.isConnected = false;
		}
		
		this.websocket.onclose  = ( ) => {
			this.isConnected = false;
			
			/* this.mainService.serverRequest( {
				type: "POST",
				url : this.mainService.urls["auth"]['url'],
				data : {
					data : {
						request : 'logout',
						login_data : [],
					}
										
				}
			} , 
			( res ) => {
				this.mainservice.SocketClient._onDisconnect();
				console.log("disconnected from socket");
				location.reload();
							
			},
			(err) => {
				console.error(err);
			}); */
			
		}
	}
	
	_onDisconnect ( ){
		this.websocket.send ( JSON.stringify({
			user : this.socketIdentity,
			room : "BTTHS:vims",
			disconnect : true,
		}) );
	}
	
	getSessionData ( ){
		return this.session_data;
	}
	
	getWebsocket ( ){
		return this.websocket;
	}
	
}