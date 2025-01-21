<?php 

require "start.route.server.php";
use server\controller\profile as Profile;

$DIR = "FARMACIACJMAR";

$LOCAL_DATABASE = $registry-> GET ( 'DB' );

$MAINTENANCE_SETTING=$LOCAL_DATABASE->execute( "SELECT * FROM vims.maintenance LIMIT 1" ,[] , \PDO :: FETCH_ASSOC )->fetch();

$alive_every = "30";
$back_up_time = $MAINTENANCE_SETTING['back_up_time'];

echo "Backup time $back_up_time\n";
echo "Stay alive every $alive_every mins";

/* VAR_DUMP($MAINTENANCE_SETTING);


if ($MAINTENANCE_SETTING['IS_AUTO_BACK_UP_RUNNING'] == 1){
	exit("ONLY ONE INSTANCE OF AUTO BACK UP IS ALLOWED!");
}

$LOCAL_DATABASE->execute( "UPDATE vims.maintenance SET IS_AUTO_BACK_UP_RUNNING = 1" ,[] , \PDO :: FETCH_ASSOC );
 */
 
#var_dump(JSON_DECODE($MAINTENANCE_SETTING['db_to_backup'],true));
while (true){
	//$alive_every = 30;
	
	$date = new \DateTime("now", new DateTimeZone('Asia/Manila') );
	$current_time =  $date->format('H:i:s');
	$split_time = explode ( ":" , $current_time );
	$hrs= $split_time[0];
	$min= $split_time[1];
	$sec= $split_time[2];
	$alive_once = false;
	
	if ( $min % $alive_every == 0  && $sec == 0){
		$alive_once = true;
	}
	
	
	/* if ( $alive_every == $current_time){
		$alive_once = true;
	} */
	
	if($alive_once){
		$RES=$LOCAL_DATABASE->execute( "SELECT 'HI IM STILL ALIVE PLEASE DONT TERMINATE ME!' as MSG FROM vims.company_setup LIMIT 1" ,[] , \PDO :: FETCH_ASSOC );
		ECHO "\n".$RES->fetch()['MSG']."\n".$date->format('Y-m-d H:i:s')."\n";
		ECHO "-----------------\n";
	}

	
	
	if ($current_time == $back_up_time){
		echo "\nBackup database now commencing...\n";
		Profile\Profile::compileDatabase ([
			"data" => [
				"arg" => [
					"dbs" => [
						//"vims" => 1
						JSON_DECODE($MAINTENANCE_SETTING['db_to_backup'],true)
					
					]
				]
			]
		] ,"$DIR/maintenance");
		echo "Back up complete! time ".$date->format('Y-m-d H:i:s');
	}
	
	
	
	//echo $current_time." -".($min==54)."\n";
	sleep(1);
}


?>