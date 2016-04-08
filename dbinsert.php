<?php
	require_once('config.php');         
	// Database connection                                   
	$mysqli = mysqli_init();
	$mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
	$mysqli->real_connect($config['db_host'],$config['db_user'],$config['db_password'],$config['db_name']); 
	
	$query = "TRUNCATE TABLE demo";

    		if(!mysqli_query($mysqli,$query)) {
        		die('Error : ' . mysql_error());
    		}
	
	
	//read the json file contents
	$jsondata = file_get_contents('dbdefault.json');
	    
	//convert json object to php associative array
	$data = json_decode($jsondata, true);
	//print_r($data);
	

	foreach($data as $item) {
	    	$sname = $item['sname'];
	    	$code = $item['code'];
		$s_delegates = $item['s_delegates'];
		$hc_votes = $item['hc_votes'];
		$hc_delegates = $item['hc_delegates'];
		$bs_votes = $item['bs_votes'];
		$bs_delegates = $item['bs_delegates'];
		$value = $item['value'];



	    	//insert into mysql table
	    	$query = "INSERT INTO demo(sname, code, s_delegates, hc_votes, hc_delegates, bs_votes, bs_delegates, value)
	    	VALUES('$sname', '$code', '$s_delegates', '$hc_votes', '$hc_delegates', '$bs_votes', '$bs_delegates', '$value')";

    		if(!mysqli_query($mysqli,$query)) {
        		die('Error : ' . mysql_error());
    		}
    	}
?>