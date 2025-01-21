<?php
namespace server\classes\controller;
use server\classes\registry as registry;
use server\classes\Connection as Connection;

class Controller{
	public $data;
	public $connection;
	public $databases;
	
	
	public function __construct( $data ){
		$this -> data = $data;
		//$this -> db_name = isset ( $data [ 'db' ] ) ? $data['db'] : 'DB';
		
		$this -> databases = array ( ); 
		
		$dbs = registry\Registry::instantiate()->objects;
		
		foreach ( $dbs  as $k => $v ){
			$this -> databases [ $k ] = $v;
		}
		
		
		#print_r ($this -> data);
		
		//$this -> connection = registry\Registry::instantiate()->GET( $this -> db_name );
	}
		
	public function generic_query  ( ){
		ini_set('display_errors', 1);
		$response = array ( );
		foreach ( $this->data ['REQUEST_QUERY' ] as $k => $v ){
			$connection = $this -> databases['DB'];
			
			if ( isset ( $v['db'] ) ){
				$connection = $this -> databases[ $v['db'] ];
			}
			
			#$req = $this->connection->execute( $v['sql'] , $v['values'] , \PDO :: FETCH_ASSOC );
			$req = $connection->execute( $v['sql'] , $v['values'] , \PDO :: FETCH_ASSOC );
			
			if ( $v['query_request'] == 'GET' ){
				if ( !isset($v['fetch_method']) ) 
					$response [$v['index']] = $req -> fetchAll ( );
				else if ( $v['fetch_method'] == 'FETCH' ){
					$response [$v['index']] = $req -> fetch ( );
				}
			}
			//sleep(1);
		}
		return ($response);
	}
	
	
	public static function FILE_UPLOAD( $data = [] ) {
		//var_dump($_FILES);
		//self::CREATE_DIRECTORY($data['dir']);
		$dir = $data['dir'];
		IF ( $data['createdir'] ){
			$dir = self::CREATE_DIRECTORY($data['dir']);
		}
		move_uploaded_file($_FILES['file']["tmp_name"] , $dir.'/'.$_FILES['file']["name"]);
		
		return '/sources/complist/'.$data['dir'].'/'.$_FILES['file']["name"];
	}
	
	public static function CREATE_DIRECTORY ( $desireddirectory = '' ){
		if (!file_exists("../../../complist/$desireddirectory")) {
			mkdir("../../../complist/$desireddirectory", 0777, true);
		}
		return "../../../complist/$desireddirectory";
	}
	
	public static function MULTI_FILENAME_EXISTS( $filenames ){
		$exists = true;
		foreach ( $filenames as $filename ){
			$file = $filename;
			$file_headers = @get_headers($file);
			//if($file_headers[0] == 'HTTP/1.1 404 Not Found') {
			//	var_dump($file_headers);
			/* if($file_headers[0] ??= 'HTTP/1.1 404 Not Found'){
				$exists = false;
				continue;
			}
			else{
				return $file;
			} */
			if($file_headers){
				$exists = false;
				continue;
			}
			else{
				return $file;
			}
		}
		return $exists;
		
	}
	
	// MAKE SQL FILE
	public static function EXPORT_DATABASE($host, $user, $pass ,$name, $tables=false, $backup_name=false, $desireddirectory = ''){ 
		set_time_limit(3000); 
		$mysqli = new \mysqli($host,$user,$pass,$name); 
		$mysqli->select_db($name); 
		$mysqli->query("SET NAMES 'utf8'");
		$queryTables = $mysqli->query('SHOW TABLES'); 
		while($row = $queryTables->fetch_row()) { 
			$target_tables[] = $row[0]; 
		}	
		if($tables !== false) { 
			$target_tables = array_intersect( $target_tables, $tables); 
		} 
		$content = "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\r\nSET time_zone = \"+00:00\";\r\n\r\n\r\n/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\r\n/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;\r\n/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;\r\n/*!40101 SET NAMES utf8 */;\r\n--\r\n-- Database: `".$name."`\r\n--\r\n\r\n\r\n";
		foreach($target_tables as $table){
			if (empty($table)){ continue; } 
			$result	= $mysqli->query('SELECT * FROM `'.$table.'`');  	
			$fields_amount=$result->field_count;  
			$rows_num=$mysqli->affected_rows; 	
			$res = $mysqli->query("SHOW CREATE TABLE $name.".$table);	
			$TableMLine=$res->fetch_row(); 
			
			$tblline = "";
			foreach ( explode(' ',$TableMLine[1]) as $k => $str ){
				if ( $k == 2 ){
					$str = "`$name`.". $str;
				}
					
				
				$tblline .=" ". $str;
			} 
			
			
			//$content .= "\n\n".$TableMLine[1].";\n\n";  
			$content .= "\n\n".$tblline.";\n\n";		
			//var_dump(explode(' ',$TableMLine[1]));
			//echo $tblline;
			//echo '<br><br>';
			//$TableMLine[1]=str_ireplace('CREATE TABLE `$name.','CREATE TABLE IF NOT EXISTS `',$TableMLine[1]);
			
			$tblline=str_ireplace('CREATE TABLE `','CREATE TABLE IF NOT EXISTS `',$tblline);
			//echo $content.'<br><br><Br>';
			for ($i = 0, $st_counter = 0; $i < $fields_amount;   $i++, $st_counter=0) {
				while($row = $result->fetch_row())	{ //when started (and every after 100 command cycle):
					if ($st_counter%100 == 0 || $st_counter == 0 )	{
						$content .= "\nINSERT INTO $name.".$table." VALUES";
					}
					$content .= "\n(";    
					for($j=0; $j<$fields_amount; $j++){
						$row[$j] = str_replace("\n","\\n", addslashes($row[$j]) ); 
						if (isset($row[$j])){
							$content .= '"'.$row[$j].'"' ;
							}  else{
								$content .= '""';
							}	   
							if ($j<($fields_amount-1)){
								$content.= ',';
							}   
					}       
					$content .=")";
					//every after 100 command cycle [or at last line] ....p.s. but should be inserted 1 cycle eariler
					if ( (($st_counter+1)%100==0 && $st_counter!=0) || $st_counter+1==$rows_num) {
						$content .= ";";
					} else {
						$content .= ",";
					}	
					$st_counter=$st_counter+1;
				}
			} $content .="\n\n\n";
		}
		$content .= "\r\n\r\n/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\r\n/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\r\n/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;";
		$backup_name = $backup_name ? $backup_name : $name.'___('.date('H-i-s').'_'.date('d-m-Y').').sql';
		#ob_get_clean(); header('Content-Type: application/octet-stream');  header("Content-Transfer-Encoding: Binary");  header('Content-Length: '. (function_exists('mb_strlen') ? mb_strlen($content, '8bit'): strlen($content)) );    header("Content-disposition: attachment; filename=\"".$backup_name."\""); 
		#echo $content; exit;
		#echo $content;
		//save file
		$dirbackup = "$desireddirectory/backupdb/db/".$name;
		/* 
		*/
		
		if (!file_exists($dirbackup)) {
			echo $dirbackup;
			mkdir ($dirbackup);	
		}
		$filezip = '/db-backup-'.time().'-'.(md5($name)).'.sql';
		$filename = $dirbackup.$filezip;
		$handle = fopen($filename,'w+');
		fwrite($handle,$content);
		fclose($handle);
		
		//return $filename;
		return [
			"filename" => $filename,
			"jsonfilename" => "/backupdb/db/".$name.$filezip,
		];
	}
	
	public static function compileDatabase( $data = [] , $desireddirectory = '' ){
		$LOCAL_DATABASE = registry\Registry::instantiate()-> GET ( 'DB' );
		$FILENAMES = [];
		$JSONDB = [];
		$dds = "/vims/sources/complist/$desireddirectory";
		$desireddirectory = SELF :: CREATE_DIRECTORY ( $desireddirectory );
		
		if (!file_exists("$desireddirectory/backupdb/")) {
			//echo $dirbackup;
			mkdir ("$desireddirectory/backupdb/");
		}
		
		if (!file_exists("$desireddirectory/backupdb/db/")) {
			//echo $dirbackup;
			mkdir ("$desireddirectory/backupdb/db/");
		} 
		
		SLEEP(2);
		
		//var_dump($data['data']['arg']['dbs']);
		foreach ( $data['data']['arg']['dbs'] as $k => $v ){
			
			IF ( $v==1 ){
				$FNAME = SELF :: EXPORT_DATABASE ( $LOCAL_DATABASE->HOST, $LOCAL_DATABASE->USERNAME,$LOCAL_DATABASE->PASSWORD,$k,false,$k,$desireddirectory);
				$FILENAMES[] = $FNAME['filename'];
				
				
				$JSONDB[] = [
					'db' => $k,
					'file' => $FNAME ['jsonfilename'],
				];
				
			}
		}
		//ZOOM NI STO 1pm
	
			
			$zip = new \ZipArchive;
			
			if(!file_exists("$desireddirectory/compressed/")){
				mkdir("$desireddirectory/compressed/");
			}
			
			$fnm = "$desireddirectory/compressed/".'_'.time().'_'.'.zip';
			$fnn = "$dds/compressed/".'_'.time().'_'.'.zip';
			
			
			if ( $zip -> open ( $fnm , \ZIPARCHIVE :: CREATE	) !== TRUE ) {
				die();
			}
			
			foreach ( $FILENAMES as $v ){
				$fname = $v;
				$zip -> addFile ( $fname );
				sleep(3);
			}
			
			$json = fopen("$desireddirectory/compressed/maintenancedb.json",'w');
			fwrite($json,json_encode($JSONDB));
			
			$zip -> addFile ( "$desireddirectory/compressed/maintenancedb.json" );
			$zip -> close ();
			
		return $fnn ;
	}
	
	
	/* auto backup windows */
	public static function autoBackUp(){
		//system("cmd /c C:\xampp\htdocs\vims\sources\scripts\server\routes\autobackup.bat'");
		//exec('start /B C:\xampp\htdocs\vims\sources\scripts\server\routes\autobackup.bat');
		//exec('c:\WINDOWS\system32\cmd.exe /c START C:\xampp\htdocs\vims\sources\scripts\server\routes\autobackup.bat');
		//system("c:\WINDOWS\system32\cmd.exe"); 
		//var_dump(shell_exec (" /c START C:\xampp\htdocs\vims\sources\scripts\server\routes\autobackup.bat"));
		//shell_exec('start  c:\WINDOWS\system32\cmd.exe /c START C:\xampp\htdocs\vims\sources\scripts\server\routes\autobackup.bat');
		//system("start c:\\WINDOWS\\system32\\cmd.exe"); 
	}
	
	
	public static function restoreDatabase( $data = [] , $desireddirectory = "" ){
		//echo 'fn ' ;var_dump($_FILES['filedbs']["tmp_name"][0]);
		$ddir = $desireddirectory;
		$desireddirectory = SELF :: CREATE_DIRECTORY ( "$desireddirectory/uploads" );
		
		
		$targetdir = "$desireddirectory/".basename($_FILES['filedbs']["name"][0]);
		$LOCAL_DATABASE = registry\Registry::instantiate()-> GET ( 'DB' );
		
		//echo $targetdir;
		
		
		if (move_uploaded_file($_FILES['filedbs']["tmp_name"][0] , $targetdir )){
			$zip = new \ZipArchive;
			//var_dump($zip->open($targetdir));
			//	var_dump($local);
			if ($zip->open($targetdir) === TRUE) {
				
				$extractedfiledir = ( "$desireddirectory/extracted/" );
				//echo $extractedfiledir;
				$zip->extractTo($extractedfiledir);
				$zip->close();
				$json = file_get_contents("$desireddirectory/extracted/complist/$ddir/compressed/maintenancedb.json");
				$json = json_decode($json, TRUE);
				
				
				foreach ( $json as $k => $v ){
					$local = $v['db'];
					$file = "$desireddirectory/extracted/complist/$ddir".$v['file'];
					//echo " $file";
				
					/* $SELECTEDDB = GO_DADDY_CONNECTION :: CONNECT_CREATE_DATABASE_( $local , 
					[
						
						"username" =>$LOCAL_DATABASE->username,
						"password" =>$LOCAL_DATABASE->password,
						"host" =>$LOCAL_DATABASE->host,
					] ); */
					$SELECTEDDB = $LOCAL_DATABASE->create_connect_database( $local );
					//$SELECTEDDB = Connection :: create_connect_database( $local );
					SELF :: uploadMysqlFile($file , $SELECTEDDB); 
				}
				
			
			}
		}
			
	}
	
	
	
	public static function uploadMysqlFile ( $filename , $WB ){
		/* upload to student portal */
		#$webdb->execute ("DROP DATABASE IF EXISTS {$SELECTED_DBASE}",[],PDO::FETCH_ASSOC);
		
		#$WB = GO_DADDY_CONNECTION :: CONNECT_CREATE_DATABASE ( $SELECTED_DBASE );
		//var_dump($filename);
		$query = '';
		$sqlScript = file($filename);
		foreach ($sqlScript as $line)	{
			
			$startWith = substr(trim($line), 0 ,2);
			$endWith = substr(trim($line), -1 ,1);
			
			if (empty($line) || $startWith == '--' || $startWith == '/*' || $startWith == '//') {
				continue;
			}
				
			$query = $query . $line;
			if ($endWith == ';') {
				#mysqli_query($conn,$query) or die('<div class="error-response sql-import-response">Problem in executing the SQL query <b>' . $query. '</b></div>');
				//echo $query;
				$WB->execute($query,[],\PDO::FETCH_ASSOC);
				$query= '';		
			}
		}
	}
	

	public static function FILENAME_EXISTS($filename){

		$exists = 1;
		$file = $filename;
		$file_headers = @get_headers($file);
		if($file_headers[0] == 'HTTP/1.1 404 Not Found') {
		    $exists = 0;
		}
		return $exists;
	}
	
	public static function Obj2SqlParser ( ){}
	
}

?>