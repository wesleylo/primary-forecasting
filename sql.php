<?php
	$dbhost = 'localhost';
	$dbuser = 'weslo_primary';
	$dbpass = 'password!';
	
	$db = 'weslo_primary';
	
	$conn = mysqli_connect($dbhost, $dbuser,$dbpass,$db);

	if (!$conn) {
	        die('Could not connect: ' . mysql_error());
	}
    
	mysqli_select_db($conn, $db) or die('Could not select database.');
    
	$query = "SELECT * from demo";
	$result = mysqli_query($conn,$query);
    
	if (!$result) {
        	echo 'Invalid query: ' . mysqli_error($conn);
        	exit;
        }
        $rows = array();
        
        /*while($row = mysqli_fetch_assoc($result)) {
        	 $rows[] = $row['sid'], $row['name'];
        }*/
        $row = mysqli_fetch_assoc($result);

        print json_encode($rows);
 ?>