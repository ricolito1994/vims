<?php
/* Initializes all server essenstials */
namespace server\routes\start
{
#$root = ($_SERVER["DOCUMENT_ROOT"]);
use server\classes\connection as connection;
use server\classes\registry as registry;

use server\classes\controller as Controller;
use server\controller\profile as Profile;


/* include your class files here */
# $root = dirname(dirname(__FILE__));
/* require "$root/vims/sources/scripts/server/classes/connection.server.class.php";
require "$root/vims/sources/scripts/server/classes/registry.server.class.php";
require "$root/vims/sources/scripts/server/classes/controller.server.class.php"; */
#echo  ' 2 '.dirname(dirname(__FILE__))."\classes\segistry.server.class.php";


require dirname(dirname(__FILE__))."\classes\connection.server.class.php";
require dirname(dirname(__FILE__))."\classes\_registry.server.class.php";
require dirname(dirname(__FILE__))."\classes\controller.server.class.php";
require dirname(dirname(__FILE__))."\controllers\profile.controller.class.php";


$registry = registry\Registry::instantiate();
/* Register your database connection here */
#$registry->SET ("DB" , new connection\Connection ( "admission" ));

/* use this for dev */
$dev_host = 'localhost';
$dev_user = 'root';
$dev_pass = '';



$registry->SET ("DB" , new connection\Connection ( [
	"CONNECTION_OBJECT" => [
		"HOST" => $dev_host,
		"USERNAME" => $dev_user,
		"PASSWORD" => $dev_pass,
		"DB" => "vims",
	],
]) );




}
?>