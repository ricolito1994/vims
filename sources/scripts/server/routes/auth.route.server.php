<?php

$data = $_POST['data'];
session_start();
switch ( $data['request'] ){
	
	case "login" :
		
		foreach ( $data['login_data'][0] as $k => $v ){
			$_SESSION[ $k ] = $v;
		}
		#print_r ( $_SESSION );
		#header('Location: /studentadmission/');
		
	break;
	
	case "logout" :
		
		session_unset();
		session_destroy();
		header('Location: /vims/login');
	break;
	
	case "SWITCH_ACCOUNT":
		
		session_unset();
		//session_destroy();
		
		foreach ( $data['login_data'] as $k => $v ){
			$_SESSION[ $k ] = $v;
		}
		
		//header('Location: /vims/login');
	break;
	
}

?>