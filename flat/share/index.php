<!DOCTYPE html>
<html lang="en">
	<head>
		<title>RiffShareFlat list</title>
		<meta charset="utf-8">
		<style>
			html, body {
				font-family: 'Gidugu', serif;
				background-color:#000;
				color: #fff;	
				font-size: xx-large;
				text-align: center;
			}
			a {
				color: #99f;
				text-decoration: none;
			}
			h1 {
				text-align: center;
				border-bottom: 1px solid #333;
			}
			.ftr {
				text-align: left;
				border-top: 1px solid #333;
			}
			.cntr {
				text-align: left;
				display: inline-block;
			}
			.icn {
				width: 2cm;
			}
			@font-face {
			  font-family: 'Gidugu';
			  font-style: normal;
			  font-weight: 400;
			  src: local('Gidugu'), url(https://surikov.github.io/RiffShareAndroid/app/src/main/assets/gidugu.woff2) format('woff2');
			  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
			}
		</style>
	</head>
	<body>
<?php
$dir = './';
$files = scandir($dir);
$limit=22;
arsort($files);
$filter = '';
if ($_GET["filter"] === "" || (!isset($_GET['filter']))) {
	//$filter='None';
} else {
	$filter = $_GET["filter"];
	$limit=333;
}
?>
		<h1>RiffShare <?php echo $filter;?></h1>
		<div class='cntr'>
<?php
echo '<p>';
$cntr=0;
foreach($files as $file) {
	if (preg_match("/s[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]*.png$/i", $file)) {
		if (preg_match("/".$filter."/i", $file)) {
			$path = str_replace('png', 'html', $file);
			echo '<a href="'.$path.'"><img class="icn" src="'.$file.'" /></a> ';
			$cntr++;
			if($cntr>$limit){
				break;
			}
		}
	}
}
echo '</p>';
echo '<p>';
echo '<a href="./">Newest</a>';
$month = '';
foreach($files as $file) {
	if (preg_match("/s[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]*.png$/i", $file)) {
		preg_match('/s([0-9]{4}-[0-9]{2})/', $file, $out);
		$nxt = $out[1];
		if ($nxt == $month) {
			//
		} else {
			echo ' / <a href="./?filter='.$nxt.'">'.$nxt.'</a>';
			$month = $nxt;
		}
	}
}
echo '</p>';
?>
		</div>
		<p class="ftr">Return to <a href="../index.html">editor</a></p>
	</body>
</html>


