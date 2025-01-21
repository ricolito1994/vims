import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";

export class HealthCenterRecordsController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.brgyname = session_data.BARANGAY_NAME;
		this.fullname = "";
		this.address = "";
	}
	
	constructs(){
		this.dataTable = new DataTableService({
			template : "/vims/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : this.controllerName,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".resident-table-container",
			filterElems : [],
			fields : [
				{
					head : "IMAGE",
					elements : [
						{
							createElement : "img",
							attributes : [
								{
									attribute : "src",
									value : ( selData ) => {
										//console.log(selData);
										//if (selData['IMG'] && selData['IMG']=='')
										return '/vims/sources/images/prof.jpg';
										//else
										//return '';
									},
								},
								{
									attribute : "style",
									value : ( selData ) => {
										return "width:10%;border:1px solid #ccc;";
									},
								}
								
							]
						}
					]
				},
				{
					head : "FULLNAME",
					sort : {
						asc : ['emplast'],
						dsc : ['-emplast'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										return `${selData['FIRSTNAME']} ${selData['LASTNAME']} ${selData['MIDDLENAME']}`;
									},
								}
							]
						}
					]
				},
				{
					head : "ADDRESS",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['ADDRESS'];
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
									value : ( arg ) => {
										//this.openitem(arg);
										//this.openwarehouse(arg);
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
				},
			],

		});
		this.init();
	}
	
	changeFilter(){
		
	}
	
	init(){
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "SELECT * FROM vims.barangay_res_setup w WHERE CONCAT(LASTNAME,' ',FIRSTNAME,' ',MIDDLENAME) LIKE ? and w.ADDRESS like ?",
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : ['%'+this.fullname+'%','%'+this.address+'%']
						},	
					]
				}
						
			}
			
		};
		
		this.mainService.serverRequest( dataQuery , ( res ) => {
			
			setTimeout( ( ) => {
				let stds = (JSON.parse(res))['result'];
				
				let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
				console.log(stds);
				this.dataTable.setTableData(stds);
				
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
				//load.onClose();
			
			},300);
		} 
		, ( res ) => {
			//err
			console.log(res);
		});	
	}

}
	