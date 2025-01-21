<?php
# connection for databases
# PDO (php data objects) connection
namespace server\classes\Connection;
/* $root = ($_SERVER["DOCUMENT_ROOT"]);
require ("$root/studentadmission/sources/scripts/server/constants/connection.server.constants.php"); */
$root = dirname(dirname(__FILE__)); 
require ("$root/constants/connection.server.constants.php");


class Connection {
	
	public $connection;
	public $PATH_TO_CONSTANTS;
	public $host, $username, $password, $SDN, $DB;
	public $dynamic;
	public $driver_options;
	
	public function __construct( $DATABASE , $driver_options = null ){
		$this->dynamic = false;
		if ( !isset( $DATABASE [ 'CONNECTION_OBJECT' ] ) ){
			$this->DB = $DATABASE;
		}
		else{
			//print_r($DATABASE);
			foreach ( $DATABASE['CONNECTION_OBJECT'] as $i => $j ){
				$this -> {$i} = $j;
			}
			$this->dynamic = !$this->dynamic;
		}
		$this->connect( $this->dynamic );
	}
	
	public function connection(){
        $this->pdo = new PDO($this->SDN, $this->USERNAME, $this->PASSWORD, (array) $this->driver_options); 
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        return $this->pdo;
    }
	
	
	
	private function connect( $dynamic ){
		
		if ( !$dynamic ){
			$this->HOST = HOST;
			$this->USERNAME = USERNAME;
			$this->PASSWORD = PASSWORD;
		}
		
		$this->SDN = "mysql:host=$this->HOST;dbname=$this->DB;charset=UTF8";
		$this->connection = new \PDO( $this->SDN, $this->USERNAME, $this->PASSWORD , 
			array( \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4" , \PDO::ATTR_PERSISTENT  => TRUE ) ); 
		$this->connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
	}
	
	
	public function create_connect_database ( $database = '' ){
		$this->execute("DROP DATABASE IF EXISTS $database" , [] , \PDO::FETCH_ASSOC);
		$this->execute("CREATE DATABASE IF NOT EXISTS $database" , [] , \PDO::FETCH_ASSOC);
		
		return new Connection (ARRAY ( 
			"CONNECTION_OBJECT" => ARRAY (
				"HOST" => $this->HOST,
				"USERNAME" => $this->USERNAME,
				"PASSWORD" => $this->PASSWORD,
				"DB" => $database,
			),
		));
	}
	
	
	public static function CREATE_CONNECT_DATABASE_STATIC ( $database = '' ){
		
		$CONN = new Connection (ARRAY ( 
			"CONNECTION_OBJECT" => ARRAY (
				"HOST" => HOST,
				"USERNAME" => USERNAME,
				"PASSWORD" => PASSWORD,
				"DB" => $database,
			),
		));
		
		$CONN->execute("DROP DATABASE IF EXISTS $database" , [] , \PDO::FETCH_ASSOC);
		$CONN->execute("CREATE DATABASE IF NOT EXISTS $database" , [] , \PDO::FETCH_ASSOC);
		
		return  $CONN;
	}
	
	
	 public function __call($name, array $arguments){
        try {
            $this->connection->query("SHOW STATUS;")->execute();
        } catch(\PDOException $e) {
            if($e->getCode() != 'HY000' || !stristr($e->getMessage(), 'server has gone away')) {
                throw $e;
            }

            $this->reconnect();
        }
		$this->connect();
        #return call_user_func_array(array($this->connection(), $name), $arguments);
    }
	
	public function reconnect(){
		$this->connection = null;
		$this->connect ( $this->dynamic );
	}

	
	public function get_connection(){
		try{
			$this->connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION );
			return $this->connection;
		}
		catch (PDOException $ex){
			return "Can't connect ".$ex->getMessage();
		}
	}
	
	# returns QUERY result SQL builder
	public function execute ( $mysql_query , $ARR, $FETCHMODE ){
		try{
			$conn = $this->get_connection();
			//var_dump($mysql_query);
			$statement = $conn->prepare( $mysql_query ); 
			
			$statement->execute( $ARR );
			$statement->setFetchMode( $FETCHMODE ); 
			return $statement;
		}
		catch(\Exception $e){
			var_dump($e);
			return $e;
		}
	}
	
	private function get_path_to_constants(){
		return $this->PATH_TO_CONSTANTS;
	}
	
	/* PHP MAGIC METHODS */
	public function __sleep(){
		return array('SDN','username','password');
	}
	
	public function __wakeup(){
		$this->connect();
	}
	
	# destroy this object
	/*public function __destruct(){
		unset($this);
	}*/
	/* */

}

?>