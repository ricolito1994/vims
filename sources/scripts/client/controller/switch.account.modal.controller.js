import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";

export class SwitchDesignationModal extends Modal{

	constructor ( modalData ){
		super ( modalData );
	}
	
	PROPERTY_CUSTODIAN(){
		this.SWITCH_ACCOUNT("Property Custodian");
	}
	WAREHOUSE_IN_CHARGE(){
		this.SWITCH_ACCOUNT("Warehouse Incharge");
	}
	
	SWITCH_ACCOUNT ( TYPE ){
		//load.render();
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "UPDATE vims.user_setup SET POSITION = ? WHERE ID = ?",
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : [
								TYPE,
								session_data.ID
							]
						},	
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
		
		this.mainService.serverRequest( request , ( res ) => {
			//console.log(res);
			load.onClose();
			MainService.EventObject[this.modalData.parent.controllerName].dispatch (`${this.modalData.parent.controllerName}:onSwitchAccount`, {
				detail : {
					query : {
						TYPE : TYPE			
					}
				} 
			});	
		});
	}
	
	constructs(){
	}
	
	initialize(){	
	}
	
}