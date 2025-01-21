import { ControllerModule } from "../controller/controller.module.class.js";

export class Route{
	static routes = {
		"" : {
			url : ""+prot+"://"+ipaddress+"/vims/sources/templates/pages/dashboard.page.template.html",
		},
		
		"settings" : {
			url : ""+prot+"://"+ipaddress+"/vims/sources/templates/pages/settings.page.template.html",
		},
		
		"residents" : {
			url : ""+prot+"://"+ipaddress+"/vims/sources/templates/pages/residents.page.template.html",
		},
		
		"clerk" : {
			url : ""+prot+"://"+ipaddress+"/vims/sources/templates/pages/clerk.page.template.html",
		},
		
		"lupon" : {
			url : ""+prot+"://"+ipaddress+"/vims/sources/templates/pages/lupon.page.template.html",
		},
	
		"hr" : {
			url : ""+prot+"://"+ipaddress+"/vims/sources/templates/pages/hr.page.template.html",
		},
		
		"projects" : {
			url : ""+prot+"://"+ipaddress+"/vims/sources/templates/pages/projects.page.template.html",
		},
		
		"healthcenter" : {
			url : ""+prot+"://"+ipaddress+"/vims/sources/templates/pages/health.center.page.template.html",
		},
		
	}
	constructor ( ){
		this.cm = new ControllerModule();
	}
	
	load ( e , path ) {
		//console.log (e);
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function (e) { 
			if (xhr.readyState == 4 && xhr.status == 200) {	
				
			
				if (document.getElementById("container-pages")){
					document.getElementById("container-pages").innerHTML = "";
					document.getElementById("container-pages").innerHTML = xhr.responseText;
				}
				 
				ControllerModule.initializeControllers();
				
			}
		  }
		
		xhr.open("GET", e, true);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.setRequestHeader("Pragma", "no-cache");
		xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		xhr.send();
	}
	
}