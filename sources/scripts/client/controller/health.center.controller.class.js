// Service classes
import { Controller } from "../classes/controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SideMenuBar } from "../classes/side.menu.bar.class.js"; 
// import your controller class here
import { HealthCenterDashboardController } from "./health.center.dashboard.controller.class.js";
import { HealthCenterRecordsController } from "./health.center.records.controller.class.js";
import { HealthCenterMapController } from "./health.center.map.controller.class.js";

export class HealthCenterController extends Controller {
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this.subpages = [
			{
				object : new HealthCenterDashboardController({
					modalID :  "health-center-dashboard",
					controllerName : "HealthCenterDashboardController",
					template : "/vims/sources/templates/section/health.center.dashboard.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			{
				object : new HealthCenterRecordsController({
					modalID :  "health-center-records",
					controllerName : "HealthCenterRecordsController",
					template : "/vims/sources/templates/section/health.center.records.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			{
				object : new HealthCenterMapController({
					modalID :  "health-center-map",
					controllerName : "HealthCenterMapController",
					template : "/vims/sources/templates/section/health.center.map.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			
		];
		
		setTimeout(()=>{
			this.initialize();
			this.binds (controller,elem);
			this.bindChildObject(this,false);
		},100);
	}
	
	initialize(){
		let smb = new SideMenuBar ( {
			modalID :  "side-menu-bar",
			controllerName : "SideMenuBar",
			template : "/vims/sources/templates/section/side.menu.bar.section.template.html",
			parent : this,
			isUpdate : true,
			isRestored : false,
			oppositeDiv : "main-content-healthcenter",
			menuParentDiv : "#sidebar-healthcenter",
			defaultIndex : 0,
			args : {
				menus : [
					{
						name : "Dashboard",
						icon : {
							isClass : false,
							value : "&#127968;",
						},
						func : "",
						isActive : true,
						page : this.subpages[0],
						width : "4.5vh",
					},
					{
						name : "Health Center Records",
						icon : {
							isClass : false,
							value : "📃",
						},
						func : "",
						isActive : true,
						page : this.subpages[1],
						width : "4.5vh",
					},
					{
						name : "Health Center Map",
						icon : {
							isClass : false,
							value : "&#127758;",
						},
						func : "",
						isActive : false,
						page : this.subpages[2],
						width : "4.5vh",
					},
				]
			}
		} );
		smb.renderDiv("sidebar-healthcenter");
	}
	
	report ( args ){
		
	}
}