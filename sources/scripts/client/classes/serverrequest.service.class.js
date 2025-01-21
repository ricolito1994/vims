export class ServerRequest {
	
	constructor ( requestObject ){
		this.request = requestObject;
	}
	
	
	queryRequest ( async ){
		//console.log(!async ? async : true);
		return new Promise ( ( resolve, reject ) => {
			$.ajax({
				type : this.request.type,
				url : this.request.url,
				data : this.request.data,
				async : !async ? true : async,
				success :  ( data ) => {
					resolve ( data );
				},
				// error 404 - error return frm server
				error :  ( data ) => {
					reject ( data );
				}
			});
		});
	}
	
	
	queryRequestFileUpload( async ){
		//console.log(this.request.url)
		return new Promise ( ( resolve, reject ) => {
			$.ajax({
				type : this.request.type,
				url : this.request.url,
				data : this.request.data.data.formdata,
				async : !async ? true : async,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
				success :  ( data ) => {
					resolve ( data );
				},
				// error 404 - error return frm server
				error :  ( data ) => {
					reject ( data );
				}
			});
		});
	}
	
	/* query helpers */
	static callbackquery  ( field , value , currentIndex , length ){
		var f;
		if ( currentIndex != length - 1 ){
			f = field + ' = ?, ';
					
		}else{
			f = field + ' = ?';
		}
		return {
			f : f
		}
	}
	
	static queryBuilder( a , SQL_COMMAND, conditionOption, conditionToken ) {
		
		var commands = {
			
			INSERT:{
				initialValue : '(',
				secondsValue : '(',
				callback : function ( field , value , currentIndex , length ){
					var f,v;
					if ( currentIndex != length - 1 ){
						f = ' '+field+',';
						v = ' ?, ';
					}else{
						f = ' '+field+' )';
						v = ' ? )';
					}
					return {
						f : f,
						v : v
					}
				}
				
			},
			UPDATE : {
				initialValue : 'SET ',
				callback : ServerRequest.callbackquery,
			},
			CONDITION : {
				initialValue : 'WHERE',
				callback : function ( field , value , currentIndex , length ){
					var f;
					let token = ( typeof conditionToken != "undefined" ? 'LIKE' : '=' );
					if ( currentIndex != length - 1 ){
						f = ' '+field + ' '+token+' ? '+( typeof conditionOption != "undefined" ? conditionOption : "AND" );
					}else{
						f = ' '+field + ' '+token+' ?';
					}
					return {
						f : f
					}
				},
			}
			
		};
		
		var returnObject = {
			initial:'',
			seconds : '',
			values :[]
		};
		
		var initialValue = commands[ SQL_COMMAND ].initialValue;
		var secondsValue = typeof commands[ SQL_COMMAND ].secondsValue!='undefined' ? commands[ SQL_COMMAND ].secondsValue : 'n/a';
		var len = ( a.length );
	
		for ( var i = 0 ; i < len ; i ++ ){
			
			for ( var index in a[i] ){
				
				let vals = ( typeof conditionToken != "undefined" ? '%'+a[i][index]+'%' : a[i][index] );
				vals = Array.isArray(vals) ? JSON.stringify(vals) : vals;
				returnObject.values.push(vals);
				var cb = commands [ SQL_COMMAND ].callback ( index , returnObject.values[i], i, len );
					
				initialValue += cb.f;
					
				if ( cb.v )
					secondsValue += cb.v;
					

			}
		}
	
		
		returnObject.initial = initialValue;
		
		if ( secondsValue )
			returnObject.seconds = secondsValue;
		
		return returnObject;
	}
	
}