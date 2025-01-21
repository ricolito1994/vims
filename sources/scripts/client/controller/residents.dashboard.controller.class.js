import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { ResidentsModalController } from "./residents.modal.controller.class.js";

export class ResidentsDashboardController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.NEXT_SCAN = 30; // 30 DAYS
		this.fullname = "-";
		this.address = "-";
		this.searchDate = this.mainService.getCurrentDate();
		this.isUpdate = false;
		this.scanObject = {
			RES_ID : '',
			DATE_SCAN : this.mainService.getCurrentDate(),
			TIME_SCAN : this.mainService.time(),
			CLERK : '',
			DESCRIPTION : 'For cash assistance',
		}
	}
	
	
	constructs(){
		var html5QrcodeScanner = new Html5QrcodeScanner("qrcode11", { fps: 10, qrbox: 250 });
			html5QrcodeScanner.render(this.ScanSuccess.bind(this), this.ScanError.bind(this));

		this.dataTable = new DataTableService({
			template : "/vims/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : this.controllerName,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".scans-table-container",
			filterElems : [],
			fields : [
				{
					head : "ID",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['ORDER_SCAN'];
									},
								}
							]
						}
					]
				},
				{
					head : "NAME",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['NAME'];
									},
								}
							]
						}
					]
				},
				{
					head : "ADDRESS",
					sort : {
						asc : ['ADDRESS'],
						dsc : ['-ADDRESS'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
											
										return `${selData['ADDRESS']}`;
									},
								}
							]
						}
					]
				},

				{
					head : "ACTION",
					elements : [
						{	
							createElement : "a",
							attributes : [
								{
									attribute: "href",
									value : "javascript:void(0);",
								},
								{
									attribute: "className",
									value : "btn btn-primary",
								},
								{
									type : "event",
									attribute : "click",
									value : async (argss) => {
										let residentOtherDetails = 
											await this.mainService.getResidentOtherDetails(argss);
										this.openResidentModal(residentOtherDetails);
									},
								}
							],
							children : [
								{
									createElement : "i",
									attributes : [
										{
											attribute: "className",
											value : "icon-search",
										}
									]
								}
							]
						},
						{	
							createElement : "span",
							attributes:[
								{
									attribute:"innerHTML",
									value : "&nbsp;"
								}
							]
						},
						{	
							createElement : "span",
							attributes:[
								{
									attribute:"innerHTML",
									value : "&nbsp;"
								}
							]
						},
					]
				}
			],
	
		});
		this.initTableScans();
	}

	openResidentModal (args) {
		console.log('args', args)
		let nl = new ResidentsModalController({
			modalID :  "residents-modal",
			controllerName : "ResidentsModalController",
			template : "/vims/sources/templates/modal/residents.modal.template.html",
			parent : this,
			isUpdate : true,
			args : args,
			onSearchEvent : `${this.controllerName}:onUpdateResidents`,
		});
		nl.render();
	}

	initTableScans () {
		let sql = 
		`SELECT 
			brs.*,
			CONCAT(brs.FIRSTNAME,' ',brs.LASTNAME) as NAME, 
			CONCAT(brss.FIRSTNAME,' ',brss.LASTNAME) as CLERK,
			brs.ADDRESS,
			s.ID as ORDER_SCAN,
			s.TIME_SCAN,
			s.DATE_SCAN
			FROM scan s 
			INNER JOIN barangay_res_setup brs ON s.RES_ID = brs.RESIDENT_ID 
			INNER JOIN barangay_emp_setup bes ON bes.ID = s.CLERK 
			INNER JOIN barangay_res_setup brss ON brss.RESIDENT_ID = bes.RESIDENT_ID 
			WHERE DATE_SCAN = ?
			ORDER BY s.ID DESC`;
		
			let dataQuery = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : sql,
								db : 'DB',
								query_request : 'GET',
								index : 'result',
								values : [this.searchDate],
							},	
						]
					}
							
				}
			};
			
			this.mainService.serverRequest( dataQuery , ( res ) => {
				
				setTimeout( ( ) => {
					let stds = (JSON.parse(res))['result'];
					
					let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
					//console.log(stds);
					this.dataTable.setTableData(stds);
					
					this.dataTable.setPaginateCtr(d);
					this.dataTable.construct();
					//load.onClose();
				
				},110);
			} );
	}

	changeValues () {
		this.bindChildObject(this,this.elem);
		this.initTableScans();
	}
	
	ScanSuccess(decodedText, decodedResult) {
		// Handle on success condition with the decoded text or result.
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : 
								`SELECT w.*,
								S.ID,
								S.DATE_SCAN,
								CONCAT(w.LASTNAME,' ',w.FIRSTNAME) FNAME 
								FROM vims.barangay_res_setup w 
								LEFT JOIN scan S ON S.RES_ID = w.RESIDENT_ID 
								WHERE w.RESIDENT_ID = ?`,
								/* `SELECT w.*
								FROM vims.barangay_res_setup w 
								WHERE w.RESIDENT_ID = ?`, */
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [`${decodedText}`],
						},	
					]
				}
						
			}
		};
		
		this.mainService.serverRequest( dataQuery , ( res ) => {
			let stds = (JSON.parse(res))['result'][0];
			let $stopCameraButton = document.getElementById("html5-qrcode-button-camera-stop");
			if ($stopCameraButton) $stopCameraButton.click();
			if(stds){
				//this.saveScan(stds);
				let nextScan = this.mainService.addDays(stds.DATE_SCAN,this.NEXT_SCAN);
				let daysPassedTilNextScan = this.mainService.calculateDaysPassed (this.mainService.getCurrentDate(), nextScan, true);
				if (daysPassedTilNextScan.value <= 0) {
					this.saveScan(stds);
				} else {
					alert (`SORRY ${stds.FNAME}, you have  ${daysPassedTilNextScan.value} days left to claim!`)
				}
				this.binds(this.controllerName,'#'+this.modalID);
				this.bindChildObject ( this , false );
			}
			else{
				alert("Data not found!");
			}
		});
	}
	
	ScanError(errorText){
		console.log('errorText', errorText)
		//alert(`${errorText}`);
	}
	
	saveScan(resident) {
		this.scanObject.RES_ID = resident.RESIDENT_ID;
		this.scanObject.CLERK = session_data.ID;

		this.bindChildObject(this,true);
		let saveparams = ( ServerRequest.queryBuilder( this.mainService.object2array(this.scanObject) , this.isUpdate ? "UPDATE" : "INSERT" ) );
		let sql1 = !this.isUpdate ? `INSERT INTO scan ${saveparams.initial} VALUES ${saveparams.seconds}` :
									`UPDATE scan ${saveparams.initial} where PRK_ID = ""`;
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						
						{
							sql : sql1,
							db : 'DB',
							query_request : "INSERT",
							values : saveparams.values
						},	
						
					]
				}
						
			}
			
		};

		//console.log(dataQuery)
		this.mainService.serverRequest(dataQuery , async (res) => {
			/* MainService.EventObject[this.modalData.parent.controllerName].dispatch (`${this.modalData.onSearchEvent}` , {
				detail : {
					query : {
							
					}
				} 
			}); */
			//alert(`Scan Success!`);
			//console.log(resident)
			let residentOtherDetails = 
				await this.mainService.getResidentOtherDetails(resident);
				this.openResidentModal(residentOtherDetails);
			this.initTableScans();
		} 
		, ( err ) => {
			console.log(err)
		});	
	}

}
	