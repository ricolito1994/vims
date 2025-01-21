// Service classes
import { Controller } from "../classes/controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SideMenuBar } from "../classes/side.menu.bar.class.js"; 
// import your controller class here
import { ResidentsDashboardController } from "./residents.dashboard.controller.class.js";
import { ResidentsSectionController } from "./residents.section.controller.class.js";
//import { ResidentsBusinessController } from "./residents.business.controller.class.js";
import { ResidentialMapController } from "./residents.map.controller.class.js";
import { ResidentsPurokController } from "./residents.purok.controller.class.js";
import { ResidentsBarangayController } from "./residents.barangay.controller.class.js";

export class ResidentsController extends Controller {
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this.subpages = [
			/*{
				object : new ResidentsDashboardController({
					modalID :  "resident-dashboard",
					controllerName : "ResidentDashboardController",
					template : "/vims/sources/templates/section/resident.dashboard.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},*/
			{
				object : new ResidentsSectionController({
					modalID :  "resident-section",
					controllerName : "ResidentSectionController",
					template : "/vims/sources/templates/section/resident.section.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			/*{
				object : new ResidentsBusinessController({
					modalID :  "resident-business",
					controllerName : "ResidentSectionController",
					template : "/vims/sources/templates/section/resident.business.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},*/
			{
				object : new ResidentsPurokController({
					modalID :  "resident-purok",
					controllerName : "ResidentPurokController",
					template : "/vims/sources/templates/section/resident.purok.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			{
				object : new ResidentsBarangayController ({
					modalID :  "resident-barangay",
					controllerName : "ResidentsBarangayController",
					template : "/vims/sources/templates/section/resident.barangay.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			/*{
				object : new ResidentialMapController({
					modalID :  "residential-map",
					controllerName : "ResidentialMapController",
					template : "/vims/sources/templates/section/residential.map.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},*/

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
			oppositeDiv : "main-content-residents",
			menuParentDiv : "#sidebar-residents",
			defaultIndex : 0,
			args : {
				menus : [
					/*{
						name : "Dashboard",
						icon : {
							isClass : false,
							value : "&#127968;",
						},
						func : "",
						isActive : true,
						page : this.subpages[0],
						width : "4.5vh",
					},*/
					{
						name : "Residents",
						icon : {
							isClass : false,
							value : "&#128106;",
						},
						func : "",
						page : this.subpages[0],
					},
					/*{
						name : "Businesses",
						icon : {
							isClass : false,
							value : "🏬",
						},
						func : "",
						page : this.subpages[2],
					},*/
					{
						name : "Zone Setup",
						icon : {
							isClass : false,
							value : "🚩",
						},
						func : "",
						page : this.subpages[1],
					},
					{
						name : "Barangay Setup",
						icon : {
							isClass : false,
							value : "🏬",
						},
						func : "",
						page : this.subpages[2],
					},
					/*{
						name : "Residential Map",
						icon : {
							isClass : false,
							value : "&#127758;",
						},
						func : "",
						page : this.subpages[3],
						width : "4.5vh",
					},*/
					
				]
			}
		} );
		smb.renderDiv("sidebar-residents");
	}
	
	report ( args ){
	}
}