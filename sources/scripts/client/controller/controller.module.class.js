/* import your classes here */
import { TopnavController } from "./topnav.controller.class.js";
import { DashboardController } from "./dashboard.controller.class.js";
import { ResidentsController } from "./residents.controller.class.js";
import { ClerkController } from "./clerk.controller.class.js";
import { LuponController } from "./lupon.controller.class.js";
import { HRController } from "./hr.controller.class.js";
import { ProjectsController } from "./projects.controller.class.js";
import { HealthCenterController } from "./health.center.controller.class.js";
import { LoginPage } from "./login.page.js";
import { MainService } from "../classes/main.service.class.js";


export class ControllerModule {
	
	static controllers = {
		"topnav" : {
			controller : TopnavController,
			init : false,
			elem : ".topnav",
			initobj : null,
			
		},
		"dashboard" :  {
			controller : DashboardController,
			init : false,
			elem : ".dashboard",
			initobj : null,
			current : false,
		},
		
		"clerk" :  {
			controller : ClerkController,
			init : false,
			elem : ".clerk",
			initobj : null,
			current : false,
		},
		
		"loginpage" :  {
			controller : LoginPage,
			init : false,
			elem : ".login",
			initobj : null,
			current : false,
		},

		"residents" :  {
			controller : ResidentsController,
			init : false,
			elem : ".residents",
			initobj : null,
			current : false,
		},
		
		"lupon" :  {
			controller : LuponController,
			init : false,
			elem : ".lupon",
			initobj : null,
			current : false,
		},
		
		
		"hrd" :  {
			controller : HRController,
			init : false,
			elem : ".hrd",
			initobj : null,
			current : false,
		},
		
		"projects" :  {
			controller : ProjectsController,
			init : false,
			elem : ".projects",
			initobj : null,
			current : false,
		},
		
		"healthcenter" :  {
			controller : HealthCenterController,
			init : false,
			elem : ".healthcenter",
			initobj : null,
			current : false,
		},
	}
	
	
	static Service = new MainService ( '/vims/sources' );
	
	constructor (){
		//alert("aaahhss");
		//console.log(ControllerModule.Service);
	}

	static initializeControllers (){
		
		let controllerDOM = document.querySelectorAll ( 'div' );
		
		for ( let divctrl in controllerDOM ){
			if (controllerDOM[divctrl]['dataset']){
				let controller = controllerDOM[divctrl]['dataset']['controller'];
				if ( controller ){
					//setTimeout ( ( ) => {
						/* if(!ControllerModule.controllers[controller])
						{
							console.log(controller,"ccccccc");
						}
						else 	console.log(controller,"ddddddd"); */
						
						if ( !ControllerModule.controllers[controller]['init'] || controller != 'topnav' ){
							ControllerModule.controllers[controller]['init'] = true;
							//console.log(controller,ControllerModule.controllers[controller]['init'])
							let elem = ControllerModule.controllers[controller]['elem'];
							
							if(controller !== 'loginpage'){
								//ControllerModule.Service['socketclient'] = ControllerModule.SocketClient;
								//console.log('conn');
								//turn on socket
								ControllerModule.Service.socketON();
							}
							else{
								
							}
							
							/* refresh controllers */
							if (ControllerModule.controllers[controller]['initObj'])
								ControllerModule.controllers[controller]['initObj'].unbinds();
							
							let ctr = new ControllerModule.controllers[controller]['controller'](controller,ControllerModule.Service,elem)
							//console.log(ctr);
							//ctr.binds (controller,elem);
							//console.log ( ctr );
							//ControllerModule.controllers[controller]['current'] = true;
							//controller object
							ControllerModule.controllers[controller]['initObj'] = ctr;
						}
					//},300);
				}
				
			}
		}
		//console.log(ControllerModule.controllers);
		return;
		
	}
	/**/

}


