<?php
$mysql_db_hostname = "localhost";
$mysql_db_user = "weslo_primary";
$mysql_db_password = "password!";
$mysql_db_database = "weslo_primary";

$con = @mysqli_connect($mysql_db_hostname, $mysql_db_user, $mysql_db_password,
 $mysql_db_database);

if (!$con) {
 trigger_error('Could not connect to MySQL: ' . mysqli_connect_error());
}
$var = array();
 $sql = "SELECT sname, code, s_delegates, hc_votes, hc_delegates, bs_votes, bs_delegates, value FROM demo";
$result = mysqli_query($con, $sql);

while($obj = mysqli_fetch_object($result)) {
$var[] = $obj;
}
echo json_encode($var, JSON_NUMERIC_CHECK);
?>