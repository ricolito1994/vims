import { Modal } from "../classes/modal.controller.class.js";
import { GoogleMapsAPI } from "../classes/google.maps.api.class.js";
import { NewLocationModalController } from "../controller/new.location.modal.controller.class.js";
import { ResidentSearchModal } from "../controller/residents.search.modal.controller.js";

export class GoogleMapsAPIWidget extends Modal {
	
	constructor ( modalData ){
		super (modalData);
		this.SearchPlacesBar = "";
	}
	
	constructs (){
		this.modalData.args[ "ADDITIONAL_HOOKS" ] = {
			//LOCATIONS_DATA : this.loadLocations(),
			parent : this,
			MARKERS : {
				events : {
					click  : this.newLocation,
					//rightclick : this.removeMarker,
				}
				
			}
		}
		this.gmap = new GoogleMapsAPI(this.modalData.args);
		this.gmap.loadLocations();
	}	
	
	/* result from a query */
	loadLocations () {
		return new Promise ( async (resolve, reject) => {
			try {
				let locations = [];
				let DefaultLocation = {
					LATITUDE: this.modalData.args.LAT,
					LONGITUDE: this.modalData.args.LNG,
					VALUE: {
						content : 
							`<div style="font-size:20px;text-align:center">
								<img width="40" src="/vims/sources/complist/mansilingan_bcd/logos/${session_data.BARANGAY_LOGO}">
							</div>
							<div class="shadow-marker" style="font-size:15px;text-align:center;">
								${session_data.BARANGAY_NAME}
							</div>`,
					},
					LID: 1,
				};
				locations.push(DefaultLocation);
				let addedLocations = await this.mainService.getLocations();
				for (let location in addedLocations) {
					location = addedLocations[location];
					let locdata = {
						LATITUDE : location.LAT,
						LONGITUDE : location.LNG,
						VALUE : {
							content: `<div style="font-size:20px;text-align:center">${location.ICON}</div>`
						},
						LID : location.FOREIGN_KEY,
						ARG : location,
					};
					locations.push(locdata);
				}
				resolve(locations);
			} catch (e) {
				reject(e);
			}
		})
	}
	
	removeLocation (mkid){
		return new Promise ( ( resolve , reject ) => {
			let requestCheck = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : `delete FROM vims.barangay_land_marks WHERE FOREIGN_KEY = ?`,
								db : 'DB',
								values : [mkid]
							},	
						]
					}
							
				}
			};
			this.mainService.serverRequest ( requestCheck , ( args ) => {
				resolve("deleted");
			});
		}); 
		
	}
	
	changeFilter(){
		this.bindChildObject(this,this.elem);
	}
	
	newLocation (...args) {
		let context = this ? this : args[0];
		if (!this) {
			let locationDetails = args[1]['ARG'];
			locationDetails['myLocation'] = {
				lat : parseFloat(locationDetails.LAT),
				lng : parseFloat(locationDetails.LNG),
			}
			context.gmap.relocate(false, locationDetails);
		}	
		let locationObject = args.length == 1 ? {
			close : "onCloseAddLoc",
			save : "onSaveLoc",
			MKID : args[0].id,
			LOC_ID : args[0]['LOC_ID'] ? false : args[0]['LOC_ID'],
			POS : {
				LAT : args[0].gm ? args[0].gm.latLng.lat() : 0,
				LNG : args[0].gm ? args[0].gm.latLng.lng() : 0,
			}
		} : {
			close : "onCloseAddLoc",
			save : "onSaveLoc",
			args : args[1]['ARG'],
		}

		let nl = new NewLocationModalController({
			modalID :  "new-location-modal",
			controllerName : "NewLocationModalController",
			template : "/vims/sources/templates/modal/new.location.modal.template.html",
			parent : context,
			args : locationObject,
		});
		nl.render();
	}
	
	onSaveLoc (args) {
		let result = args.detail.query;
		this.gmap.newLocation(result);
	}
	
	onCloseAddLoc () {
		this.gmap.closeInfoWindowMarkers();
	}
	
	onSearchLocation (...args){
		let details = args[0].detail;
		this.gmap.closeInfoWindowMarkers();
		this.gmap.relocate (false, details);
	}
	
	removeMarker( ...args ){
		/* //console.log(args);
		setTimeout ( async ( )=> {
			let lat = (args[1].latLng.lat());
			let lng = (args[1].latLng.lng());
			let mkd = args [0];
			//console.log(mkd);
			let indx = this.gmap.markers.findIndex ( x => x.lat == lat && x.lng == lng );
			if (confirm("Are you sure you want to remove this location?")){
				await this.removeLocation( mkd );
				this.gmap.markers[ indx ][ 'marker' ].setMap (null);
			}
		},300); */
	}
	
	
	returnBaseLocation ( ){
		//this.SearchPlacesBar =  this.modalData.args.DEFAULT_LOCATION;
		this.gmap.closeInfoWindowMarkers();
		this.gmap.relocate(true);
		this.bindChildObject (this, false);	
	}
	
	searchLocation () {
		this.gmap.closeInfoWindowMarkers();
		let rsm = new ResidentSearchModal({
			modalID :  "residentSearchModal",
			controllerName : "ResidentSearchModal",
			template : "/vims/sources/templates/modal/residents.search.modal.template.html",
			params : {
				onSearchLocation : ':onSearchLocation',
			},
			parent : this,
		});
		rsm.render();
	}
	
	init(){
	}
}	