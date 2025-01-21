import { ServerRequest } from '../classes/serverrequest.service.class.js';
import { SocketClient } from "../classes/socket.client.class.js";

export class MainService {
	
	static EventObject = {};
	
	constructor ( rootDirectory , sessionData ){
		//console.log(rootDirectory);
		this.urls = {
			"auth" : { url : rootDirectory+'/scripts/server/routes/auth.route.server.php' },
			"generic" : { url : rootDirectory+'/scripts/server/routes/profile.route.server.php' }
		}
		
		if ( sessionData )
		this.sessionData = sessionData;
		this.sourcesDirectory = rootDirectory;
		this.listeners = [];
		this.isPropertyCustodian = session_data.POSITION == "Property Custodian" ;
		this.isAdministrator = session_data.DESIGNATION == "System Administrator";
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		
		
		Date.prototype.toDateInputValue = function() {
			var local = new Date(this);
			local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
			return local.toJSON().slice(0,10);
		};
		
		Date.prototype.addDays = function(days) {
			this.setDate(this.getDate() + parseInt(days));
			return this;
		};
		
		
		Date.prototype.minusDays = function(days) {
			this.setDate(this.getDate() - parseInt(days));
			return this;
		};
		
	}

	groupBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			 const key = keyGetter(item);
			 const collection = map.get(key);
			 if (!collection) {
				 map.set(key, [item]);
			 } else {
				 collection.push(item);
			 }
		});
		return map;
	}
	
	daysInMonth ( month , year ){
		 return 32 - new Date(year, month, 32).getDate();
	}
	
	
	convertUnitsBasic ( item , m , s ){
		//console.log(item);
		return new Promise ( ( resolve , reject ) =>{
			let request1 = {
				type: "POST",
				url : this.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "select * from vims.unit where ITEM_CODE = ? ORDER BY HEIRARCHY",
								db : 'DB',
								query_request : 'GET',
								index : 'units',
								values : [
									item.ITEM_CODE
								]
							},	
							{
								sql : "select * from vims.unit where ITEM_CODE = ? and UNIT_NAME = ?",
								db : 'DB',
								query_request : 'GET',
								index : 'my_unit',
								values : [
									item.ITEM_CODE,
									item.UNIT_NAME
								]
							},
						]
					}
								
				}
			};
			//console.log(request1);
				
			this.serverRequest( request1 , ( res ) => {
				let u = JSON.parse(res);
				//console.log('ii',item.AAA, item.T);
				//resolve(stck);
				item.TOTAL_QUANTITY = item[s];
				
				let t = u.units[0]['QTY'];
				if (u.my_unit[0]['HEIRARCHY'] == 0){
					resolve( item.TOTAL_QUANTITY );
				}
				else{
					for ( let i in u.units ){
						let sl = u.units[i];
						t *= parseFloat(sl.QTY);
						if ( sl.HEIRARCHY == u.my_unit[0]['HEIRARCHY'] ){
							break;
						}
						
						
					}
				}
				//console.log(item.ITEM_NAME,item.QUANTITY , t )
				resolve (!m ? item.TOTAL_QUANTITY / t : item.TOTAL_QUANTITY * t );
				
			});
		});
	}
	
	convertUnits4 ( value , currentUnit, toUnit, UNITS ){
		let u = UNITS;
		let thisUnit = u[u.findIndex ( x => x.UNIT_NAME == currentUnit )];
		let toUnitConvert = u[u.findIndex ( x => x.UNIT_NAME == toUnit )];
		let multiplier = 1;
		//console.log( value,currentUnit, toUnit,'->',toUnitConvert['HEIRARCHY'] ,'<' , currentUnit,'->',thisUnit['HEIRARCHY'] )
		
		if (currentUnit == toUnit){
			return value;
		}
		
		else if ( toUnitConvert['HEIRARCHY'] < thisUnit['HEIRARCHY']  ){
			let next = thisUnit['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
				
				if ( sel.HEIRARCHY == toUnitConvert.HEIRARCHY ){
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
				
				
				next --;
			}
			
			//console.log(multiplier)
			return parseFloat (value / multiplier);
		}
		else{
			let next = toUnitConvert['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
				
				if ( sel.HEIRARCHY == thisUnit.HEIRARCHY ){
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
				
				
				next --;
			}
			
			//console.log(multiplier)
			
			return parseFloat (value * multiplier);
		}
	}
	
	getItemDetails ( ITEM_CODE ){
		return new Promise ( ( resolve, reject) => {
			let request = {
						type: "POST",
						url : this.urls["generic"].url,
						data : {
							data : {
								request : 'generic',
								REQUEST_QUERY : [
									{
										sql : "SELECT * FROM vims.ITEM_MASTER_DATA WHERE ITEM_CODE = ?",
										db : 'DB',
										query_request : 'GET',
										index : 'ITEM',
										values : [ ITEM_CODE ]
									},	
									{
										sql : "SELECT * FROM vims.UNIT WHERE ITEM_CODE = ?",
										db : 'DB',
										query_request : 'GET',
										index : 'UNIT',
										values : [ ITEM_CODE ]
									},	
								]
							}
									
						}
					};
			this.serverRequest( request , ( res ) => {
				res = JSON.parse(res);
				resolve({
					ITEM_DETAIL : res.ITEM,
					UNIT_DETAIL : res.UNIT,
				});
			},err=>{
				reject (err);
			});
		});
	}
	
	#generateStockCardData( item, FRM, TO, WH ){
		return new Promise ( async ( resolve, reject ) => {
			let STOCK_CARD_DATA = [];
			let expdate1 = item.EXPDATE !=='0000-00-00' ? `iiw.EXPIRY_DATE='${item.EXPDATE}'`  : '';
			let expdate2 = item.EXPDATE !=='0000-00-00' ? `iiw.EXPIRY_DATE='${item.EXPDATE}'`  : '';
			let item_detail = await this.getItemDetails( item.ITEM_CODE );
			//let whcond = this.whouseCode !== '' ? `(iiw.WAREHOUSE_CODE="${this.whouseCode}" OR iiw.WAREHOUSE_CODE_FRM="${this.whouseCode}")` : ''
			let whcond =  `(iiw.WAREHOUSE_CODE="${WH}" OR iiw.WAREHOUSE_CODE_FRM="${WH}")` ;
			let pccond = item.LN !== '' ? `iiw.LOT_NUMBER="${item.LN}"` : ``;
			let ccond = expdate1 !== '' && whcond !== '' && pccond !== '' ? `and (${expdate1} and ${whcond} and ${pccond})` :
					expdate1 !== '' && whcond !== '' && pccond == ''  ? `and (${expdate1} and ${whcond})` :
					expdate1 !== '' && whcond == '' && pccond !== ''  ? `and (${expdate1} and ${pccond})` :
					expdate1 == '' && whcond !== '' && pccond !== ''  ? `and (${whcond} and ${pccond})` : 
					expdate1 !== '' && whcond == '' && pccond == ''   ? `and ${expdate1}` :
					expdate1 == '' && whcond == '' && pccond !== ''   ? `and ${pccond}` :
					expdate1 == '' && whcond !== '' && pccond == ''   ? `and ${whcond}` : '';
			let SQL_STOCK_CARD = `SELECT 
					(SELECT WAREHOUSE_NAME FROM vims.warehouse WHERE WAREHOUSE_CODE = iiw.WAREHOUSE_CODE) WHNAME ,
					(SELECT WAREHOUSE_NAME FROM vims.warehouse WHERE WAREHOUSE_CODE = iiw.WAREHOUSE_CODE_FRM) WHNAMEFRM ,
					(SELECT WAREHOUSE_CODE FROM vims.warehouse WHERE WAREHOUSE_CODE = iiw.WAREHOUSE_CODE) WHCODE ,
					(SELECT WAREHOUSE_CODE FROM vims.warehouse WHERE WAREHOUSE_CODE = iiw.WAREHOUSE_CODE_FRM) WHCODEFRM ,
					(SELECT CONCAT(FIRSTNAME,' ',LASTNAME) FROM vims.user_setup WHERE ID = ad.TRANSFERED_TO) TRANSFER_TO_ ,
					(SELECT CONCAT(FIRSTNAME,' ',LASTNAME) FROM vims.user_setup WHERE ID = ad.TRANSFERED_FROM) TRANSFER_FRM_ ,
					(SELECT SUPPLIER_NAME FROM vims.supplier WHERE SUPPLIER_CODE = ad.SUPPLIER_ID) SUPPLIER_ ,
					iiw.WAREHOUSE_CODE,iiw.WAREHOUSE_CODE_FRM as whfrm,iiw.WH_QTY_1,iiw.WH_QTY_2,iiw.RM_QTY_1,iiw.RM_QTY_2,iiw.LOT_NUMBER,
					u.*,id.*,ad.*,imd.*,iiw.SN,iiw.LOT_NUMBER,iiw.ID,iiw.TOTAL_QUANTITY,iiw.B_QUANTITY,iiw.B_QUANTITY AS QTTY,ad.TYPE as dtype,
					id.EXPIRY_DATE AS EXPIRY_DATE from vims.alter_document ad 
					 inner join vims.item_details id ON id.DOC_ID = ad.DOC_ID 
					 INNER JOIN vims.item_master_data imd ON id.ITEM_CODE = imd.ITEM_CODE 
					 inner join vims.unit u ON u.UNIT_CONVERSION_ID = id.UNIT_CONVERSION_ID 
					 left join ( 
						select 
						ID, 
						EXPIRY_DATE,
						DOC_ID,ITEM_CODE,
						B_QUANTITY,
						TOTAL_QUANTITY,
						QUANTITY ,
						LOT_NUMBER,
						WAREHOUSE_CODE ,
						WAREHOUSE_CODE_FRM ,
						WH_QTY_1,
						WH_QTY_2, 
						RM_QTY_1, 
						RM_QTY_2 ,
						SN
						FROM vims.item_in_warehouse 
					 ) iiw ON (iiw.EXPIRY_DATE = id.EXPIRY_DATE && iiw.DOC_ID = id.DOC_ID && iiw.ITEM_CODE = id.ITEM_CODE )
					 WHERE id.ITEM_CODE = ? and ( ad.DOCUMENT_DATE between ? and ? )   ${ccond}  GROUP BY iiw.ID  
					 ORDER BY iiw.ID ASC `;
					 
				let SQL_BEG_BAL = `SELECT * FROM vims.item_in_warehouse iiw 
						WHERE iiw.ITEM_CODE = ? AND 
						( iiw.QTY_AS_OF < ? AND iiw.IS_CANCELLED = 0) 
						 ${ccond} ORDER BY iiw.ID DESC `;
				
				
						
				let request_1 = {
						type: "POST",
						url : this.urls["generic"].url,
						data : {
							data : {
								request : 'generic',
								REQUEST_QUERY : [
									{
										sql : SQL_STOCK_CARD,
										db : 'DB',
										query_request : 'GET',
										index : 'items',
										values : [ item.ITEM_CODE ,FRM ,TO ]
									},	
									{
										sql : SQL_BEG_BAL,
										db : 'DB',
										query_request : 'GET',
										index : 'begbal',
										values : [ item.ITEM_CODE,FRM ],
									},	
									
								]
							}
									
						}
				}
				
				this.serverRequest( request_1 , ( item_res_1 ) => {
					item_res_1 = JSON.parse(item_res_1);
					
					let begbal = item_res_1.begbal;
					let stkcrd = item_res_1.items;
					
					let bbym = begbal[0] ? ( (begbal[0].EXPDATE !=='' || begbal[0].LN !=='')  ? 'B_QUANTITY' : 'TOTAL_QUANTITY' ) : "";
					let beginningbalance = begbal[0] ? begbal[0][bbym] : 0;
					let converted = this.convertUnits4(beginningbalance,item_detail.UNIT_DETAIL[0].UNIT_NAME,item_detail.UNIT_DETAIL[item_detail.UNIT_DETAIL.length-1].UNIT_NAME,item_detail.UNIT_DETAIL)
					let conv_begb = ( parseInt( converted ) + 1 == Math.round( converted ) ? Math.round( converted ) : parseInt( converted ) );
					
					STOCK_CARD_DATA.push({
						BEGBAL : true,
						DOCUMENT_DATE : FRM,
						TQUANTITY : conv_begb
					});
					
					for ( let i in stkcrd ){
						let selstckcard = stkcrd[i];
						
						let converted1 = this.convertUnits4(selstckcard.REGULAR,selstckcard.UNIT_NAME,item_detail.UNIT_DETAIL[item_detail.UNIT_DETAIL.length-1].UNIT_NAME,item_detail.UNIT_DETAIL);
						let ssb1 = ( parseInt( converted1 )+1 == Math.round(  converted1 ) ? Math.round(  converted1 ) : parseInt(  converted1 ) );
						selstckcard['REGULAR'] = ssb1;
						
						let converted2 = this.convertUnits4(selstckcard.DEAL,selstckcard.UNIT_NAME,item_detail.UNIT_DETAIL[item_detail.UNIT_DETAIL.length-1].UNIT_NAME,item_detail.UNIT_DETAIL);
						let ssb2 = ( parseInt( converted2 )+1 == Math.round(  converted2 ) ? Math.round(  converted2 ) : parseInt(  converted2 ) );
						selstckcard['DEAL_'] = ssb2;
						
						let converted3 = this.convertUnits4(selstckcard.QUANTITY,selstckcard.UNIT_NAME,item_detail.UNIT_DETAIL[item_detail.UNIT_DETAIL.length-1].UNIT_NAME,item_detail.UNIT_DETAIL);
						let ssb3 = ( parseInt( converted2 )+1 == Math.round(  converted3 ) ? Math.round(  converted3 ) : parseInt(  converted3 ) );
						selstckcard['QUANTITY'] = ssb3;
						
						
						let qqmartin = ( (item.EXPDATE !==''|| item.LN !=='') ? 'B_QUANTITY' : 'TOTAL_QUANTITY');
						
						
						if (WH !== ''){
							if (item.EXPDATE !=='' || item.LN !==''){
								//qqmartin = sel.WHNAME !== null ? 'WH_QTY_1' : 'RM_QTY_1';
								if ( selstckcard.WHNAME !== null  && selstckcard.WHNAMEFRM == null ){
									qqmartin =  'WH_QTY_1';
								}
								else if ( selstckcard.WHNAMEFRM !== null && selstckcard.WHNAME == null ){
									qqmartin =  'RM_QTY_1';
								}else{
									if ( selstckcard.WHCODEFRM == WH ){
										qqmartin = 'RM_QTY_1'
									}
									else{
										qqmartin =  'WH_QTY_1';
									}
								}
							}
							else{
								if ( selstckcard.WHNAME !== null  && selstckcard.WHNAMEFRM == null ){
									qqmartin =  'WH_QTY_2';
								}
								else if ( selstckcard.WHNAMEFRM !== null && selstckcard.WHNAME == null ){
									qqmartin =  'RM_QTY_2';
								}else{
									if ( selstckcard.WHCODEFRM == WH ){
										qqmartin = 'RM_QTY_2'
									}
									else{
										qqmartin =  'WH_QTY_2';
									}
								}
							}
						}
						console.log(item_detail.UNIT_DETAIL)
						
						
						let ccu = this.convertUnits4(
						selstckcard[qqmartin],
						item_detail.UNIT_DETAIL[0].UNIT_NAME,
						item_detail.UNIT_DETAIL[item_detail.UNIT_DETAIL.length-1].UNIT_NAME,
						item_detail.UNIT_DETAIL);
						
						let cccu = ( parseInt( ccu )+1 == Math.round( ccu) ? Math.round( ccu ) : parseInt( ccu ) );
						console.log(qqmartin);
						selstckcard['UNIT_NAME'] = item_detail.UNIT_DETAIL[item_detail.UNIT_DETAIL.length-1].UNIT_NAME;
						selstckcard['TQUANTITY'] =  cccu;
						
						STOCK_CARD_DATA.push (selstckcard);
					}
					
					resolve(STOCK_CARD_DATA);
				},err=>{
						
					reject (err);
				});
		});
	}
	
	generateStockCard ( ITEMS , FRM , TO , WH_CODE ){
		let ARR_RES_STOCK_CARD = [];
		
		return new Promise ( async ( resolve , reject ) => {
			for ( let i in ITEMS ){
				let item = ITEMS[i];
				let stock_card_data = await this.#generateStockCardData(item,FRM,TO,WH_CODE);
				ARR_RES_STOCK_CARD.push(stock_card_data);
			}
			resolve(ARR_RES_STOCK_CARD);
		});
	}
	
	addDays ( date, days ){
		return new Date(date).addDays( parseInt(days) ).toDateInputValue();
	}
	
	minusDays ( date, days ){
		return new Date(date).minusDays( parseInt(days) ).toDateInputValue();
	}
	
	/* unique session id for socket identity */
	makeid (length) {
	   let result           = '';
	   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@_+';
	   let charactersLength = characters.length;
	   for ( let i = 0; i < length; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}

	makeidV2 (length) {
		let result           = '';
		let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let charactersLength = characters.length;
		for ( let i = 0; i < length; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	 }

	static MAKE_ID (length) {
	   let result           = '';
	   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@_+';
	   let charactersLength = characters.length;
	   for ( let i = 0; i < length; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}

	gethhcodeExists(hhcode) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `select RS.HH_CODE from vims.barangay_res_setup RS
									where RS.HH_CODE = ?`,
							db : 'DB',
							index : 'hhcode',
							query_request : "GET",
							values : [hhcode]
						},	
					]
				}	
			}
			
		};
		return new Promise ((resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout ( ( ) =>{
					res = JSON.parse(res)['hhcode'];
					resolve(res);	
				}, 100);
			}, err => {
				reject(err);
			});
		});
	}

	async makeHHID (hhcode) {
		let reshhc = await gethhcodeExists(hhcode) ;
		if (reshhc) {
			return this.makeHHID(hhcode);
		} else {
			return hhc;
		}
	}
	
	serverRequest ( serverRequestObject , thenCallback , catchCallback , async ){
		return new ServerRequest ( serverRequestObject ).queryRequest( async )
			.then( thenCallback )
			.catch ( catchCallback );
	}
	
	serverRequestFileUpload ( serverRequestObject , thenCallback , catchCallback , async ){
		return new ServerRequest ( serverRequestObject ).queryRequestFileUpload( async )
			.then( thenCallback )
			.catch ( catchCallback );
	}
	
	openPage (verb, url, data, target) {
		/* var form = document.createElement("form");
		form.action = url;
		form.method = verb;
		form.target = target || "_self";
		if (data) {
			for (var key in data) {
			  var input = document.createElement("textarea");
			  input.name = key;
			  input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
			  form.appendChild(input);
			}
		}
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit(); */
		this.openPopupWindow(verb, url, data)
	}
	
	
	openTab(verb,url,data,target){
		var form = document.createElement("form");
		form.action = url;
		form.method = verb;
		form.target = target || "_self";
		if (data) {
			for (var key in data) {
			  var input = document.createElement("textarea");
			  input.name = key;
			  input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
			  form.appendChild(input);
			}
		}
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit();
	}
	
	openPopupWindow ( verb, url, data,settings ){
		var form = document.createElement("form");
		form.action = url;
		form.method = verb;
		//form.target = target || "_self";
		form.target='newindow';
		if (data) {
			for (var key in data) {
			  var input = document.createElement("textarea");
			  input.name = key;
			  input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
			  form.appendChild(input);
			}
		}
		form.style.display = 'none';
		document.body.appendChild(form);
		settings = !settings ? 'toolbars=0,width=830px,height=800,left=200,top=200,scrollbars=1,resizable=no,menubar=no,fullscreen=no' : settings;
		window.open(url,'newindow',settings);
		form.submit();
	}
	
	
	socketON(){
		if (!this.SocketClient){
			//if (!this.SocketClient.isConnected){
				this.SocketClient = new SocketClient ( 'ws://localhost:8090/socketserver/socket_route.php' , this );
				this.SocketClient._onConnect();
			//}
		}
		
	}
	
	getThisService(){
		return this;
	}
	
	loadTemplate ( path, id , callback , append , qselect ) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function (e) { 
			if (xhr.readyState == 4 && xhr.status == 200) {
				if ( !append ){
					if ( !qselect )
						document.getElementById(id).innerHTML = xhr.responseText;
					else{
						if(document.querySelector(id))
						document.querySelector(id).innerHTML = xhr.responseText;
					}
				}else{
					$("#"+id).append (xhr.responseText);
				}
				callback();
			}
		 }
		xhr.open("GET", path, true);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.setRequestHeader("Pragma", "no-cache");
		xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		xhr.send();
	}
	
	isPromise(object){
	  if(Promise && Promise.resolve){
		return Promise.resolve(object) == object;
	  }else{
		return false;
	  }
	}//vgHjN4r4nmMD@qIfHn6K@An9
	
	children ( childrenObject , parentDOM , param , promiseValue ){
		//console.log ( 'aaa', param );
		let body = "";
		let childLen = childrenObject.length;
		let ch = 0;
		for ( ; ch < childLen ; ch++ ){
			let sel = childrenObject[ ch ];
			let dom = document.createElement ( sel.createElement );
			//console.log(sel.createElement,param);
			if ( sel.attributes ){
				for ( let dh = 0 ; dh < sel.attributes.length ; dh++ ){
					let selAttrb = sel.attributes[ dh ];
					let val = "";
					let isPromise = false;
					if ( ( this.isFunction(selAttrb.value) && !selAttrb.type ) || ( this.isFunction(selAttrb.value) && selAttrb.spec_val ) ){
						val = selAttrb.value( param );
					}
					else{
						val = selAttrb.value;
					}
					
					if ( !!val && typeof val.then === 'function' ){
						isPromise = true;
						val.then ( data => {
							dom [ selAttrb.attribute ] = data;
						})
						.catch ( err => {
						});
					}
					
					
					if ( typeof selAttrb.type == 'undefined' && !isPromise ){
						dom [ selAttrb.attribute ] = val;
					}else if (!isPromise) {
						switch ( selAttrb.type ){
							case "dataset":
								// selAttrb.type ; should always be 'dataset'
								
								dom[ selAttrb.type ][ selAttrb.attribute ] = val;
							
							break;
							case "newAttribute":
								/* 
									assign new attribute to the DOM 
									if there's any
								*/
							break;
							case "event":
								let params = param;
								if ( selAttrb.param ){
									params = selAttrb.param( params );
								}
								/* else if ( selAttrb.currentValue ){
									console.log ( dom.value , 'aaa' );
									params = dom.value;
								} */
								dom.addEventListener( selAttrb.attribute , val.bind('',params) );
							break;
						}
					}
					
				}
			}
			parentDOM.appendChild( dom );
			
			//if ( typeof sel.children != 'undefined' ){
			if ( sel.children ){
				this.children( sel.children, dom , param );
			}else{
				continue;
			}
			
		}
		
	}
	
	populateSYoption ( f, range , select ){
		for ( let s = f ; s <= range ; s++ ){
			let option = document.createElement( "option" );
				option.innerText = s;
			
			if ( this.isFunction(select.appendChild) )
				select.appendChild ( option );
		}
	}
	
	msToTime(duration) {
	  var milliseconds = parseInt((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	  hours = (hours < 10) ? "0" + hours : hours;
	  minutes = (minutes < 10) ? "0" + minutes : minutes;
	  seconds = (seconds < 10) ? "0" + seconds : seconds;

	  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	}
	
	convertUnits ( value , currentUnit, toUnit , units ){
		let u = !units ? this.units : units;
		let thisUnit = u[u.findIndex ( x => x.UNIT_NAME == currentUnit )];
		let toUnitConvert = u[u.findIndex ( x => x.UNIT_NAME == toUnit )];
		let multiplier = 1;
		//console.log( value,currentUnit, toUnit,'->',toUnitConvert['HEIRARCHY'] ,'<' , currentUnit,'->',thisUnit['HEIRARCHY'] )
		//console.log(value , currentUnit, toUnit , toUnitConvert);
		
		
		if (currentUnit == toUnit){
			return value;
		}
		
		else if ( toUnitConvert['HEIRARCHY'] < thisUnit['HEIRARCHY']  ){
			let next = thisUnit['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
				
				if ( sel.HEIRARCHY == toUnitConvert.HEIRARCHY ){
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
				
				
				next --;
			}
			
			//console.log(multiplier)
			return parseFloat (value / multiplier);
		}
		else{
			let next = toUnitConvert['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
				
				if ( sel.HEIRARCHY == thisUnit.HEIRARCHY ){
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
				
				
				next --;
			}
			
			//console.log(multiplier)
			
			return parseFloat (value * multiplier);
		}
	}
	
	isEmptyObject ( OBJ ){
		return OBJ // 👈 null and undefined check
			&& Object.keys(OBJ).length === 0
			&& Object.getPrototypeOf(OBJ) === Object.prototype
	}
	
	object2array ( parameters ){
		var converted = [];
		var counter = 0;
		for ( var index in parameters ){
			var arr  ={};
			arr[index] = parameters [ index ];
			converted [ counter ] = arr;
			counter++;
		}
		return converted;
	}
	
	string_2_object	( array , escapeCharacter ){
		var length = array.length;
		var object = {};
				
		for ( var s = 0 ; s < length ; s++ ){
			var split = array[s].split( escapeCharacter );
			object[ split[ 0 ] ] = split[ 1 ];
		}
		return object;		
	}
	
	
	create_arguments ( arg , CRUD_COMMAND ) {
		var parameters = '( ';
		var fields = '( ';
		var values = [];
		
		for ( var i = 0 ; i < arg.length ; i ++ ){
			for ( var index in arg[i] ){
				values[i] = arg[i][index];
				if ( i != arg.length - 1 ){
					fields += ' '+index+',';
					parameters += ' ?, ';
				}
				else{
					fields += ' '+index+' )';
					parameters += ' ? )';
				}
			}
		}

		return {
			fields : fields,
			params : parameters,
			values : values
		}
	}
	
	getCurrentDateActual ( ){
		let date = this.getCurrentDate ().split('-');
		
	}
	
	getCurrentDate (){
		return new Date().toDateInputValue(); 
	}
	
	
	getCurrentTimeTick ( callback ){
		setInterval(()=>{
			callback();
		},1000)
	}
	
	calculateAge ( birthDate , currentDate ){
		if ( parseInt(birthDate[1]) <= currentDate[1] ){
			if ( ( parseInt(birthDate[1]) == currentDate[1] && birthDate[2] <= currentDate[2] ) || parseInt(birthDate[1]) < currentDate[1] ){
				return ( (  currentDate[0] - birthDate[0] ) );
			}
		}
		return ( (  currentDate[0] - birthDate[0] ) - 1  );
	}
	
	calculateDaysPassed ( fromDate , toDate , daysOnly ){
		let from = new Date(fromDate);
		let to = new Date(toDate);
		
		
		let Difference_In_Time = to.getTime() - from.getTime();
  
		// To calculate the no. of days between two dates
		let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
		
		let diffmonths = parseFloat(Difference_In_Days/31).toFixed(0);
		let diffyears = parseFloat(Difference_In_Days/365).toFixed(0);
		
		if (!daysOnly) {
			if (diffmonths > 0 & diffyears <= 0){
				//return `${diffmonths} months ago`;
				return {
					value : diffmonths,
					type : 'month'
				}
			}
			
			else if (diffyears > 0){
				//return `${diffyears} years ago`;
				return {
					value : diffyears,
					type : 'year'
				}
			}
		}
		//return `${Difference_In_Days} days ago`;
		return {
			value : Difference_In_Days,
			type : 'day',
		}
	}
	
	generate_id_timestamp( keyword ) {
		var timestamp = Math.floor( Date.now() / 1000 );
		return timestamp;
	}
	
	static generate_id_timestamp_w( keyword ) {
		var timestamp = Math.floor( Date.now() / 1000 );
		return keyword+''+timestamp;
	}
	
	isFunction(functionToCheck) {
		return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	}
	
	time(){
		var str = "";

		//var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
		//var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

		var now = new Date();
		
		var h = now.getHours().toString() >= 10 ? now.getHours().toString() : '0'+ now.getHours().toString();
		var m = now.getMinutes().toString() >= 10 ? now.getMinutes().toString() : '0'+ now.getMinutes().toString();
		var s = now.getSeconds().toString() >= 10 ? now.getSeconds().toString() : '0'+ now.getSeconds().toString();
		
		str +=  h +":" + m + ":"+ s;
		//document.getElementById("todaysDate").innerHTML = str;
		//console.log(str);
		//$('.time-change').val(str);
		//TIME_GLOBAL = str;
		return str;
	}
	
	paramBuilder ( potentialParams ){
		
	}
	
	listen (){
		
	}
	
	groupBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			 const key = keyGetter(item);
			 const collection = map.get(key);
			 if (!collection) {
				 map.set(key, [item]);
			 } else {
				 collection.push(item);
			 }
		});
		return map;
	}
		
	
	getCurrentAcademicYear ( ){
		//this.getCurrentDate() +' ' +
		let currentAcademicYear = (this.getCurrentDate().split('-')[0]);
		
		if ( new Date() > new Date(currentAcademicYear+'-06-01') ){
			return currentAcademicYear;
		}
		
		return currentAcademicYear - 1;
	}
	
	
	getCurrentYear( ){
		return this.getCurrentDate().split('-')[0];
	}
	
	getHHMembers (HH_LEADER_ID) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.barangay_res_setup w where w.HH_LEADER = ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [HH_LEADER_ID],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result']);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}

	getHHLeaders (param) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.barangay_res_setup w where ${param.cond}`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : param.values,
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result']);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}

	getResidentData (RESIDENT_ID) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.barangay_res_setup w where w.RESIDENT_ID = ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [RESIDENT_ID],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result'][0]);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}
	

	getPurokData (PUROK_ID) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.barangay_prk_setup w where w.PRK_ID = ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [PUROK_ID],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result'][0]);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}

	getPurokDataWithBarangay (PUROK_ID) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.barangay_prk_setup w 
							LEFT JOIN vims.barangays B ON B.BARANGAY_ID = w.BARANGAY_ID 
							where w.PRK_ID = ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [PUROK_ID],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result'][0]);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}

	getPurokDataWithBarangayByBrgyId (BARANGAY_ID) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.barangay_prk_setup w 
							LEFT JOIN vims.barangays B ON B.BARANGAY_ID = w.BARANGAY_ID 
							where B.BARANGAY_ID = ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [BARANGAY_ID],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result']);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}


	checkLocationDataExists (	
		FOREIGN_KEY , 	
		PIVOT_TABLE, 	
		FOREIGN_KEY_FIELD,
	) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT ID FROM vims.barangay_land_marks w where 
								w.FOREIGN_KEY = ? and
								w.PIVOT_TABLE = ? and
								w.FOREIGN_KEY_FIELD = ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [
								FOREIGN_KEY , 	
								PIVOT_TABLE, 	
								FOREIGN_KEY_FIELD,
							],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result'][0]);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}
	
	getLocationData (	
		FOREIGN_KEY , 	
		PIVOT_TABLE, 	
		FOREIGN_KEY_FIELD,
	) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.${PIVOT_TABLE} w where w.${FOREIGN_KEY_FIELD} = ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [FOREIGN_KEY],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result'][0]);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}


	getLocations () {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.barangay_land_marks WHERE ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [1],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result']);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}

	getBenifitTypes () {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT * FROM vims.benifit_claim_types w where ?`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [1],
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result']);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}

	getBarangays (bgy) {
		let dqbgy = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql: `SELECT * FROM barangays `+ (bgy.id !== '' ? (  `WHERE BARANGAY_ID = ?`) : 'WHERE ?'),
							db: 'DB',
							query_request : 'GET',
							index : 'brgys',
							values : [
								bgy.id !== '' ? bgy.id : 1
							],
						},	
					]
				}		
			}
		}
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dqbgy ,  ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['brgys']);
				},110);
			});
		});
	}
	

	getClaimRecords (params) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : 
							`SELECT 
								brs.FULLNAME, brs.RESIDENT_ID, brs.HH_LEADER, brs.ADDRESS,
								brs.BIRTHDAY, brs.RELATIONSHIP_TO_HH_LEADER, brs.HH_CODE,
								brs.IS_FAMILY_LEADER,
								round(DATEDIFF(CURRENT_DATE,  brs.BIRTHDAY)/365) AS AGE,
								bcr.*, (
									SELECT BENIFIT_NAME FROM benifit_claim_types WHERE ID = bcr.CLAIM_TYPE
								) as BENIFIT_NAME,
								(
									SELECT FULLNAME from barangay_res_setup WHERE RESIDENT_ID = brs.HH_LEADER
								) as HHLEADERFULLNAME 
								FROM vims.barangay_res_setup brs 
								INNER JOIN vims.benifit_claim_records bcr
								ON bcr.RESIDENT_ID = brs.RESIDENT_ID 
								WHERE ${params.cond}
								ORDER BY ${params.order}`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : params.values,
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout( ( ) => {
					resolve((JSON.parse(res))['result']);
				},110);
			} 
			, ( res ) => {
				//err
				reject(res);
			});	
		});
	}


	viewClaimRecordsFamilyMembers (params) {
		let _this = !params.MAIN_SERVICE_CONTEXT ? this : params.MAIN_SERVICE_CONTEXT;
		let residentId = params.RESIDENT_ID;
		let dateFrom = params.DATE_FROM;
		let dateTo = params.DATE_TO;
		
		return _this.getClaimRecords({
			cond : `brs.HH_LEADER = ? AND DATE_CLAIM BETWEEN ? AND ?`,
			values : [residentId, dateFrom, dateTo],
			order : `brs.FULLNAME, bcr.CLAIM_TYPE, bcr.DATE_CLAIM`
		})
	}


	viewClaimRecords (params) {
		let _this = !params.MAIN_SERVICE_CONTEXT ? this : params.MAIN_SERVICE_CONTEXT;
		let dateFrom = params.DATE_FROM;
		let dateTo = params.DATE_TO;
		let prk = params.PUROK;
		let bgy = params.BARANGAY;
		let resultData = {};

		if (prk.id == '') {
			return new Promise ( async (resolve, reject) => {
				try{
				//_this.serverRequest( dqbgy , async ( res ) => {
					let bgys = await _this.getBarangays (bgy);
					for (let i in bgys) {
						let selBgy = bgys[i];
						let popBrgy = 0;
						let popPrk = 0;
						let popHH = 0;
						if (! resultData[selBgy.BARANGAY_NAME]) {
							resultData[selBgy.BARANGAY_NAME] = {}
						}
						let prks = await _this.getPurokDataWithBarangayByBrgyId(selBgy.BARANGAY_ID);
						for (let j in prks) {
							let selPrk = prks[j];
							popPrk = 0;
							if (! resultData[selBgy.BARANGAY_NAME][selPrk.PRK_NAME]) {
								resultData[selBgy.BARANGAY_NAME][selPrk.PRK_NAME] = {};
							}
							let hhLeaders = await _this.getHHLeaders({
								cond : `(BARANGAY_ID = ? AND PUROK = ? AND IS_FAMILY_LEADER = 1)`,
								values : [
									selBgy.BARANGAY_ID, 
									selPrk.PRK_ID, 
								],
							});
							
							for (let k in hhLeaders) {
								let selHHLeader = hhLeaders[k];
								popHH = 0;
								let benifitClaimsData = await _this.getClaimRecords({
									cond : `(brs.HH_LEADER = ? OR brs.RESIDENT_ID = ?) AND DATE_CLAIM BETWEEN ? AND ?`,
									values : [
										selHHLeader.RESIDENT_ID,
										selHHLeader.RESIDENT_ID,
										dateFrom,
										dateTo,
									],
									order : `brs.IS_FAMILY_LEADER DESC, brs.FULLNAME`
								});
								resultData
									[selBgy.BARANGAY_NAME]
									[selPrk.PRK_NAME]
									[selHHLeader.RESIDENT_ID] 
										= {}
								resultData
									[selBgy.BARANGAY_NAME]
									[selPrk.PRK_NAME]
									[selHHLeader.RESIDENT_ID]
									['contents']
										= benifitClaimsData;
								
								let grouped = _this.groupBy(benifitClaimsData, x => x.RESIDENT_ID);
								popHH = grouped.size;
								
								resultData
									[selBgy.BARANGAY_NAME]
									[selPrk.PRK_NAME]
									[selHHLeader.RESIDENT_ID]
									['population']
										= popHH
								resultData
									[selBgy.BARANGAY_NAME]
									[selPrk.PRK_NAME]
									[selHHLeader.RESIDENT_ID]
									['household_leader']
										= selHHLeader.FULLNAME
								resultData
									[selBgy.BARANGAY_NAME]
									[selPrk.PRK_NAME]
									[selHHLeader.RESIDENT_ID]
									['household_code']
										= selHHLeader.HH_CODE

								popPrk += popHH;
								popBrgy += popHH;
							} 
							
							resultData[selBgy.BARANGAY_NAME][selPrk.PRK_NAME]['population'] 
								= popPrk;
						}
						resultData[selBgy.BARANGAY_NAME]['population'] 
							= popBrgy;
					}
					let res = []
					for (let i in resultData) {
						resultData[i]['barangay_name'] = i;
						res.push(resultData[i])
					}
					
					resolve(res.sort((a,b) => b.population - a.population));
					
				//});
				}catch(e){
					console.log(e)
					reject(e);
				}
			});
		} else {
			return new Promise ( async (resolve, reject) => {
				try {
					
					let prks = await _this.getPurokDataWithBarangay(prk.id);
					let hhLeaders = await _this.getHHLeaders({
						cond : `(PUROK = ? AND IS_FAMILY_LEADER = 1)`,
						values : [prk.id],
					});
					resultData[prks.BARANGAY_NAME] = {};
					resultData[prks.BARANGAY_NAME][prk.name] = {};
					let popPrk = 0;
					let popHH = 0;
					
					for(let i in hhLeaders) {
						let benifitClaimsData = await _this.getClaimRecords({
							cond : `(brs.HH_LEADER = ? OR brs.RESIDENT_ID = ?) AND DATE_CLAIM BETWEEN ? AND ?`,
							values : [
								hhLeaders[i]['RESIDENT_ID'], 
								hhLeaders[i]['RESIDENT_ID'], 
								dateFrom,
								dateTo,
							],
							order : `brs.IS_FAMILY_LEADER DESC, brs.FULLNAME`
						});
						let grouped = _this.groupBy(benifitClaimsData, x => x.RESIDENT_ID);
							popHH = grouped.size;
							popPrk += popHH;
						resultData[prks.BARANGAY_NAME][prk.name][hhLeaders[i]['RESIDENT_ID']] = {}
						resultData[prks.BARANGAY_NAME][prk.name][hhLeaders[i]['RESIDENT_ID']]['contents'] = [];
						resultData[prks.BARANGAY_NAME][prk.name][hhLeaders[i]['RESIDENT_ID']]['contents'] = 
							benifitClaimsData;
						resultData[prks.BARANGAY_NAME][prk.name][hhLeaders[i]['RESIDENT_ID']]['population'] = 
							popHH
						resultData[prks.BARANGAY_NAME][prk.name][hhLeaders[i]['RESIDENT_ID']]['household_leader'] = 
							hhLeaders[i].FULLNAME
						resultData[prks.BARANGAY_NAME][prk.name][hhLeaders[i]['RESIDENT_ID']]['household_code'] = 
							hhLeaders[i].HH_CODE	
					}
					resultData[prks.BARANGAY_NAME]['population'] = '-';
					resultData[prks.BARANGAY_NAME][prk.name]['population'] = popPrk;

					let res = []
					for (let i in resultData) {
						resultData[i]['barangay_name'] = i;
						res.push(resultData[i])
					}
					resolve(resultData);
				} catch (e) {
					reject(e);
				}
			});
		}
	}

	getResidentOtherDetails (argss) {
		let dataQuery = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `select RS.FULLNAME,RS.RESIDENT_ID,RS.BIRTHDAY from vims.barangay_res_setup RS
									where RS.HH_LEADER = ?`,
							db : 'DB',
							index : 'hh_members',
							query_request : "GET",
							values : [argss.RESIDENT_ID]
						},	
						{
							sql : `select * from barangay_prk_setup where PRK_ID = ?`,
							db : 'DB',
							index : 'prk',
							query_request : "GET",
							values : [argss.PUROK]
						},
						{
							sql : `select FULLNAME,HH_LEADER,RESIDENT_ID from barangay_res_setup where RESIDENT_ID = ?`,
							db : 'DB',
							index : 'hh_leader',
							query_request : "GET",
							values : [argss.HH_LEADER]
						},
						
					]
				}	
			}
			
		};
		return new Promise ((resolve, reject) => {
			this.serverRequest( dataQuery , ( res ) => {
				setTimeout ( ( ) =>{
					let hhmems = JSON.parse(res);
					argss['hh_members'] = hhmems['hh_members'];
					if ( hhmems['prk'][0] )
						argss['PUROK_NAME'] = hhmems['prk'][0]['PRK_NAME'];
					if ( hhmems['hh_leader'][0] )
						argss['hh_leader'] = hhmems['hh_leader'][0]['FULLNAME'];
					resolve(argss);	
				}, 100);
			}, err => {
				reject(err);
			});
		});
	}

	votersList (votersQueryObject = {}) {
		let totalCounts = {
			barangays : 0,
			residents : 0,
			households : 0,
			kagawads : 0,
		}
		let votersListObject = {};
		let dataQueryBrgy = {
			type: "POST",
			url : this.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `select B.BARANGAY_NAME, B.BARANGAY_ID,
								IF(CONCAT(C.FIRSTNAME,' ',C.LASTNAME) IS NOT NULL , CONCAT(C.FIRSTNAME,' ',C.LASTNAME) , '-') BARANGAY_CAPTAIN_NAME  
								FROM vims.barangays B
								LEFT JOIN vims.barangay_res_setup  C ON C.RESIDENT_ID = B.BARANGAY_CAPTAIN `+
								(! votersQueryObject['barangay_id'] ? `where ?` : 'where B.BARANGAY_ID = ?'),
							db : 'DB',
							index : 'result',
							query_request : "GET",
							values : (! votersQueryObject['barangay_id'] ? [1] : [votersQueryObject['barangay_id']] )
						},	
					]
				}	
			}
		};
		return new Promise ((resolve, reject) => {
			this.serverRequest( dataQueryBrgy , ( brgy ) => {
				setTimeout ( ( ) =>{
					let barangays = JSON.parse(brgy).result;
					for (let i in barangays) {
						let selBrgy = barangays[i];
						votersListObject[selBrgy.BARANGAY_ID] = {
							'barangay_name' : selBrgy.BARANGAY_NAME,
							'barangay_id' : selBrgy.BARANGAY_ID,
							'barangay_captain' : selBrgy.BARANGAY_CAPTAIN_NAME,
							'kagawads' : {},
							'kagawad_count' : 0,
							'zone_count' : 0,
							'house_hold_count' : 0,
							'members_count' : 0,
						}

						let dataQueryKagawad = {
							type: "POST",
							url : this.urls["generic"].url,
							data : {
								data : {
									request : 'generic',
									REQUEST_QUERY : [
										{
											sql : `SELECT RESIDENT_ID, PRECINCT_NUMBER, CONCAT(FIRSTNAME,' ',LASTNAME) BRGY_KAGAWAD_NAME 
												FROM vims.barangay_res_setup `+ 
												`WHERE BARANGAY_ID = ? AND IS_BARANGAY_KAGAWAD = ? `+
												(! votersQueryObject['kagawad_id'] ? `` : `AND RESIDENT_ID = ?`),
											db : 'DB',
											index : 'result',
											query_request : "GET",
											//values : [selBrgy.BARANGAY_ID, 1]
											values : (! votersQueryObject['kagawad_id'] ? [selBrgy.BARANGAY_ID, 1] : 
												[selBrgy.BARANGAY_ID, 1, votersQueryObject['kagawad_id']] )
										},	
									]
								}	
							}
						}
						this.serverRequest( dataQueryKagawad , ( kgwd ) => {
							setTimeout ( ( ) => {
								let kgwds = JSON.parse(kgwd).result;
								for (let kg in kgwds) {
									let selkgwd = kgwds[kg]
									votersListObject[selBrgy.BARANGAY_ID].kagawads[`KGWD-`+selkgwd.RESIDENT_ID] = {
										'kagawad_name' : selkgwd.BRGY_KAGAWAD_NAME,
										'barangay_id' : selBrgy.BARANGAY_ID,
										'zones' : {},
										house_hold_count : 0,
										members_count : 0,
										zone_count : 0,
									}
									votersListObject[selBrgy.BARANGAY_ID].kagawad_count++;
									let dataQueryZone = {
										type: "POST",
										url : this.urls["generic"].url,
										data : {
											data : {
												request : 'generic',
												REQUEST_QUERY : [
													{
														sql : `select Z.PRK_NAME , Z.BARANGAY_ID, Z.PRK_ID, ZLDR.PRECINCT_NUMBER, KGWD.PRECINCT_NUMBER,
															IF(CONCAT(ZLDR.FIRSTNAME,' ',ZLDR.LASTNAME) IS NOT NULL , CONCAT(ZLDR.FIRSTNAME,' ',ZLDR.LASTNAME) , '-') ZLDR_LEADER_NAME ,
															IF(CONCAT(KGWD.FIRSTNAME,' ',KGWD.LASTNAME) IS NOT NULL , CONCAT(KGWD.FIRSTNAME,' ',KGWD.LASTNAME) , '-') BRGY_KAGAWAD_NAME 
															FROM vims.barangay_prk_setup Z 
															LEFT JOIN vims.barangay_res_setup  ZLDR ON ZLDR.RESIDENT_ID = Z.PRK_LEADER 
															LEFT JOIN vims.barangay_res_setup  KGWD ON KGWD.RESIDENT_ID = Z.BARANGAY_KAGAWAD 
															where Z.BARANGAY_ID = ? AND Z.BARANGAY_KAGAWAD = ? `+
															(! votersQueryObject['zone_id'] ? `` : `AND Z.PRK_ID = ?`),
														db : 'DB',
														index : 'result',
														query_request : "GET",
														values : (! votersQueryObject['zone_id'] ? [selBrgy.BARANGAY_ID, selkgwd.RESIDENT_ID] : 
															[selBrgy.BARANGAY_ID, selkgwd.RESIDENT_ID, votersQueryObject['zone_id']])
													},	
												]
											}	
										}
									}

									this.serverRequest( dataQueryZone , ( zone ) => {
										setTimeout ( () => {
											let zones = JSON.parse(zone).result;
											for (let j in zones) {
												let zn = zones[j];
												votersListObject[selBrgy.BARANGAY_ID]
													.zone_count++;
												votersListObject[selBrgy.BARANGAY_ID]
													.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
													.zone_count++;
												votersListObject[selBrgy.BARANGAY_ID]
													.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
													.zones[zn.PRK_ID] = 
												{
													zone_name : zn.PRK_NAME,
													zone_leader : zn.ZLDR_LEADER_NAME,
													zone_kagawad : zn.BRGY_KAGAWAD_NAME,
													zone_id : zn.PRK_ID,
													hh_leaders : {},
													house_hold_count : 0,
													members_count : 0,
												};

												let dataQueryHHLeader = {
													type: "POST",
													url : this.urls["generic"].url,
													data : {
														data : {
															request : 'generic',
															REQUEST_QUERY : [
																{
																	sql : `select HH.RESIDENT_ID, HH.PRECINCT_NUMBER,
																		IF(CONCAT(HH.FIRSTNAME,' ',HH.LASTNAME) IS NOT NULL , CONCAT(HH.FIRSTNAME,' ',HH.LASTNAME) , '-') HH_LEADER_NAME 
																		FROM vims.barangay_res_setup HH 
																		where HH.PUROK = ? AND IS_FAMILY_LEADER = ? `+
																		(! votersQueryObject['house_hold_leader_id'] ? `` : `AND HH.RESIDENT_ID = ?`),
																	db : 'DB',
																	index : 'result',
																	query_request : "GET",
																	values : (! votersQueryObject['house_hold_leader_id'] ? [zn.PRK_ID, 1] : 
																		[zn.PRK_ID, 1, votersQueryObject['house_hold_leader_id']])
																},	
															]
														}	
													}
												}
												this.serverRequest( dataQueryHHLeader , ( hhleaders ) => {
													setTimeout ( ( ) =>{
														let hhleads = JSON.parse(hhleaders).result;
														for (let k in hhleads) {
															let hh = hhleads[k];
															votersListObject[selBrgy.BARANGAY_ID]
																.house_hold_count++;
															votersListObject[selBrgy.BARANGAY_ID]
																.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
																.house_hold_count++;
															votersListObject[selBrgy.BARANGAY_ID]
																.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
																.zones[zn.PRK_ID]
																.house_hold_count++;
															votersListObject[selBrgy.BARANGAY_ID]
																.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
																.zones[zn.PRK_ID]
																.hh_leaders[`HH-`+hh.RESIDENT_ID] =
															{
																hh_leader_name : hh.HH_LEADER_NAME,
																hh_members : {},
																members_count : 0,
															};

															let dataQueryMembers = {
																type: "POST",
																url : this.urls["generic"].url,
																data : {
																	data : {
																		request : 'generic',
																		REQUEST_QUERY : [
																			{
																				sql : `select m.RESIDENT_ID, m.PRECINCT_NUMBER, m.RELATIONSHIP_TO_HH_LEADER , m.BIRTHDAY,
																					IF(CONCAT(m.FIRSTNAME,' ',m.LASTNAME) IS NOT NULL , CONCAT(m.FIRSTNAME,' ',m.LASTNAME) , '-') FNAME 
																					FROM vims.barangay_res_setup m 
																					where m.HH_LEADER = ? AND IS_FAMILY_LEADER = ?`,
																				db : 'DB',
																				index : 'result',
																				query_request : "GET",
																				values : [hh.RESIDENT_ID, 0]
																			},	
																		]
																	}	
																}
															}
															this.serverRequest( dataQueryMembers , ( members ) => {
																setTimeout ( ( ) =>{
																	let mems = JSON.parse(members).result;
																	for (let m in mems) {
																		let mms = mems[m]
																		votersListObject[selBrgy.BARANGAY_ID]
																			.members_count++;
																		votersListObject[selBrgy.BARANGAY_ID]
																			.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
																			.members_count++;
																		votersListObject[selBrgy.BARANGAY_ID]
																			.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
																			.zones[zn.PRK_ID]
																			.members_count++;
																		votersListObject[selBrgy.BARANGAY_ID]
																			.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
																			.zones[zn.PRK_ID]
																			.hh_leaders[`HH-`+hh.RESIDENT_ID]
																			.members_count++;
																		votersListObject[selBrgy.BARANGAY_ID]
																			.kagawads[`KGWD-`+selkgwd.RESIDENT_ID]
																			.zones[zn.PRK_ID]
																			.hh_leaders[`HH-`+hh.RESIDENT_ID] 
																			.hh_members[`MM`+mms.RESIDENT_ID] = {
																				'FNAME' : mms.FNAME,
																				'PRECINCT_NUMBER' : mms.PRECINCT_NUMBER,
																				'RELATIONSHIP' : mms.RELATIONSHIP_TO_HH_LEADER,
																				'BIRTHDAY' : mms.BIRTHDAY
																			};
																	}
																	//resolve(votersListObject)
																}, 100)
															}, err => reject(err))
														}
													}, 100)
												}, err => reject(err))
											}
										},100)
									}, err => reject(err))
								}
							}, 100)
						}, err => reject(err))
					}		
				}, 100);
				resolve(votersListObject)
			}, err => {
				reject(err);
			});
		});
	}

}
