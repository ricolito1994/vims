export class EventHandler {
	
	constructor (  context  ){
		this.events = {};
		this.context = context;
	}
	
	registerEvent( eventName , callback ){
		//console.log(eventName);
		if ( !this.events.hasOwnProperty( eventName ) ){
			this.events [ eventName ] = callback;
		}
	}
	
	dispatch ( eventName , parameters ){
		//console.log(eventName,parameters,EventHandler.events);
		//console.log(this.events);
		document.addEventListener ( eventName , this.events[eventName] );
		//console.log(EventHandler.events[eventName]);
		//document.dispatchEvent( new CustomEvent ( eventName, parameters ) );
		//parameters.bubbles = true;
		document.dispatchEvent( new CustomEvent ( eventName, parameters ) );
	}
	
	dispatchPromise ( eventName, parameters ){
		return new Promise ( ( resolve , reject ) => {
			//
		});
	}
	
	unRegisterEvent ( eventName ){
		//console.log('unregistered',this);
		document.removeEventListener( eventName , this.events[eventName] );
		this.events[ eventName ] = null;
		//delete this;
	}
	
}
//new EventHandler();