import { MainService } from "./main.service.class.js";
import { LoadingModal } from "../controller/loading.modal.controller.class.js";

export class GoogleMapsAPI {
	constructor (GOOGLE_MAPS_OBJECT) {
		this.GOOGLE_MAPS_OBJECT = GOOGLE_MAPS_OBJECT;
		this.API_KEY = this.GOOGLE_MAPS_OBJECT.API;
		this.BASE_LOCATION = {
			lat : this.GOOGLE_MAPS_OBJECT.LAT,
			lng : this.GOOGLE_MAPS_OBJECT.LNG
		};
		this.additionalHooks = this.GOOGLE_MAPS_OBJECT['ADDITIONAL_HOOKS'];
		this.myPanorama = "";
		this.markers = [];
		this.markersForSearch = [];
		//console.log(this.GOOGLE_MAPS_OBJECT);
		  
		if (!window._GoogleMapsApi) {
		  this.callbackName = '_GoogleMapsApi.mapLoaded';
		  window._GoogleMapsApi = this;
		  window._GoogleMapsApi.mapLoaded = this.mapLoaded.bind(this);
		}
		this.loadMapsCallback();
	}
	
	relocate (isRelocateHome, objectLocation) {
		try {
			let map = this.map;
			if (isRelocateHome){
				map.panTo (this.myCenter);
				for ( let ms in this.markersForSearch ){
					this.markersForSearch[ms].setMap( null )
				}
			}
			else{
				let contentInfoWindow =  
					`<div><B>${objectLocation.LOC_NAME}</B></div>
					<div><i style='font-size:11px;'>${objectLocation.FULL_ADDRESS}</i></div>`;

				let indexMarker = this.markers.findIndex (x => x.markerID == objectLocation.FOREIGN_KEY);
				let selectedMarker = this.markers[indexMarker];
				let marker = selectedMarker['marker'];

				for (let i in this.markers) {
					if (this.markers[i].markerID !== selectedMarker.markerID) {
						this.markers[i]['marker'].infoWindowObject.close();
					}
				}
				marker.infoWindow(contentInfoWindow, map, marker.position)
				map.panTo (marker.position);
			}
		} catch (e) {
			console.log(e);
		}
	}
	
	mapLoaded() {
		if (this.resolve) {
		  this.resolve();
		}
	}
	
	load() {
		if (!this.promise) {
		  this.promise = new Promise(resolve => {
			this.resolve = resolve;
			if (typeof window.google === 'undefined') {
			  const script = document.createElement('script');
			  let source = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&callback=${this.callbackName}&libraries=places`;
			  script.src = source;
			  script.async = true;
			  document.body.append(script);
			} else {
			  this.resolve();
			}
		  });
		}
		return this.promise;
	}
	
	static getMyMarker ( params ) {
		class MyMarker extends google.maps.OverlayView {
			constructor(params) {
				super();
				this.position = params.position;
				const content = document.createElement('div');
				content.classList.add('marker');
				content.innerHTML = params.label;
				content.style.position = 'absolute';
				content.style.transform = 'translate(-50%, -100%)';
				const container = document.createElement('div');
				container.style.position = 'absolute';
				container.style.cursor = 'pointer';
				container.appendChild(content);
				this.container = container;
				this.infoWindowObject = new google.maps.InfoWindow();
			}
			addEvent (eventName, event) {
				console.log('event', event)
				this.container.addEventListener(eventName, event);
			}
			onAdd() {
				this.getPanes().floatPane.appendChild(this.container);
			}
			onRemove() {
				this.container.remove();
			}
			draw() {
				const pos = this.getProjection().fromLatLngToDivPixel(this.position);
				this.container.style.left = pos.x + 'px';
				this.container.style.top = pos.y + 'px';
			}
			infoWindow(content, map, position) {
				this.infoWindowObject.setContent(content);
				this.infoWindowObject.setPosition(position);
				this.infoWindowObject.open(map);
			}
		}
		return new MyMarker(params);
	}
	
	loadLocations () {
		let load = new LoadingModal ({
			modalID :  `loading-modal-load`,
			controllerName : `loadingmodal`,
			template : `/vims/sources/templates/modal/loading.modal.template.html`,
			parent : this.GOOGLE_MAPS_OBJECT["ADDITIONAL_HOOKS"]["parent"],
		});
		load.render();
		setTimeout (async () => {
			try{
				let location = await this.additionalHooks.parent.loadLocations ();
				for (let l in location) {
					let loc = location[l];
					let markerLocs = GoogleMapsAPI.getMyMarker({
						position: {
							lat : parseFloat(loc.LATITUDE),
							lng : parseFloat(loc.LONGITUDE),
						},
						label : loc.VALUE.content,
					});
					markerLocs.setMap(this.map);
					for(let eventName in this.additionalHooks.MARKERS.events) {
						let markerEvent = this.additionalHooks.MARKERS.events[eventName];
						if (loc.ARG) {
							markerLocs.addEvent(
								eventName, 
								markerEvent.bind(null, this.additionalHooks.parent, loc)
							);
						}
					}
					this.markers.push ({
						lat : parseFloat(loc.LATITUDE) ,
						lng : parseFloat(loc.LONGITUDE),
						marker : markerLocs,
						markerID : loc.LID,
					});
				}
			} catch(e) {
				alert("refresh your browser");
			}
			load.onClose();
		},2000);
	}

	closeInfoWindowMarkers (markerID) {
		for (let i in this.markers) {
			if (markerID) {
				if (this.markers[i].markerID == markerID) this.markers[i]['marker'].infoWindowObject.close();
			} else {
				this.markers[i]['marker'].infoWindowObject.close();
			}
		}
	}
	
	loadMapsCallback () {
		this.load().then(() => {
		   this.myCenter = new google.maps.LatLng(this.BASE_LOCATION.lat, this.BASE_LOCATION.lng);
			
		   var mapOptions= {
				center: this.myCenter,
				zoom:15, 
				scrollwheel: true,
				draggable: true,
				//mapTypeId:google.maps.MapTypeId.ROADMAP
			 	mapTypeId: "satellite",
		  	};
		  
		  	let map = new google.maps.Map(document.querySelector('#maps-container'),mapOptions);
		  	this.map = map;
		  	this.map.setTilt(45);
		  	let	input = document.getElementById("pac-input");
		  	const searchBox = new google.maps.places.SearchBox(input);
		
		  	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		 
		  
		  	searchBox.addListener("places_changed", ( ...args ) => {
			  	const places = searchBox.getPlaces();
			   	if (places.length == 0) {
				  	return;
				}
			   	const bounds = new google.maps.LatLngBounds();
				// Create a marker for each place.
				for ( let ms in this.markersForSearch ){
					this.markersForSearch[ms].setMap(null)
				}
			   	//console.log(places);

			   	for ( let p in places ){
				  let place = places [p];
				  if (!place.geometry || !place.geometry.location) {
						console.log("Returned place contains no geometry");
						return;
				  }
				  
				  const icon = {
						url: place.icon ,
						size: new google.maps.Size(71, 71),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(25, 25),
				  };
				  this.markersForSearch.push(
					new google.maps.Marker({
					 	map,
					  	icon,
					  	title: place.name,
					  	position: place.geometry.location,
					})
				  );
				 
				  if (place.geometry.viewport) {
					bounds.union(place.geometry.viewport);
				  } else {
					bounds.extend(place.geometry.location);
				  }
			   }
			   map.fitBounds(bounds);
		  	});

		  	google.maps.event.addListener(map, 'rightclick', (event) => {
				let mapZoom = map.getZoom();
				let startLocation = event.latLng;
				console.log("wew");
				//console.log(startLocation.lat(),startLocation.lng());
				setTimeout(() => {
					if(mapZoom == map.getZoom()){
						//console.log(event.latLng.lat(),event.latLng.lng())
						const infowindow = new google.maps.InfoWindow({
							content: "<b>-</b>",
						});
						/* 
						let markerLocs = new google.maps.Marker({
							position: startLocation,
							map: map,
						});
						markerLocs.addListener ( "click" , ( args ) => {
							console.log(args);
							alert("WEW");
						});
						markerLocs.addListener ( "rightclick" , ( args ) => {
							let lat = (args.latLng.lat());
							let lng = (args.latLng.lng());
							let indx = this.markers.findIndex ( x => x.lat == lat && x.lng == lng );
							if (confirm("Are you sure you want to remove this location?"))
								this.markers[ indx ][ 'marker' ].setMap (null);
						});  */
						if (! confirm("Do you want to add this location?"))
							return;
						
						this.GOOGLE_MAPS_OBJECT['ADDITIONAL_HOOKS'].parent.newLocation({
							gm : event,
							id : MainService.MAKE_ID(40),
						});

						this.closeInfoWindowMarkers();
					}
				}, 100);
			});
		});
	}	
	
	newLocation(eventArgs) {
		try {
			let position = {
				lat : parseFloat(eventArgs.LAT),
				lng : parseFloat(eventArgs.LNG),
			}
			let markerLocs = GoogleMapsAPI.getMyMarker({
				position: position,
				label : `<div style="font-size:20px;text-align:center">${eventArgs.ICN}</div>`,
			});
			markerLocs.setMap(this.map);	
			for(let eventNames in this.additionalHooks.MARKERS.events) {
				let markerEvent = this.additionalHooks.MARKERS.events[eventNames];
				markerLocs.addEvent (eventNames, markerEvent.bind(null, this.additionalHooks.parent, eventArgs));
			}		
			this.markers.push ({
				lat : eventArgs.LAT,
				lng : eventArgs.LNG,
				marker : markerLocs,
				markerID : eventArgs.LID,
			});
			this.relocate (false, eventArgs.ARG)
		} catch(e) {
			console.log(e);
		}
	}
	
}