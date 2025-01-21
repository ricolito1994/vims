<?php

use server\routes\start as start;
require "start.route.server.php";
session_start();

$sql = "SELECT * FROM profile WHERE username = ? AND password = ?";


$res = $registry->get ( 'DB' )->execute ( $sql , array ( $_POST['username'] , $_POST['password'] ) , \PDO::FETCH_ASSOC )->fetchAll();


if ( count ( $res ) > 0 ){

	$_SESSION['hr_session_fullname'] = $res[0]['empfirst'].' '.$res[0]['empmid'].' '.$res[0]['emplast'];
	$_SESSION['hr_session_firstname'] = $res[0]['empfirst'];
	$_SESSION['hr_session_lastname'] = $res[0]['emplast'];
	$_SESSION['hr_session_empid'] = $res[0]['empid'];
	$_SESSION['hr_login_obj'] = $res[0];
	echo 1;
}
else{
	echo 0;
}


?>