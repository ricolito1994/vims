<?php
# registers/store each instantiated object e.g. Connection
namespace server\classes\registry;

class Registry {
	
	public $objects = array();
	public static $instance;
	
	public function __construct(){
	}
	
	public function SET ( $name , $object ) {
		$this->objects[$name] = $object;
	}
	
	public function GET ( $name = NULL ){
		if ($name != NULL){
			return $this->objects[$name];
		}
	}
	
	public static function instantiate(){
		if (!self::$instance instanceof self)
			self::$instance = new Registry;
			
		return self::$instance;
	}
}

?>