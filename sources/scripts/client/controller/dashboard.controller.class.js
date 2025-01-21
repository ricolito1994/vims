import { Controller } from "../classes/controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
//import { ItemMasterDataWidgetController } from "./itemmasterdata.widget.controller.class.js"; 
//import { ItemMasterDataStatusWidgetController } from "./itemmasterdata.item.status.widget.controller.js"; 

export class DashboardController extends Controller{
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this[controller] = { 
			fullname : session_data.FIRSTNAME +' '+session_data.LASTNAME,
			position : session_data.POSITION,
			designation : session_data.DESIGNATION,
			datetoday : this.mainService.getCurrentDate(),
			timern : '',
			transactions : 0,
			noitems : 0,
			expireditems : 0,
			alertqty : 0,
		};	
		this.mainService.getCurrentTimeTick(()=>{
			//console.log(this.mainService.time());
			this[controller] .timern = this.mainService.time();
			//this.latestActivity(this.mainService.time()	);
			this.bindChildObject(this,false);
		});
		//console.log("AA");
		
		setTimeout(()=>{
			this.initialize();
			this.binds (controller,elem);
			this.bindChildObject(this,false);
		},100);
		
	}
	
	initialize(){
		/* let itemmasterdataWidget = new ItemMasterDataWidgetController ({
			modalID :  "item-master-data-widget",
			controllerName : "itemmasterdataWidget",
			template : "/vims/sources/templates/section/itemmasterdata.widget.template.html",
			parent : this,
			isUpdate : true,
			args : []
		});
		itemmasterdataWidget.renderDiv("dashboard-item-master-data-widget");
		
		let itemmasterdataStatusWidget = new ItemMasterDataStatusWidgetController ({
			modalID :  "item-master-data-status-widget",
			controllerName : "itemmasterdataStatusWidget",
			template : "/vims/sources/templates/section/itemmasterdata.status.widget.template.html",
			parent : this,
			isUpdate : true,
			args : []
		});
		itemmasterdataStatusWidget.renderDiv("dashboard-item-master-data-status-widget"); */
	}
	
	report ( args ){
		
	}
}