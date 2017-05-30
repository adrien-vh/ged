<?php
	
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST'); 
		
// Complétez $url avec l'url cible (l'url de la page que vous voulez télécharger)
$url="http://192.168.1.198:9090/services/rest/index/Fichier/search/field/search"; 
 
// Complétez le tableau associatif $postFields avec les variables qui seront envoyées par POST au serveur
$postFields=array('query' => urlencode('pro'));
 
// Tableau contenant les options de téléchargement
$options=array(
      CURLOPT_URL            => $url,       // Url cible (l'url de la page que vous voulez télécharger)
      CURLOPT_CUSTOMREQUEST  => 'POST',       // Url cible (l'url de la page que vous voulez télécharger)
      CURLOPT_RETURNTRANSFER => true,       // Retourner le contenu téléchargé dans une chaine (au lieu de l'afficher directement)
      CURLOPT_HEADER         => false,      // Ne pas inclure l'entête de réponse du serveur dans la chaine retournée
      CURLOPT_FAILONERROR    => true,       // Gestion des codes d'erreur HTTP supérieurs ou égaux à 400
      CURLOPT_POST           => true,       // Effectuer une requête de type POST
      CURLOPT_POSTFIELDS     => $postFields, // Le tableau associatif contenant les variables envoyées par POST au serveur
	  CURLOPT_HTTPHEADER	 => array('Content-Type: application/json', 'Content-Length: '),
);
 

 
////////// MAIN
 
// Création d'un nouvelle ressource cURL
$CURL=curl_init();
// Erreur suffisante pour justifier un die()
if(empty($CURL)){die("ERREUR curl_init : Il semble que cURL ne soit pas disponible.");}
 
      // Configuration des options de téléchargement
      curl_setopt_array($CURL,$options);
 
      // Exécution de la requête
      $content=curl_exec($CURL);            // Le contenu téléchargé est enregistré dans la variable $content. Libre à vous de l'afficher.
	  echo $content;
 
      // Si il s'est produit une erreur lors du téléchargement
      if(curl_errno($CURL)){
            // Le message d'erreur correspondant est affiché
            echo "ERREUR curl_exec : ".curl_error($CURL);
      }
 
// Fermeture de la session cURL
curl_close($CURL);