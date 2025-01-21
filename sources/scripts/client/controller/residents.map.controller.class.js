import { Modal } from "../classes/modal.controller.class.js"
import { GoogleMapsAPIWidget } from "../classes/google.maps.api.widget.class.js";


export class ResidentialMapController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
	}
	
	constructs() {
		let gmapsWidget = new GoogleMapsAPIWidget ({
			parent : this,
			controllerName : "GoogleMapsWidgetAPIController",
			template : "/vims/sources/templates/section/google.maps.widget.template.html",
			modalID : "GoogleMapsWidgetAPI",
			args : {
				//API KEY
				API : 'AIzaSyDnXTIoNC48BDf-rr-GmSUjWQ1tCh-Kqhk' ,
				LAT : 10.242244613071563,
				LNG : 123.01290747578719,
				//DEFAULT_LOCATION : `${session_data.COMPANY_NAME} ${session_data.CITY} ${session_data.PROVINCE}`,
			},
		});
		gmapsWidget.renderDiv("residential-map-container");
	}
	
	newLocation() {
	}
	
	init() {
	}
}