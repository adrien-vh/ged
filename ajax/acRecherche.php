<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST'); 
	
	$url = "http://192.168.1.198:9090/services/rest/index/Fichier/autocompletion/autocomplete?prefix=".$_GET['prefix'];
	$ch = curl_init();
	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($ch);
	curl_close($ch);
	
	die($result);