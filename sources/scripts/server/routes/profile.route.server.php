<?php
require "start.route.server.php";
use server\controller\profile as Profile;



if(isset($_POST['data']))
$data = $_POST['data'];
else
	$data = $_POST;


$profile = new Profile\Profile ( $data );





switch ( $data['request'] ){
	
	case "generic":
		echo json_encode ( $profile -> generic_query () );
	break;
	
	
	case "file_upload":
		echo Profile\Profile::FILE_UPLOAD ($data);	
	break;
	case "backup_database":
		//var_dump ( $data );
		echo Profile\Profile::compileDatabase ($_POST ,$data['arg']['desired_directory']);	
	break;
	
	case "restore_database":
		echo Profile\Profile::restoreDatabase ($data ,$data['desired_directory']);	
		//VAR_DUMP(	$data);
	break;
	
	case "run_auto_backup":
		Profile\Profile::autoBackUp ($_POST ,$data['arg']['desired_directory']);
	break;
	
	
	case "check_url_multi":
		echo Profile\Profile::MULTI_FILENAME_EXISTS ( $data['filenames'] );
	break;
	
	
	case "check_url":
		echo Profile\Profile::FILENAME_EXISTS ( $data['filename'] );
	break;
}


?>