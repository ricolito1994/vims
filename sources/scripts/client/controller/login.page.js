import { Controller } from "../classes/controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";


export class LoginPage extends Controller{
	
	constructor ( controllerName , service , elem ){
		super ( controllerName , service , elem );
		//console.log (this.mainService.urls["generic"].url);
		this[controllerName] = { 
			username : "" , 
			password : "" 
		};	
		
		//console.log("AA");
		this.binds (controllerName,elem);
		this.bindChildObject(this,false);
		
	}
	
	login_on_enter ( ...arg ){
		let enter = arg[1]['key'] == 'Enter';
		if ( enter ) this.login();
	}
	
	
	login (  ){
		this.bindChildObject(this,true);
		//console.log(this.username , this.password);
		
		let login_request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT *,u.ID as ID FROM vims.barangay_emp_setup as u 
							INNER JOIN vims.barangay_setup c  
							ON u.BARANGAY_ID = c.BARANGAY_ID 
							INNER JOIN vims.barangay_res_setup p 
							ON u.RESIDENT_ID = p.RESIDENT_ID 
							WHERE u.USERNAME = ? and u.PASSWORD = ?`,
							query_request : 'GET',
							index : 'login',
							values : [
								escape (this.username),
								escape (this.password)
							]
						}
					]
				}
						
			}
		};
		
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/vims/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		
		
		load.render();
		//console.log(login_request);
		this.mainService.serverRequest( login_request , ( res ) => {
		
			let result = JSON.parse( res )['login'];
			let loginsuccess = false;
			console.log(result);
			if (result.length > 0){
				loginsuccess = !loginsuccess;
			}
			setTimeout ( ( ) => {
				
				if ( loginsuccess ){
					result[0]['SESSION_ID_DATA'] = this.mainService.makeid(24);
					this.mainService.serverRequest( {
						type: "POST",
						url : this.mainService.urls["auth"]['url'],
						data : {
							data : {
								request : 'login',
								login_data : result,
							}
									
						}
					} , 
					( res ) => {
						location.reload();
						
					},
					(err) => {
						console.error(err);
					});
				}
				else{
					
					document.querySelector("#login-errmsg").className="alert alert-danger";
				}
				
				load.onClose();
			
			},2000);
			
		} 
		, ( res ) => {
			//err
			console.error(res);
		}); 
	}
	
}