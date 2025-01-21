// Service classes
import { Controller } from "../classes/controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SideMenuBar } from "../classes/side.menu.bar.class.js"; 
// import your controller class here
import { HRDashboardController } from "./hr.dashboard.controller.class.js";
import { HREmployeeController } from "./hr.employee.controller.class.js";
import { HREmployeeAttendanceController } from "./hr.employee.attendance.controller.class.js";

export class HRController extends Controller {
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this.subpages = [
			{
				object : new HRDashboardController({
					modalID :  "hr-dashboard",
					controllerName : "HRDashboardController",
					template : "/vims/sources/templates/section/hr.dashboard.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			{
				object : new HREmployeeController({
					modalID :  "hr-employee",
					controllerName : "HREmployeeController",
					template : "/vims/sources/templates/section/hr.employee.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			{
				object : new HREmployeeAttendanceController({
					modalID :  "hr-employee-attendance",
					controllerName : "HREmployeeAttendanceController",
					template : "/vims/sources/templates/section/hr.employee.attendance.template.html",
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
			oppositeDiv : "main-content-hrd",
			menuParentDiv : "#sidebar-hrd",
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
						name : "Employees",
						icon : {
							isClass : false,
							value : "👤",
						},
						func : "",
						isActive : true,
						page : this.subpages[1],
						width : "4.5vh",
					},
					{
						name : "Employee Attendance",
						icon : {
							isClass : false,
							value : "⏲",
						},
						func : "",
						isActive : true,
						page : this.subpages[2],
						width : "4.5vh",
					},
				]
			}
		} );
		smb.renderDiv("sidebar-hrd");
	}
	
	report ( args ){
		
	}
}