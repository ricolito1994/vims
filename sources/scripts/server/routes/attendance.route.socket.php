<?php
namespace vims\SOCKET_ROUTE\ATTENDANCE_SOCKET_ROUTE;
use server\routes\start as START;
use server\classes\registry as registry;
require 'start.route.server.php';


class AttendanceRoute {
	
	public $socket_server;
	public $route_key = "Attendance";
	public $database;
	
	public function __construct( $socket_server ){
		$this->socket_server = $socket_server;
		$this->database = registry\Registry::instantiate() -> objects ['DB_EMPLOYEE'];
	}
	
	/* get admin users to send attendance data on real time */
	public function getAllowedTimeUsers (){
		return array ( 
			'RAC082017-06',
			'CMA042018-55',
		);
	}
	
	public function saveAttendance($response  ,$message_object = null , $buffer = null){
		/* Apply your own logic here */
		/* Save attendance logic here */
		$parsed_attendance = self :: parseTimeAttendanceFromZK ( $message_object->attendance );

		$sql = "INSERT INTO employee_profile.employee_in_out (biometrics_no,date,time,in_out) VALUES( ? ,? ,? ,? )";
		
		$this->database->execute ( $sql , array(
			$parsed_attendance['biometrics_no'],
			$parsed_attendance['date'],
			$parsed_attendance['time'],
			$parsed_attendance['in_out'],
		), \PDO::FETCH_ASSOC );
		
		var_dump($message_object->attendance);
		echo "\n";
		/* send response to the client socket */
		$this->socket_server->send_message( $response, $message_object );
	}
	
	public function getAttendance($response){
		/*Apply your own logic here*/
		
		/*send response to the socket*/
		$this->socket_server->send_message($response);
	}
	
	
	// parse string to this format only :
	// pyzk real time attendance format : <Attendance> : 78 : 2020-09-02 13:31:50 (1, 1)
	// returned by pyzk.py a python lib for zk devices
	public static function parseTimeAttendanceFromZK ( $attendance_object = null ){
		$objectify_attendance = explode ( ' ', $attendance_object );
		// determine if log in or log out 1 for log in 0 for log out
		$in_out =  (($objectify_attendance[5][1]) > 0 && ($objectify_attendance[6][0]) > 0) ? 0 : 1;
		return array (
			'biometrics_no' => $objectify_attendance[1],
			'date'          => $objectify_attendance[3],
			'time'          => $objectify_attendance[4],
			'in_out'        => $in_out,
		);
	}
	
}
#var_dump(AttendanceRoute::parseTimeAttendanceFromZK("<Attendance>: 78 : 2020-09-02 13:31:50 (0, 1)"));
?>