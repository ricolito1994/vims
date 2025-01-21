import { EventHandler } from "./events.handler.class.js";
import { MainService } from "./main.service.class.js";
/* abstract */
export class Controller{
	/*
		base class of controller
		inherit this to your controller classes
		by using 'extends' keyword
	*/
	constructor ( controller , service ,elm ){
		this.controllerName = controller;
		//console.log(controller);
		if ( service )
		this.mainService = service;
		
		//console.log(this.promise);
		
		//this.binds (this.controllerName);
		let e = document.querySelector ( 'div'+elm );
		
		if(e)
		this.populatesy ( e.children , controller );
	}
	
	/* populate drop down with schoolyear */
	/* edit : all input with sy are turned into year picker */
	populatesy ( children , ctrl ){
		for ( let d = 0 ; d < children.length ; d++ ){
			let child = children[d];
			if ( ctrl ==  child.dataset.controller ){
				
				if(child.tagName=='INPUT'){
					for ( let i in child.dataset ){
						//console.log(child.dataset[i]);
						if (
						child.dataset[i].includes('year') || 
						child.dataset[i].includes('Year') || 
						child.dataset[i].includes('schoolyear')
						){
							
							try{
								//console.log(child);
								$('#'+child.id).datepicker({
									minViewMode: 2,
									format: 'yyyy',
									autoclose : true,
									defaultDate :'',
								});
								setTimeout( ()=> {
									if (child.value!=="")
									$('#'+child.id).datepicker('setDate',new Date(child.value+'-01-01'));
								},100);
							}
							catch(e){}
						}
					}
				}
		
				/* if(child.tagName=='SELECT'){
					
					for ( let i in child.dataset ){
						//if (child.className.includes('sy')){
						
						if ( child.dataset[i].includes('sy')){
							let cyear = (this.mainService.getCurrentDate().split('-')[0]) - 150 ;
							let i = parseInt(this.mainService.getCurrentDate().split('-')[0]) + 1;
							child.innerHTML = '';	
							//console.log($('#'+child.id).yearpicker());
							//$('#sy2').click(function(){alert("WSS");});
							for (;i>=cyear;i--){
								let option_ = document.createElement('option');
								option_.innerText=i;
								child.appendChild(option_);
							}
							
						}
					}
				} */
			}
			
			if ( !ctrl ){
				
			}
			
			if ( child.children.length > 0 ){
				this.populatesy(child.children);
			}
			
		}
		
		
	}
	
	binds (ctrl, div){
		
		let dv = div ? div : "";
		this.thisElements = [];
		this.controllerNameDOM = document.querySelector ( 'div'+dv );
		this.elem = dv;
		this.ctrl = ctrl;
		//console.log(this.controllerName,this.controllerNameDOM);
		//for ( let ctr = 0 ; ctr < this.controllerNameDOM.length ; ctr ++ ){
		this.bindRecursive( this.controllerNameDOM.children , ctrl );
		//}
		
		
		/* for ( let ctr = 0 ; ctr < this.controllerNameDOM.length ; ctr ++ ){
			let selectedDOM = this.controllerNameDOM[ctr];
			let domDataset = selectedDOM.dataset;
			
			if ( ctrl ==  domDataset.controller ){
				console.log('f',selectedDOM.children);
				this.assignElements ( selectedDOM.children );
			}
		} */
		
		this.bindElements ( );
		
		if ( !MainService.EventObject [ this.controllerName ] ){
			this.eh = new EventHandler(this);

			//console.log(`this.controllerName `,	this.controllerName )
			
			let funcs = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
			//console.log(this,funcs);
			for( let t in funcs ){
				if ( funcs[t].match ( /(^)on/gim ) ){
					/* if controller functions has 'on', it is a listener */
					this.eh.registerEvent( this.controllerName +':'+funcs[t] , this[ funcs[t] ].bind(this) );
				}
			}
			
			MainService.EventObject [ this.controllerName ] = this.eh;
		}
		//console.log(this.eh);
		//console.log(this.thisElements,this.controllerNameDOM,ctrl);
		
	}
	unbinds( e ){
		/* for modals closing */
		//alert("Wessw");	
		
		//console.log(this.controllerName,this.eh);
		let funcs = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
		//console.log(e,funcs);
		for( let t in funcs ){
			if ( funcs[t].match ( /(^)on/gim ) ){
				console.log(( this.controllerName +':'+funcs[t] ));
				if(this.eh)
				this.eh.unRegisterEvent( this.controllerName +':'+funcs[t] );
			}
		}
		
		if (this.aggunbind){
			//console.log('wwww');
			this.aggunbind();
		}
		
		/* not allowed in strict mode */
		delete MainService.EventObject [ this.controllerName ] ;
		//console.log(this.eh);
		//this.eh.unRegisterEvent();
		//delete this;
		//console.log(MainService.EventObject);
	}
	
	bindRecursive ( children , ctrl ){
		//console.log( children );
		for ( let d = 0 ; d < children.length ; d++ ){
			let child = children[d];
			if ( ctrl ==  child.dataset.controller ){
				//this.assignElements ( child.children );
				this.thisElements.push(child);
			}
			
			if ( !ctrl ){
				
			}
			
			if ( child.children.length > 0 ){
				this.bindRecursive(child.children);
			}
			
		}
	}
	
	
	/* 
		call this everytime you make changes to the object
		greatly paired with watchers or proxies 
		( i Haven't tried this yet, if you successfully 
		implemented this inside a proxy or watcher pls email me thanks 
		 ricomagnifico018@gmail.com )
	*/
	bindChildObject ( object , refresh ){
		// console.log(Object.keys(object));
		// /\b(?:textarea|two|three)\b/gi
		// /(?:^|\W)input|select|textarea(?:$|\W)/g
		// must be called inside a watcher function
		// console.log(this.thisElements);
		for ( let elems = 0 ; elems < this.thisElements.length ; elems ++ ){
			let selectedElement = this.thisElements[ elems ];
			let selElemDataset = selectedElement.dataset;

			let match = selectedElement.tagName.match( /(?:^|\W)input|select|textarea|date|hidden(?:$|\W)/gi );

			if ( ( match && match !=='null' ) ){
				if( typeof selElemDataset.valuectrl != 'undefined' ){
					let dsets = selElemDataset.valuectrl.split(".");
					let selectedIndex = (selElemDataset.valuectrl.split ('.'))[1];
					// selectedElement.setAttribute("value" , object [ selectedIndex ] );
					// if ( refresh )
					// selectedElement.value = object [ selectedIndex ];
					//console.log(selectedIndex);
					let val = 
					(selectedElement.type =='checkbox' || selectedElement.type =='radio') ? (selectedElement.checked?1:0)
					: (selectedElement.type =='image') ? selectedElement.src : selectedElement.value;
					object [ selectedIndex ] =  selectedElement.value;
								 
					let sds = this.seldsets ( object[ dsets[0] ], dsets, 0 );
					
					if (refresh){
						
						switch(dsets.length){
							case 1:
								object[dsets[0]] = val;
							break;
							case 2:
								//console.log(dsets,val);
								object[dsets[0]][dsets[1]] = val;
							break;
							case 3:
								object[dsets[0]][dsets[1]][dsets[2]] = val;
							break;
							case 4:
								object[dsets[0]][dsets[1]][dsets[2]][dsets[3]] = val;
							break;
							case 5:
								object[dsets[0]][dsets[1]][dsets[2]][dsets[3]][dsets[4]] = val;
							break;
						}
							
					}
					else{
						//console.log(selectedElement,sds)
						if((selectedElement.type =='checkbox' || selectedElement.type =='radio')){
							//console.log(selectedElement,sds);
							selectedElement.checked = sds == 1 ? true : false;
						}
						else if( selectedElement.type =='image' ){
							//console.log(selectedElement.type,sds);
							selectedElement.src = sds;
						}
						else{
							try{
								selectedElement.value = sds;
							}
							catch(e){
								//console.log(selectedElement.type,sds)
							}
						}
					}

				}
					
			}
			
			
			
			else{
				if( selElemDataset.valuectrl ){
					let dsets = selElemDataset.valuectrl.split(".");
					
					if( selectedElement.tagName =='IMG' || selectedElement.type == 'image' ){
		
						//let dsets = selElemDataset.valuectrl.split(".");
						//console.log(this.seldsets ( this[ dsets[0] ], dsets, 0 ));
						selectedElement.src = this.seldsets ( this[ dsets[0] ], dsets, 0 );;
						//console.log(this.seldsets ( this[ dsets[0] ], dsets, 0 ));
						switch(dsets.length){
							case 1:
								this[dsets[0]] = selectedElement.src;
							break;
							case 2:
								this[dsets[0]][dsets[1]] = selectedElement.src;
							break;
							case 3:
								this[dsets[0]][dsets[1]][dsets[2]] = selectedElement.src;
							break;
							case 4:
								this[dsets[0]][dsets[1]][dsets[2]][dsets[3]] = selectedElement.src;
							break;
							case 5:
								this[dsets[0]][dsets[1]][dsets[2]][dsets[3]][dsets[5]] = selectedElement.src;
							break;
						}
					}
					
					else{
					
						selectedElement.innerText = this.seldsets ( this[ dsets[0] ], dsets, 0 );;
						switch(dsets.length){
							case 1:
								this[dsets[0]] = selectedElement.innerText;
							break;
							case 2:
								this[dsets[0]][dsets[1]] = selectedElement.innerText;
							break;
							case 3:
								this[dsets[0]][dsets[1]][dsets[2]] = selectedElement.innerText;
							break;
							case 4:
								this[dsets[0]][dsets[1]][dsets[2]][dsets[3]] = selectedElement.innerText;
							break;
							case 5:
								this[dsets[0]][dsets[1]][dsets[2]][dsets[3]][dsets[5]] = selectedElement.innerText;
							break;
						}
					}
				}
				else{
					
				}
				
			}

		}
	}
	setdsets ( dsets , i ){
		
	}
	
	seldsets ( obj,  dsets , i ){
		i++;
		if (obj){
			if ( ( dsets[i] && obj[ dsets[i] ] ) || obj[ dsets[i] ]=="" ){
				return this.seldsets ( obj[ dsets[i] ] , dsets , i );
			}
		}
		return obj;
	}
	
	
	dataRepeat(){
		
	}
	
	allowedInputs ( arr ){
		for ( let i in arr ){
			let sel = arr[i];
			for ( let j in sel ){
				let sel2 = sel[j];
				if ( sel2 == "" ){
					arr.splice( i , 1 );
				}
			}
		}
		return arr;
	}
	
	assignElements ( children ){
		for ( let ch = 0 ; ch < children.length ; ch ++ ){
			let selectedCh = children[ch].children;
			if ( selectedCh.length > 0 )
				this.assignElements ( selectedCh );
			
			if (children[ch].dataset)
			this.thisElements.push ( children[ch] );
		}
	}

	bindElements ( ){
		let elems  = 0;
		//console.log(this.thisElements);
		for ( ; elems < this.thisElements.length ; elems ++ ){
			let selectedElement = this.thisElements[ elems ];
			
			let selElemDataset = selectedElement.dataset;
			//console.log(selElemDataset);

			if( typeof selElemDataset.valuectrl != 'undefined' ){
				let selectedIndex = (selElemDataset.valuectrl.split ('.'))[1];
				/* create variable */
				this[ selectedIndex ] = "";
			}
			
			if( typeof selElemDataset.event != 'undefined' ){
				let p = {};
				if ( selElemDataset.params ){
					
					p = JSON.parse( selElemDataset.params.toString() );
				}
				
				let selectedIndex = (selElemDataset.event.split ('.'))[2];
				let eventVerb = (selElemDataset.event.split ('.'))[1];
				//console.log(selectedIndex,eventVerb)
				if( this[ selectedIndex ] ){
					//if ( eventVerb == 'scroll' ) console.log(selectedElement,this[ selectedIndex ],selectedIndex,this)
					//console.log(selectedElement,this[ selectedIndex ],selectedIndex,this)
					//selectedElement.addEventListener ( eventVerb , this[ selectedIndex ].bind ( this, p ) );
					selectedElement['on'+eventVerb] = this[ selectedIndex ].bind ( this, p );
				}
			}
			
		}
		
	}
	
	selfDestruct(){
		delete this;
	}
	

	
	display ( displayObject ){
		
		for ( let obj in displayObject ){
			
			this[ obj ] = displayObject[ obj ];
		}
	}

	
}