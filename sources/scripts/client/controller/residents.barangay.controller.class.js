import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { PurokModalController } from "./purok.modal.controller.class.js"
import { BarangayModalController } from "./barangay.modal.controller.js"

export class ResidentsBarangayController extends Modal {
    
    constructor ( modalData ){
        super ( modalData );
        this.brgyname = session_data.BARANGAY_NAME;
        this.BARANGAY_NAME = "";
        this.BARANGAY_CAPTAIN_ID = "";
        this.BARANGAY_CAPTAIN_NAME = "";
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
                    head : "BARANGAY",
                    sort : {
                        asc : ['BARANGAY_NAME'],
                        dsc : ['-BARANGAY_NAME'],
                    },
                    sortBy : 'asc',
                    elements : [
                        {
                            createElement : "b",
                            attributes : [
                                {
                                    attribute : "innerText",
                                    value : ( selData ) => {
                                        return selData['BARANGAY_NAME'] ?? '';
                                    },
                                }
                            ]
                        }
                    ]
                },
                {
                    head : "BARANGAY CAPTAIN",
                    sort : {
                        asc : ['BARANGAY_CAPTAIN_NAME'],
                        dsc : ['-BARANGAY_CAPTAIN_NAME'],
                    },
                    sortBy : 'asc',
                    elements : [
                        {
                            createElement : "b",
                            attributes : [
                                {
                                    attribute : "innerText",
                                    value : ( selData ) => {
                                        
                                        return `${selData['BARANGAY_CAPTAIN_NAME']}`;
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
                                    value : async ( args ) => {
                                        args ['BRGY_KAGAWADS'] = await this.getBarangayKagawad(args.BARANGAY_ID)
                                        this.openBarangay(args);
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

    async getBarangayKagawad (brgyID) {
        let statement = "SELECT CONCAT(FIRSTNAME,' ',LASTNAME) as FULLNAME FROM vims.barangay_res_setup WHERE BARANGAY_ID = ? AND IS_BARANGAY_KAGAWAD = 1"
        let dataQuery = {
            type: "POST",
            url : this.mainService.urls["generic"].url,
            data : {
                data : {
                    request : 'generic',
                    REQUEST_QUERY : [
                        {
                            sql : statement,
                            db : 'DB',
                            query_request : 'GET',
                            index : 'result',
                            values : [brgyID]
                        },	
                    ]
                }		
            }
        };
        return new Promise ( (resolve, reject) => {
            this.mainService.serverRequest( dataQuery , ( res ) => {
                resolve(JSON.parse(res))
            },( res ) => {
                reject(res);
            });	
        });
    }
    
    changeFilter(){
        this.bindChildObject(this,this.elem);
        this.init();
    }
    
    onUpdateTable(){
        this.changeFilter()
    }
    
    openPurok(args){
        let usm = new PurokModalController({
            modalID :  "purok-modal",
            controllerName : "PurokModalController",
            template : "/vims/sources/templates/modal/purok.modal.template.html",
            parent : this,
            isUpdate : args.PRK_ID ? true : false,
            args : args.PRK_ID ? args : {},
            //instanceID : this.mainService.generate_id_timestamp("res"),
            onSearchEvent : `${this.controllerName}:onUpdateTable`,
        });
        usm.render();
    }

    openBarangay(args) {
        let usm = new BarangayModalController({
            modalID :  "barangay-modal",
            controllerName : "BarangayModalController",
            template : "/vims/sources/templates/modal/barangay.modal.template.html",
            parent : this,
            isUpdate : args.ID ? true : false,
            args : args ? args : {},
            //instanceID : this.mainService.generate_id_timestamp("res"),
            onSearch : true,
            onSearchEvent : `${this.controllerName}:onUpdateTable`,
        });
        usm.render();
    }

    onLinkKagawad ( arg ){
        let args = arg.detail.query;
        this.BARANGAY_CAPTAIN_ID = args.RESIDENT_ID
        this.BARANGAY_CAPTAIN_NAME = args.FULLNAME;
        this.binds(this.controllerName,'#'+this.modalID);
        this.bindChildObject ( this , false );
        this.init();
        args.modal.onClose();
    }

    removeCaptain() {
        this.BARANGAY_CAPTAIN_ID = ``
        this.BARANGAY_CAPTAIN_NAME = ``;
        this.binds(this.controllerName,'#'+this.modalID);
        this.bindChildObject ( this , false );
        this.init();
    }

    chooseCaptain( arg ){
        let ssm = new SearchModal ({
            modalID :  "search-modal",
            controllerName : "searchmodal",
            template : "/vims/sources/templates/modal/search.modal.template.html",
            params : {
                type :  'resident_all',
                action : 'link',
                controller : this.controllerName,
                evt : ':onLinkKagawad',
                //arg : args,
            },
            instanceID : this.mainService.generate_id_timestamp("sm"),
            parent : this,
        });
        ssm.render();
    }

    barangaySetup ( ) {
        let ssm = new SearchModal ({
            modalID :  "search-modal",
            controllerName : "searchmodal",
            template : "/vims/sources/templates/modal/search.modal.template.html",
            params : {
                type : "barangay",
                action : 'link',
                controller : this.controllerName,
                evt : ':onLinkBarangay',
                //arg : args,
            },
            instanceID : this.mainService.generate_id_timestamp("sm"),
            parent : this,
        });
        ssm.render();
    }
    

    chooseBarangay( arg ){
        let ssm = new SearchModal ({
            modalID :  "search-modal",
            controllerName : "barangay",
            template : "/vims/sources/templates/modal/search.modal.template.html",
            params : {
                type :  'barangay',
                action : 'link',
                controller : this.controllerName,
                evt : ':onLinkBarangay',
                //arg : args,
            },
            instanceID : this.mainService.generate_id_timestamp("sm"),
            parent : this,
        });
        ssm.render();
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
                            sql : `SELECT BRGY.ID, BRGY.BARANGAY_NAME, BRGY.BARANGAY_ID, BRGY.BARANGAY_CAPTAIN,
                                    IF(CONCAT(RES.FIRSTNAME,' ',RES.LASTNAME) IS NOT NULL , CONCAT(RES.FIRSTNAME,' ',RES.LASTNAME) , '-') BARANGAY_CAPTAIN_NAME
                                    FROM vims.barangays BRGY 
                                    LEFT JOIN vims.barangay_res_setup  RES ON RES.RESIDENT_ID = BRGY.BARANGAY_CAPTAIN 
                                    WHERE BRGY.BARANGAY_NAME LIKE ? `+
                                    (this.BARANGAY_CAPTAIN_ID !== '' ? ` and BRGY.BARANGAY_CAPTAIN = '${this.BARANGAY_CAPTAIN_ID}' ` : '')+
                                    `order by BRGY.ID desc`,
                            db : 'DB',
                            query_request : 'GET',
                            index : 'result',
                            values : [`%${this.BARANGAY_NAME}%`]
                        },	
                    ]
                }
                        
            }
            
        };
        this.mainService.serverRequest( dataQuery , ( res ) => {
            setTimeout( ( ) => {
                let stds = (JSON.parse(res))['result'];
                let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
                this.dataTable.setTableData(stds);
                this.dataTable.setPaginateCtr(d);
                this.dataTable.construct();
                //load.onClose();
            },300);
        } , ( res ) => {
            console.log(res);
        });	
    }

}
    