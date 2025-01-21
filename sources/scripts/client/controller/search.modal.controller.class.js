import { Modal } from "../classes/modal.controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
/* import your classes here */
import { ResidentsModalController } from "./residents.modal.controller.class.js"
import { PurokModalController } from "./purok.modal.controller.class.js"
import { BarangayModalController } from "./barangay.modal.controller.js"

export class SearchModal extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.fds = { gds:"" };
		this.modalData = modalData;
		this.searchParams = this.modalData.params;
		this.searchObject = {};
		//this.params.instanceID = `${this.mainService.makeid(10)}`;
		this.fieldsDataTable = {
			"resident" :{
				"search_param" : [
					{
						value : "",
						placeholder : "%_placeholder_%",
					}
				],
				"search_dom" : [
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : 'row col-md-7',
							},
							{
								attribute : 'id',
								value : 'dttablefilter',
							},
							
						],
						children : [
								{
									createElement : 'div',
									attributes : [
										{
											attribute : 'className',
											value : "col-sm-12",
										}
									],
									children : [
										{
											createElement : 'input',
											attributes : [
												{
													attribute : 'type',
													value : 'text',
												},
												{
													attribute : 'className',
													value : 'form-control',
												},
												{
													attribute : 'placeholder',
													value : 'Search here...',
												},
												{
													attribute : 'valuectrl',
													type : 'dataset',
													
													value : 'fieldsDataTable.resident.search_param.0.value',
												},
												{
													attribute : 'keyup',
													type : 'event',
													value : ( )=> {
														this.changefilter("request");
													},
												}
												
											],
										}
									],
								}
						],
					},
					
						
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : "row col-md-5 action-buttons",
							}
						],
						children : [
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-warning',
									},			
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-refresh"></i> Refresh Table'
											}
										]
									}
								]
							},
							/* {
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-primary',
									},	
									{
										attribute : 'click',
										type : 'event',
										value : (...args )=> {
											let usm = new ResidentsModalController({
												modalID :  "residents-modal-2",
												controllerName : "ResidentsModalController2",
												template : "/vims/sources/templates/modal/residents.modal.template.2.html",
												parent : this,
												isUpdate : args ? false : true,
												args : args?args : {},
												instanceID : this.mainService.generate_id_timestamp("res"),
												onSearch : true,
												brgyargs : this.params.brgyargs,
												onSearchEvent : this.modalData.instanceID ? `SearchModal${this.modalData.instanceID}:onUpdateSearchTable` : "searchmodal:onUpdateSearchTable",
											});
											usm.render();
										},
									}
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-plus"></i> Add New'
											},
											
										]
									}
								]
							} */
							
						],
					}
						
					
				],
				"fields" : [
					{
						head : "FULLNAME",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['FULLNAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "BIRTHDAY",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['BIRTHDAY'];
										},
									}
								]
							}
						]
					},
					{
						head : "Address",
						elements : [
							{
								createElement : "b",
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
						head : "Actions",
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
										value : "btn btn-success",
									},
									{
										type : "event",
										attribute : "click",
										value : ( arg ) => {
											//console.log ( this.searchParams , arg );
											let actions = {
												link : ( ) => {
													MainService.EventObject[this.params.controller].dispatch (this.params.controller+this.params.evt , {
														detail : {
															query : {
																FULLNAME : arg['FULLNAME'],
																RESIDENT_ID : arg['RESIDENT_ID'],
																//MEMBER_ID : arg['RESIDENT_ID'],
																BIRTHDAY : arg['BIRTHDAY'],
																HH_LEADER : arg['HH_LEADER'],
																context : this.parent,
																modal : this,
															}
														} 
													});
													//this.onClose();
												}
											};
											
											//console.log(this.params.action);
											actions [ this.params.action ]( );

										},
									}
								],
								children : [
									{
										createElement : "i",
										attributes : [
											{
												attribute: "className",
												value : "icon-plus",
											}
										]
									}
								]
							},
							
						]
					},
				],
				request : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									sql : `SELECT * FROM vims.barangay_res_setup WHERE FULLNAME LIKE ?  AND IS_FAMILY_LEADER = 0 order by ID desc`,
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				}
			},
			
			
			"kagawad" :{
				"search_param" : [
					{
						value : "",
						placeholder : "%_placeholder_%",
					}
				],
				"search_dom" : [
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : 'row col-md-7',
							},
							{
								attribute : 'id',
								value : 'dttablefilter',
							},
							
						],
						children : [
								{
									createElement : 'div',
									attributes : [
										{
											attribute : 'className',
											value : "col-sm-12",
										}
									],
									children : [
										{
											createElement : 'input',
											attributes : [
												{
													attribute : 'type',
													value : 'text',
												},
												{
													attribute : 'className',
													value : 'form-control',
												},
												{
													attribute : 'placeholder',
													value : 'Search here...',
												},
												{
													attribute : 'valuectrl',
													type : 'dataset',
													
													value : 'fieldsDataTable.kagawad.search_param.0.value',
												},
												{
													attribute : 'keyup',
													type : 'event',
													value : ( )=> {
														this.changefilter("request");
													},
												}
												
											],
										}
									],
								}
						],
					},
					
						
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : "row col-md-5 action-buttons",
							}
						],
						children : [
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-warning',
									},			
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-refresh"></i> Refresh Table'
											}
										]
									}
								]
							},
							/* {
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-primary',
									},	
									{
										attribute : 'click',
										type : 'event',
										value : (...args )=> {
											
											let usm = new ResidentsModalController({
												modalID :  "residents-modal-2",
												controllerName : "ResidentsModalController2",
												template : "/vims/sources/templates/modal/residents.modal.template.2.html",
												parent : this,
												isUpdate : args ? false : true,
												args : args?args : {},
												instanceID : this.mainService.generate_id_timestamp("res"),
												onSearch : true,
												onSearchEvent :  this.params.instanceID ? `${this.params.instanceID}:onUpdateSearchTable` : "searchmodal:onUpdateSearchTable",
											});
											usm.render();
										},
									}
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-plus"></i> Add New'
											},
											
										]
									}
								]
							} */
							
						],
					}
						
					
				],
				"fields" : [
					{
						head : "FULLNAME",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['FULLNAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "BIRTHDAY",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['BIRTHDAY'];
										},
									}
								]
							}
						]
					},
					{
						head : "Address",
						elements : [
							{
								createElement : "b",
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
						head : "Actions",
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
										value : "btn btn-success",
									},
									{
										type : "event",
										attribute : "click",
										value : ( arg ) => {
											//console.log ( this.searchParams , arg );
											let actions = {
												link : ( ) => {
													MainService.EventObject[this.params.controller]
														.dispatch (this.params.controller+this.params.evt , {
														detail : {
															query : {
																FULLNAME : arg['FULLNAME'],
																RESIDENT_ID : arg['RESIDENT_ID'],
																//MEMBER_ID : arg['RESIDENT_ID'],
																ADDRESS : arg['ADDRESS'],
																BIRTHDAY : arg['BIRTHDAY'],
																HH_LEADER : arg['HH_LEADER'],
																PRK_NAME :arg ['PRK_NAME'],
																PUROK : arg ['PUROK'],
																context : this.parent,
																modal : this,
															}
														} 
													});
													//this.onClose();
												}
											};
											
											//console.log(this.params.action);
											actions [ this.params.action ]( );

										},
									}
								],
								children : [
									{
										createElement : "i",
										attributes : [
											{
												attribute: "className",
												value : "icon-plus",
											}
										]
									}
								]
							},
							
						]
					},
				],
				request : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									sql : `SELECT *,(SELECT PRK_NAME FROM vims.barangay_prk_setup WHERE PRK_ID = PUROK) AS PRK_NAME FROM vims.barangay_res_setup WHERE FULLNAME LIKE ?  AND IS_BARANGAY_KAGAWAD = 1 order by ID desc`,
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				}
			},

			"resident_leader" :{
				"search_param" : [
					{
						value : "",
						placeholder : "%_placeholder_%",
					}
				],
				"search_dom" : [
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : 'row col-md-7',
							},
							{
								attribute : 'id',
								value : 'dttablefilter',
							},
							
						],
						children : [
								{
									createElement : 'div',
									attributes : [
										{
											attribute : 'className',
											value : "col-sm-12",
										}
									],
									children : [
										{
											createElement : 'input',
											attributes : [
												{
													attribute : 'type',
													value : 'text',
												},
												{
													attribute : 'className',
													value : 'form-control',
												},
												{
													attribute : 'placeholder',
													value : 'Search here...',
												},
												{
													attribute : 'valuectrl',
													type : 'dataset',
													
													value : 'fieldsDataTable.resident_leader.search_param.0.value',
												},
												{
													attribute : 'keyup',
													type : 'event',
													value : ( )=> {
														this.changefilter("request");
													},
												}
												
											],
										}
									],
								}
						],
					},
					
						
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : "row col-md-5 action-buttons",
							}
						],
						children : [
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-warning',
									},			
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-refresh"></i> Refresh Table'
											}
										]
									}
								]
							},
							/* {
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-primary',
									},	
									{
										attribute : 'click',
										type : 'event',
										value : (...args )=> {
											
											let usm = new ResidentsModalController({
												modalID :  "residents-modal-2",
												controllerName : "ResidentsModalController2",
												template : "/vims/sources/templates/modal/residents.modal.template.2.html",
												parent : this,
												isUpdate : args ? false : true,
												args : args?args : {},
												instanceID : this.mainService.generate_id_timestamp("res"),
												onSearch : true,
												onSearchEvent :  this.params.instanceID ? `${this.params.instanceID}:onUpdateSearchTable` : "searchmodal:onUpdateSearchTable",
											});
											usm.render();
										},
									}
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-plus"></i> Add New'
											},
											
										]
									}
								]
							} */
							
						],
					}
						
					
				],
				"fields" : [
					{
						head : "FULLNAME",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['FULLNAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "BIRTHDAY",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['BIRTHDAY'];
										},
									}
								]
							}
						]
					},
					{
						head : "Address",
						elements : [
							{
								createElement : "b",
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
						head : "Actions",
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
										value : "btn btn-success",
									},
									{
										type : "event",
										attribute : "click",
										value : ( arg ) => {
											//console.log ( this.searchParams , arg );
											let actions = {
												link : ( ) => {
													MainService.EventObject[this.params.controller]
														.dispatch (this.params.controller+this.params.evt , {
														detail : {
															query : {
																FULLNAME : arg['FULLNAME'],
																RESIDENT_ID : arg['RESIDENT_ID'],
																//MEMBER_ID : arg['RESIDENT_ID'],
																ADDRESS : arg['ADDRESS'],
																BIRTHDAY : arg['BIRTHDAY'],
																HH_LEADER : arg['HH_LEADER'],
																PRK_NAME :arg ['PRK_NAME'],
																PUROK : arg ['PUROK'],
																context : this.parent,
																modal : this,
															}
														} 
													});
													//this.onClose();
												}
											};
											
											//console.log(this.params.action);
											actions [ this.params.action ]( );

										},
									}
								],
								children : [
									{
										createElement : "i",
										attributes : [
											{
												attribute: "className",
												value : "icon-plus",
											}
										]
									}
								]
							},
							
						]
					},
				],
				request : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									sql : `SELECT *,(SELECT PRK_NAME FROM vims.barangay_prk_setup WHERE PRK_ID = PUROK) AS PRK_NAME FROM vims.barangay_res_setup WHERE FULLNAME LIKE ?  AND IS_FAMILY_LEADER = 1 order by ID desc`,
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				}
			},

			"resident_all" :{
				"search_param" : [
					{
						value : "",
						placeholder : "%_placeholder_%",
					}
				],
				"search_dom" : [
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : 'row col-md-7',
							},
							{
								attribute : 'id',
								value : 'dttablefilter',
							},
							
						],
						children : [
								{
									createElement : 'div',
									attributes : [
										{
											attribute : 'className',
											value : "col-sm-12",
										}
									],
									children : [
										{
											createElement : 'input',
											attributes : [
												{
													attribute : 'type',
													value : 'text',
												},
												{
													attribute : 'className',
													value : 'form-control',
												},
												{
													attribute : 'placeholder',
													value : 'Search here...',
												},
												{
													attribute : 'valuectrl',
													type : 'dataset',
													value : `fieldsDataTable.resident_all.search_param.0.value`,
												},
												{
													attribute : 'keyup',
													type : 'event',
													value : ( )=> {
														this.changefilter("request");
													},
												}
												
											],
										}
									],
								}
						],
					},
					
						
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : "row col-md-5 action-buttons",
							}
						],
						children : [
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-warning',
									},			
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-refresh"></i> Refresh Table'
											}
										]
									}
								]
							},
							/* {
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-primary',
									},	
									{
										attribute : 'click',
										type : 'event',
										value : (...args )=> {
											let usm = new ResidentsModalController({
												modalID :  "residents-modal-2",
												controllerName : "ResidentsModalController2",
												template : "/vims/sources/templates/modal/residents.modal.template.2.html",
												parent : this,
												isUpdate : args ? false : true,
												args : args?args : {},
												instanceID : this.mainService.generate_id_timestamp("res"),
												onSearch : true,
												brgyargs : this.params.brgyargs,
												onSearchEvent : this.modalData.instanceID ? `SearchModal${this.modalData.instanceID}:onUpdateSearchTable` : "searchmodal:onUpdateSearchTable",
											});
											usm.render();
										},
									}
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-plus"></i> Add New'
											},
											
										]
									}
								]
							} */
							
						],
					}
						
					
				],
				"fields" : [
					{
						head : "FULLNAME",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['FULLNAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "BIRTHDAY",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['BIRTHDAY'];
										},
									}
								]
							}
						]
					},
					{
						head : "Address",
						elements : [
							{
								createElement : "b",
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
						head : "Actions",
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
										value : "btn btn-success",
									},
									{
										type : "event",
										attribute : "click",
										value : ( arg ) => {
											//console.log ( this.searchParams , arg );
											let actions = {
												link : ( ) => {
													MainService.EventObject[this.params.controller].dispatch (this.params.controller+this.params.evt , {
														detail : {
															query : {
																FULLNAME : arg['FULLNAME'],
																RESIDENT_ID : arg['RESIDENT_ID'],
																//MEMBER_ID : arg['RESIDENT_ID'],
																BIRTHDAY : arg['BIRTHDAY'],
																HH_LEADER : arg['HH_LEADER'],
																context : this.parent,
																modal : this,
															}
														} 
													});
													//this.onClose();
												}
											};
											actions [ this.params.action ]( );
										},
									}
								],
								children : [
									{
										createElement : "i",
										attributes : [
											{
												attribute: "className",
												value : "icon-plus",
											}
										]
									}
								]
							},
							
						]
					},
				],
				request : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									sql : `SELECT * FROM vims.barangay_res_setup WHERE FULLNAME LIKE ? order by ID desc`,
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				}
			},
			
			"purok" :{
				"search_param" : [
					{
						value : "",
						placeholder : "%_placeholder_%",
					}
				],
				"search_dom" : [
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : 'row col-md-7',
							},
							{
								attribute : 'id',
								value : 'dttablefilter',
							},
							
						],
						children : [
								{
									createElement : 'div',
									attributes : [
										{
											attribute : 'className',
											value : "col-sm-12",
										}
									],
									children : [
										{
											createElement : 'input',
											attributes : [
												{
													attribute : 'type',
													value : 'text',
												},
												{
													attribute : 'className',
													value : 'form-control',
												},
												{
													attribute : 'placeholder',
													value : 'Search here...',
												},
												{
													attribute : 'valuectrl',
													type : 'dataset',
													
													value : 'fieldsDataTable.purok.search_param.0.value',
												},
												{
													attribute : 'keyup',
													type : 'event',
													value : ( )=> {
														this.changefilter("request");
													},
												}
												
											],
										}
									],
								}
						],
					},
					
						
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : "row col-md-5 action-buttons",
							}
						],
						children : [
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-warning',
									},			
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-refresh"></i> Refresh Table'
											}
										]
									}
								]
							},
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-primary',
									},	
									{
										attribute : 'click',
										type : 'event',
										value : (...args )=> {
											let usm = new PurokModalController({
												modalID :  "purok-modal",
												controllerName : "PurokModalController",
												template : "/vims/sources/templates/modal/purok.modal.template.html",
												parent : this,
												isUpdate : args ? false : true,
												args : args ? args : {},
												//instanceID : this.mainService.generate_id_timestamp("res"),
												onSearch : true,
												onSearchEvent :  this.modalData.instanceID ? `SearchModal${this.modalData.instanceID}:onUpdateSearchTable` : "searchmodal:onUpdateSearchTable",
											});
											usm.render();
										},
									}
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-plus"></i> Add New'
											},
											
										]
									}
								]
							}
							
						],
					}
						
					
				],
				"fields" : [
					{
						head : "PRK_NAME",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['PRK_NAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "BARANGAY",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['BARANGAY_NAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "PRK LEADER",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['PRK_LEADER'];
										},
									}
								]
							}
						]
					},
				
					{
						head : "Actions",
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
										value : "btn btn-success",
									},
									{
										type : "event",
										attribute : "click",
										value : ( arg ) => {
											//console.log ( this.searchParams , arg );
											let actions = {
												link : ( ) => {
													MainService.EventObject[this.params.controller].dispatch (this.params.controller+this.params.evt , {
														detail : {
															query : {
																PRK_NAME : arg['PRK_NAME'],
																PRK_ID	 : arg['PRK_ID'],
																context : this.parent,
																modal : this,
															}
														} 
													});
													//this.onClose();
												}
											};
											
											//console.log(this.params.action);
											actions [ this.params.action ]( );

										},
									}
								],
								children : [
									{
										createElement : "i",
										attributes : [
											{
												attribute: "className",
												value : "icon-plus",
											}
										]
									}
								]
							},
							
						]
					},
				],
				request : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									sql : `SELECT PRK.*, BRGY.BARANGAY_NAME, BRGY.BARANGAY_ID,
										CONCAT(RES.FIRSTNAME,' ',RES.LASTNAME) PRK_LEADER FROM 
										vims.barangay_prk_setup PRK 
										LEFT JOIN vims.barangays BRGY ON BRGY.BARANGAY_ID = PRK.BARANGAY_ID 
										LEFT JOIN vims.barangay_res_setup RES ON RES.RESIDENT_ID = PRK.PRK_LEADER 
										WHERE PRK.PRK_NAME LIKE ?  order by PRK.ID desc`,
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				}
			},

			"barangay" :{
				"search_param" : [
					{
						value : "",
						placeholder : "%_placeholder_%",
					}
				],
				"search_dom" : [
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : 'row col-md-7',
							},
							{
								attribute : 'id',
								value : 'dttablefilter',
							},
							
						],
						children : [
								{
									createElement : 'div',
									attributes : [
										{
											attribute : 'className',
											value : "col-sm-12",
										}
									],
									children : [
										{
											createElement : 'input',
											attributes : [
												{
													attribute : 'type',
													value : 'text',
												},
												{
													attribute : 'className',
													value : 'form-control',
												},
												{
													attribute : 'placeholder',
													value : 'Search here...',
												},
												{
													attribute : 'valuectrl',
													type : 'dataset',
													
													value : 'fieldsDataTable.barangay.search_param.0.value',
												},
												{
													attribute : 'keyup',
													type : 'event',
													value : ( )=> {
														this.changefilter("request");
													},
												}
												
											],
										}
									],
								}
						],
					},
					
						
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : "row col-md-5 action-buttons",
							}
						],
						children : [
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-warning',
									},			
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-refresh"></i> Refresh Table'
											}
										]
									}
								]
							},
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-primary',
									},	
									{
										attribute : 'click',
										type : 'event',
										value : (...args )=> {
											let usm = new BarangayModalController({
												modalID :  "barangay-modal",
												controllerName : "BarangayModalController",
												template : "/vims/sources/templates/modal/barangay.modal.template.html",
												parent : this,
												isUpdate : args ? false : true,
												args : args ? args : {},
												//instanceID : this.mainService.generate_id_timestamp("res"),
												onSearch : true,
												onSearchEvent :  this.modalData.instanceID ? `SearchModal${this.modalData.instanceID}:onUpdateSearchTable` : "searchmodal:onUpdateSearchTable",
											});
											usm.render();
										},
									}
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-plus"></i> Add New'
											},
											
										]
									}
								]
							}
							
						],
					}
						
					
				],
				"fields" : [
					{
						head : "BARANGAY",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['BARANGAY_NAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "BARANGAY CAPTAIN",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['BARANGAY_CAPTAIN_NAME'];
										},
									}
								]
							}
						]
					},
				
					{
						head : "Actions",
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
										value : "btn btn-success",
									},
									{
										type : "event",
										attribute : "click",
										value : ( arg ) => {
											//console.log ( this.searchParams , arg );
											let actions = {
												link : ( ) => {
													MainService.EventObject[this.params.controller].dispatch (this.params.controller+this.params.evt , {
														detail : {
															query : {
																BARANGAY_NAME : arg['BARANGAY_NAME'],
																BARANGAY_ID : arg['BARANGAY_ID'],
																context : this.parent,
																modal : this,
															}
														} 
													});
													//this.onClose();
												}
											};
											
											//console.log(this.params.action);
											actions [ this.params.action ]( );

										},
									}
								],
								children : [
									{
										createElement : "i",
										attributes : [
											{
												attribute: "className",
												value : "icon-plus",
											}
										]
									}
								]
							},
							
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
										value : ( args ) => {
											//console.log ( this.searchParams , arg );
											let usm = new BarangayModalController({
												modalID :  "barangay-modal",
												controllerName : "BarangayModalController",
												template : "/vims/sources/templates/modal/barangay.modal.template.html",
												parent : this,
												isUpdate : true,
												args : args ? args : {},
												//instanceID : this.mainService.generate_id_timestamp("res"),
												onSearch : true,
												onSearchEvent :  this.modalData.instanceID ? `SearchModal${this.modalData.instanceID}:onUpdateSearchTable` : "searchmodal:onUpdateSearchTable",
											});
											usm.render();

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
						]
					},
				],
				request : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									sql : `SELECT BRGY.*, CONCAT(RES.FIRSTNAME, ' ', RES.LASTNAME) BARANGAY_CAPTAIN_NAME FROM 
										vims.barangays BRGY LEFT JOIN vims.barangay_res_setup  RES ON 
										RES.RESIDENT_ID = BRGY.BARANGAY_CAPTAIN WHERE BRGY.BARANGAY_NAME LIKE ? order by BRGY.ID desc`,
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				}
			},
		}
			
	}
	
	onUpdateSearchTable( ...args ){
		//console.log("SssS",args);
		this.changefilter("request", "refresh");
	}
	
	/* getWarehouse ( whcode ) {
		return new Promise ( ( resolve , reject ) => {
			let request = {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									sql : `SELECT WAREHOUSE_CODE,WAREHOUSE_NAME FROM jblcf_inventory.warehouse WHERE WAREHOUSE_CODE = ?`,
									query_request : 'GET',
									index : 'wh',
									values : [whcode]
								},
							]
						}
					}		
				}
			this.mainService.serverRequest( request , ( res ) => {
				resolve ( JSON.parse(res).wh  ? JSON.parse(res).wh[0] : {WAREHOUSE_NAME : ""} )
			}, 
			( res ) => {
				reject(res);
			});	
		});
	} */

	
	onCloseSearchModal(){
		this.onClose();
	}
	
	
	init ( request ){
		
		let search_params = this.fieldsDataTable[ this.params.type ][ "search_param" ];
		let dataQuery = this.fieldsDataTable[ this.params.type ][ request ];
		let dq = dataQuery.data.data.REQUEST_QUERY[0].values;	
		//console.log(search_params,dq);
		//this.searchObject = this.fieldsDataTable[ this.params.type ];
		//dataQuery.data.data.REQUEST_QUERY[0].values[0] = '%'+this.fds.gds+'%';
		/* let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/jblcf_inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		}); */
		//console.log(search_params)
		//load.render();
		for (let i in dq){
			/* let sel = search_params[i];
			let sel2 = this.fieldsDataTable[ this.params.type ][ "search_additional" ][i];
			
			if ( sel2.includes("_placeholder_") ){
				sel = sel2.replace ("_placeholder_" , sel);
			}
			
			dataQuery.data.data.REQUEST_QUERY[0].values.push(sel); */
			//let sel = dq[i];
			//let sel2 = search_params[i];
			let search = search_params[i];
			//console.log(search,i);
			if ( search.placeholder.includes("_placeholder_") ){
				dataQuery.data.data.REQUEST_QUERY[0].values[i] = search.placeholder.replace( '_placeholder_' , search.value );
			}
			else{
				dataQuery.data.data.REQUEST_QUERY[0].values[i] = search.value;
			}
			
		}
		
		this.mainService.serverRequest( dataQuery , ( res ) => {
			
			setTimeout( ( ) => {
				let stds = (JSON.parse(res))['result'];
				
				let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
				
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
	
	changefilter( request , refresh ){
		if (refresh){
			for ( let i in this.fieldsDataTable[this.params.type].search_param ){
				this.fieldsDataTable[this.params.type].search_param[i].value = "";
			}
			
			this.bindChildObject (this, false);
		}
		console.log(this);
		this.bindChildObject(this, this.elem);
		this.init(request);
	}
	
	constructs(){
		console.log(this.modalData.instanceID);
		
		if(this.modalData.instanceID) {
			//console.log('this.modalData.instanceID' , this.modalData.instanceID)
			//$("#search-modal").attr("id",`#SearchModal${this.modalData.instanceID}`);
			//console.log($("#"+this.params.instanceID).data("controller"))
			//$("#"+this.params.instanceID).data("controller",`SearchModal${this.modalData.instanceID}`);
			//console.log($("#"+this.params.instanceID).data("controller"))
			//document.querySelector('#search-modal').dataset.controller = `SearchModal${this.modalData.instanceID}`
			//document.querySelector('#search-modal').id = `SearchModal${this.modalData.instanceID}`;
		}
		
		//console.log(document.querySelector(`#SearchModal${this.modalData.instanceID}`));
		let searchDom = document.querySelector(( this.modalData.instanceID ? `#SearchModal${this.modalData.instanceID} #modal-search-pane` : '#modal-search-pane'));
		setTimeout(() => {
			let parentDiv  = ( this.modalData.instanceID ? `#SearchModal${this.modalData.instanceID}`+" #searchtablemodal" : `#searchtablemodal` );
			this.mainService.children(this.fieldsDataTable[this.params.type]["search_dom"], searchDom,{});
			this.dataTable = new DataTableService({
				template : "/vims/sources/templates/section/datatable.table.section.template.html",
				controller : this,
				controllername : "",
				tableID : "dttable",
				service : this.mainService,
				parentDiv : parentDiv,
				filterElems : [],
				fields : this.fieldsDataTable[ this.params.type ][ "fields" ],
			});
			
			this.init ("request");
		}, 300);
	}
}