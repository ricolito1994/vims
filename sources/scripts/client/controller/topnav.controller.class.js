import { Controller } from "../classes/controller.class.js";
import { Route } from "../classes/route.class.js";
import { SwitchDesignationModal } from "./switch.account.modal.controller.js";

export class TopnavController extends Controller{
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		this.mainservice = service;
		this[controller] = {
			name : `Hello ! ${session_data.FIRSTNAME} ${session_data.LASTNAME}`,
			companylogo : `/vims/sources/complist/${session_data.BARANGAY_DIR}/logos/${session_data.BARANGAY_LOGO}`,
			position : session_data.POSITION
		}
		this.route_ = new Route();
		//console.log(session_data.COMPANY_LOGO);
		this.ww();
		this.binds (controller,elem);
		this.bindChildObject(this,false);
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'check_url_multi',
					filenames : [
						
						"sources/images/prof.jpg",
					]
																				
				}
															
			}
		};
		this.mainService.serverRequest( request , ( res ) => {
			//resolve (res);
			//console.log(res);
			document.querySelector('#top-profpic').src = res;								
		},
		(err) => {
			//reject ( err );
		} );
		//alert(this.mainService.isAdministrator)
		if (!this.mainService.isAdministrator){
			//$("#settings").hide();
			$("#switch-account-menu").hide();
		}
		
		if (!this.mainService.isPropertyCustodian && !this.mainService.isAdministrator)
			$("li.nav-item a#settings").hide();
	}
	
	ww (){
		//setTimeout ( ( )=> {
			let navs = document.querySelectorAll('.nav-link');
			let curr = window.location.search.split('?')[1];
			//console.log(session_data);
			for ( let i in navs ){
				let sel = navs[i];
				if (sel.id){
					let nv = document.querySelector ('#'+sel.id);
					if ( sel.id == curr )
						nv.className = 'nav-link active';
					else
						nv.className = 'nav-link';
				}
			}
			
			//console.log(curr);
			
			if (!curr){
				document.querySelector('#dashboard').className = 'nav-link active';
			}
			else{
				document.querySelector('#dashboard').className = 'nav-link';
			}
			
			//console.log(window.location.search.split('?')[1]);
		//},100);
		
		
	}
	
	switchDesignation(){
		let s = new SwitchDesignationModal ({
			modalID :  "switchDesignation",
			controllerName : "SwitchDesignation",
			template : "/vims/sources/templates/modal/switch.account.modal.template.html",
			parent : this,
		});
		
		s.render();
	}
	
	onSwitchAccount ( ...args ){
		//console.log(args);
		let t = args[0].detail.query.TYPE;
		session_data['POSITION'] = t;
		session_data['SESSION_ID_DATA'] = this.mainService.makeid(24);
		this.mainService.serverRequest( {
			type: "POST",
			url : this.mainService.urls["auth"]['url'],
			data : {
				data : {
					request : 'SWITCH_ACCOUNT',
					login_data : session_data,
				}
									
			}
		} , 
		( res ) => {
			//this.mainservice.SocketClient._onDisconnect();
			location.reload();		
		},
		(err) => {
			console.error(err);
		});
	}
	
	route ( params ){
		//alert(params.path);
		let path = (Route.routes[params.path]['url']);
		window.history.pushState("", "", '/vims/?'+params.path);
		
		//this.path = params.path;
		
		
		/* setTimeout ( ( )=> {
			for ( let i in navs ){
				let s = navs[i];
				
				if (s.id == params.path){
					s.className = 'nav-link active';
				}
				else
				s.className ='nav-link'; 
				console.log(s.id);
				
			}
		
		},1000); */
		//console.log(params.path);
		this.route_.load( Route.routes[ params.path ]["url"] );
		this.ww();
		//location.reload();
		
	}
	
	
	logout(){
		this.mainService.serverRequest( {
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
			location.reload();
						
		},
		(err) => {
			console.error(err);
		});
	}
	
	
}