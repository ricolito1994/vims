<?php


#namespace server\maintenance\autobackupdb;
#use  server\routes\start as start;
$root = dirname(dirname(__FILE__));
#var_dump(dirname(dirname(__FILE__)));
#require_once '../server/routes/start.route.server.php';
require($root.'/routes/start.route.server.php');
date_default_timezone_set('Asia/Manila');
$itsBackUpTime = '10:13:20';


WHILE (TRUE){
	
	
	
	if ( $itsBackUpTime == date("h:i:s") ){
		//echo date("Y-m-d").' '.date("h:i:s");
		//echo 'bACKUP!';
	}
	echo "\n";
	
	sleep(1);
}


?>