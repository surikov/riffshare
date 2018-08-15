<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include("pChart2.1.4/class/pDraw.class.php");
include("pChart2.1.4/class/pImage.class.php");
function drawLine($pimage, $x1,$y1, $x2, $y2, $thk, $r, $g, $b){
	$pimage->drawLine($x1, $y1, $x2, $y2, array("R" => $r, "G" => $g, "B" => $b, "Weight" => $thk/2-2));
	$pimage->drawFilledCircle(round($x1) , round($y1) ,round($thk/2)-2, array("R" => $r, "G" => $g, "B" => $b));
	$pimage->drawFilledCircle(round($x2) , round($y2) ,round($thk/2)-2, array("R" => $r, "G" => $g, "B" => $b));
}
function decodeState($encoded)
{
    $strings = explode("-", $encoded);
    $drumsData = $strings[4];
    $cnt = strlen($drumsData) / 4;
    $drums = array();
    for($i = 0; $i < $cnt; $i++) {
        $key = hexdec(substr($drumsData, $i * 4, 2));
        $data = hexdec(substr($drumsData, 2 + $i * 4, 2));
        $drum = $key >> 5;
        $i32 = $key & bindec('00011111');
        $beat = 0;
        $t = '';
        if(($data | bindec('00000001')) == $data) {
            $beat = $i32 * 8 + 0;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00000010')) == $data) {
            $beat = $i32 * 8 + 1;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00000100')) == $data) {
            $beat = $i32 * 8 + 2;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00001000')) == $data) {
            $beat = $i32 * 8 + 3;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00010000')) == $data) {
            $beat = $i32 * 8 + 4;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00100000')) == $data) {
            $beat = $i32 * 8 + 5;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('01000000')) == $data) {
            $beat = $i32 * 8 + 6;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('10000000')) == $data) {
            $beat = $i32 * 8 + 7;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
    }
    $trackData = $strings[5];
    $cnt = strlen($trackData) / 9;
    $tracks = array();
    for($i = 0; $i < $cnt; $i++) {
        $beat = hexdec(substr($trackData, $i * 9, 2));
        $track = hexdec(substr($trackData, $i * 9 + 2, 1));
        $len = hexdec(substr($trackData, $i * 9 + 3, 2));
        $pitch = hexdec(substr($trackData, $i * 9 + 5, 2));
        $shift = hexdec(substr($trackData, $i * 9 + 7, 2)) - 64;
        array_push($tracks, array(
            $beat,
            $track,
            $len,
            $pitch,
            $shift
        ));
    }
    $arr = array();
    array_push($arr, $drums, $tracks);
    return $arr;
}
function trackColor($nn){
	if($nn==7){return array(255,127,77);}
	if($nn==6){return array(178,178,0);}
	if($nn==5){return array(140,0,64);}
	if($nn==4){return array(0,127,255);}
	if($nn==3){return array(140,35,0);}
	if($nn==2){return array(35,51,255);}
	if($nn==1){return array(45,178,0);}
	if($nn==0){return array(255,0,0);}
	return array(127,127,127);
}
function trackTitle($nn){
	if($nn==7){return 'Synth Bass';}
	if($nn==6){return 'String Ensemble';}
	if($nn==5){return 'Bass guitar';}
	if($nn==4){return 'Acoustic Piano';}
	if($nn==3){return 'PalmMute guitar';}
	if($nn==2){return 'Percussive Organ';}
	if($nn==1){return 'Acoustic guitar';}
	if($nn==0){return 'Distortion guitar';}
	return 'Wave';
}
function drumTitle($nn){
	if($nn==7){return 'Splash Cymbal';};
	if($nn==6){return 'Ride Cymbal';}
	if($nn==5){return 'Open Hi-hat';}
	if($nn==4){return 'Closed Hi-hat';}
	if($nn==3){return 'Mid Tom';}
	if($nn==2){return 'Snare drum';}
	if($nn==1){return 'Low Tom';}
	if($nn==0){return 'Bass drum';}
	
	return 'Drum';
}
function pitchName($pitch) {
	$n = $pitch % 12;
	$t = 'C';
	if ($n == 1) {
		$t = 'C#';
	}
	if ($n == 2) {
		$t = 'D';
	}
	if ($n == 3) {
		$t = 'D#';
	}
	if ($n == 4) {
		$t = 'E';
	}
	if ($n == 5) {
		$t = 'F';
	}
	if ($n == 6) {
		$t = 'F#';
	}
	if ($n == 7) {
		$t = 'G';
	}
	if ($n == 8) {
		$t = 'G#';
	}
	if ($n == 9) {
		$t = 'A';
	}
	if ($n == 10) {
		$t = 'A#';
	}
	if ($n == 11) {
		$t = 'B';
	}
	return '' . $t;
}
try {
	$description='';
	$comma='';
    $riff = htmlspecialchars($_GET["riff"]);
	$top = 7-1*$_GET["top"];
	$mode = 1*$_GET["mode"];
    $data = decodeState($riff);
    $state = '';
    $drums = $data[0];
    for($i = 0; $i < count($drums); $i++) {
        $beat = $drums[$i][0];
        $drum = $drums[$i][1];
        $state = $state . ' ' . $drum . '/' . $beat;
    }
    $tracks = $data[1];
    for($i = 0; $i < count($tracks); $i++) {
        $beat = $tracks[$i][0];
        $track = $tracks[$i][1];
        $len = $tracks[$i][2];
        $pitch = $tracks[$i][3];
        $shift = $tracks[$i][4];
        $state = $state . ' ' . $beat . '/' . $track . ':' . $pitch . '-' . $shift . '=' . $len;
    }
    $ww = 500;
    $hh = 100;
	$lvlsh = 0.75;
	$maxBeat = 1;
	$minPitch = 12 * 5;
	$maxPitch = 0;
	$hasDrums = count($drums) > 0;
	for ($i = 0; $i < count($drums); $i++) {
		$b = $drums[$i][0];
		if ($b > $maxBeat) {
			$maxBeat = $b;
		}
	}
	for ($i = 0; $i < count($tracks); $i++) {
		$b = $tracks[$i][0] + $tracks[$i][2] - 1;
		if ($b > $maxBeat) {
			$maxBeat = $b;
		}
		$max = max($tracks[$i][3], $tracks[$i][3] + $tracks[$i][4]);
		$min = min($tracks[$i][3], $tracks[$i][3] + $tracks[$i][4]);
		if ($max > $maxPitch) {
			$maxPitch = $max;
		}
		if ($min < $minPitch) {
			$minPitch = $min;
		}
	}
	$len = floor($maxBeat / 16) + 1;
	$mltpl = 30;
	if($len * 16 * $mltpl>1200){
		$mltpl=round(1200/($len * 16));
	}
	if($mltpl<14){
		$mltpl=14;
	}
	if($mltpl%2>0){
		$mltpl=$mltpl-1;
	}
	$ww = $len * 16 * $mltpl;
	$hh=1;
	$drumUses = array(false, false, false, false, false, false, false, false);
	for ($i = 0; $i < count($drums); $i++) {
		$drumUses[$drums[$i][1]] = true;
	}
	$drCount = 0;
	for ($i = 0; $i < 8; $i++) {
		if ($drumUses[$i]) {
			$drCount++;
			$drumUses[$i] = $drCount;
		}
	}
	if ($drCount) {
		$hh = $hh + $drCount * $mltpl;
	}
	if ($maxPitch >= $minPitch) {
		$hh = $hh + ($maxPitch - $minPitch + 1) * $mltpl;
	}
	$pimage = new pImage($ww+$mltpl, $hh);
	$pimage->Antialias = TRUE;
	if ($mode == 1) {
		$pimage->drawFilledRectangle(0, 0,$ww+$mltpl, $hh, array("R" => 0x31, "G" => 0x42, "B" => 0x4c));
	}else{
		if ($mode == 2) {
			$pimage->drawFilledRectangle(0, 0,$ww+$mltpl, $hh, array("R" => 0xee, "G" => 0xee, "B" => 0xff));
		}else{
			$pimage->drawFilledRectangle(0, 0,$ww+$mltpl, $hh, array("R" => 0x00, "G" => 0x06, "B" => 0x09));
		}
	}
	if ($hh > 1) {
		for($xx=$mltpl*16;$xx<$ww;$xx=$xx+$mltpl*16){
			$pimage->drawFilledRectangle($xx, 0,$xx+0.1*$mltpl, $hh, array("R" => 127, "G" => 127, "B" => 127, "Alpha" => 10));
		}
		if ($hasDrums) {
			$description='Drums';
			$comma=', ';
			for ($xx = 0; $xx < $ww; $xx = $xx + $mltpl * 2) {
				for ($d = 0; $d < $drCount; $d++) {
					$odd = $d % 2;
					$pimage->drawFilledRectangle($xx + $odd * $mltpl, $hh - ($d + 1) * $mltpl, $xx + ($odd + 1) * $mltpl, $hh - ($d + 0) * $mltpl, array("R" => 127, "G" => 127, "B" => 127, "Alpha" => 10));
				}
			}
			for ($i = 0; $i < count($drums); $i++) {
				$x1 = $drums[$i][0] * $mltpl ;
				$y1 = $hh - $drCount * $mltpl + $drumUses[$drums[$i][1]] * $mltpl ;				
				if($mode==2){
					$pimage->drawFilledCircle(round($x1+$mltpl/2) , round($y1-$mltpl/2) ,round($mltpl/2-1), array("R" => 0, "G" => 0, "B" => 0));
				}else{
					$pimage->drawFilledCircle(round($x1+$mltpl/2) , round($y1-$mltpl/2) ,round($mltpl/2-1), array("R" => 255, "G" => 255, "B" => 255));
				}
			}
			$pimage->setFontProperties(array("FontName" => "pChart2.1.4/fonts/Forgotte.ttf", "FontSize" => round($mltpl*0.7)));

			for ($i = 0; $i < count($drumUses); $i++) {
				$ordr=$drumUses[$i];
				if($ordr>0){
					$pimage->drawText($mltpl/3, round($hh-$mltpl*($drCount-$ordr)-$mltpl*0.2), drumTitle($i), array("R" => 99, "G" => 99, "B" => 255));
				}
			}
		}
		for ($i = 1; $i < 6; $i++) {
			$yy=($maxPitch - $i*12+1) * $mltpl;
			$pimage->drawFilledRectangle(0, $yy, $ww, $yy+0.1*$mltpl, array("R" => 127, "G" => 127, "B" => 127, "Alpha" => 10));
		}
		$pimage->setFontProperties(array("FontName" => "pChart2.1.4/fonts/Forgotte.ttf", "FontSize" => round($mltpl*0.6)));
		for ($i = 0; $i < count($tracks); $i++) {
			if($tracks[$i][1]!=$top){
				$bhnd=1+$tracks[$i][1]*1;
				$x1 = $tracks[$i][0] * $mltpl + 0.5 * $mltpl;
				$y1 = ($maxPitch - $tracks[$i][3]) * $mltpl + 0.5 * $mltpl;
				$x2 = $x1 + 1 + ($tracks[$i][2] - 1) * $mltpl;
				$y2 = $y1 - $tracks[$i][4] * $mltpl;
				$c=trackColor( $tracks[$i][1]);
				drawLine($pimage, $x1+$bhnd,$y1+$bhnd, $x2+$bhnd, $y2+$bhnd, $mltpl , $c[0],$c[1], $c[2]);
				$pimage->drawText($x1-$mltpl*0.2+$bhnd,$y1+$mltpl*0.3+$bhnd, pitchName($tracks[$i][3]), array("R" => 255, "G" => 255, "B" => 255));
			}
		}
		for ($i = 0; $i < count($tracks); $i++) {
			if($tracks[$i][1]==$top){
				$x1 = $tracks[$i][0] * $mltpl + 0.5 * $mltpl;
				$y1 = ($maxPitch - $tracks[$i][3]) * $mltpl + 0.5 * $mltpl;
				$x2 = $x1 + 1 + ($tracks[$i][2] - 1) * $mltpl;
				$y2 = $y1 - $tracks[$i][4] * $mltpl;
				$c=trackColor( $tracks[$i][1]);
				drawLine($pimage, $x1,$y1, $x2, $y2, $mltpl , $c[0],$c[1], $c[2]);
				$pimage->drawText($x1-$mltpl*0.2,$y1+$mltpl*0.3, pitchName($tracks[$i][3]), array("R" => 255, "G" => 255, "B" => 255));
			}
		}
		$insUses = array(false, false, false, false, false, false, false, false);
		for ($i = 0; $i < count($tracks); $i++) {
			$insUses[$tracks[$i][1]] = true;
		}
		for ($i = 0; $i < 8; $i++) {
			if($insUses[$i]){
				$description=$description.$comma.trackTitle($i);
				$comma=', ';
			}
		}
	}
	$fileName='s'.date('Y').'-'.date('m').'-'.date('d').'-'.(rand(1,100000000));
	$bgcolor='#000609';
	if ($mode == 1) {
		$bgcolor='#31424C';
	}else{
		if ($mode == 2) {
			$bgcolor='#eef';
		}
	}
	$linkColor='#ddd';
	if ($mode == 2) {
		$linkColor='#222';
	}
    $file = fopen("share/".$fileName.".html", "w");
	$html='';
	$html=$html . '<!DOCTYPE html>';
	$html=$html . "\r\n" . '<html>';
	$html=$html . "\r\n" . '    <head>';
	$html=$html . "\r\n" . '		<meta charset="UTF-8">';
	
	$html=$html . "\r\n" . '		<meta name="twitter:card" content="summary_large_image" />';
	$html=$html . "\r\n" . '		<meta name="twitter:title" content="#Molgav" />';
	$html=$html . "\r\n" . '		<meta name="twitter:description" content="'.$description.'" />';
	$html=$html . "\r\n" . '		<meta name="twitter:site" content="@sssurikov" />';
	$html=$html . "\r\n" . '		<meta name="twitter:creator" content="@sssurikov" />';
	$html=$html . "\r\n" . '		<meta name="twitter:image" content="http://molgav.nn.ru/share/'.$fileName.'.png">';
	
	$html=$html . "\r\n" . '		<meta property="og:url" content="http://molgav.nn.ru/share/'.$fileName.'.html" />';
	$html=$html . "\r\n" . '		<meta property="og:title" content="Molgav" />';
	$html=$html . "\r\n" . '		<meta property="og:description" content="'.$description.'" />';
	$html=$html . "\r\n" . '		<meta property="og:site_name" content="molgav.nn.ru" />';
	$html=$html . "\r\n" . '		<meta property="og:type" content="article" />';
	$html=$html . "\r\n" . '		<meta property="og:image" content="http://molgav.nn.ru/share/'.$fileName.'.png" />';
	$html=$html . "\r\n" . '		<meta property="og:image:type" content="image/png" />';
	$html=$html . "\r\n" . '		<meta property="og:image:width" content="'.$ww.'" />';
	$html=$html . "\r\n" . '		<meta property="og:image:height" content="'.$hh.'" />';
	$html=$html . "\r\n" . '		<meta property="og:image:alt" content="Pianoroll preview" />';
	
	$html=$html . "\r\n" . '        <title>Molgav</title>';
	$html=$html . "\r\n" . '		<script type="text/javascript" src="http://platform-api.sharethis.com/js/sharethis.js#property=5abcf2eece89f00013641c95&product=inline-share-buttons"></script>';
	$html=$html . "\r\n" . '		<style>';
	$html=$html . "\r\n" . '			body {';
	$html=$html . "\r\n" . '				background-color: '.$bgcolor.';';
	$html=$html . "\r\n" . '			}';
	$html=$html . "\r\n" . '			a {';
	$html=$html . "\r\n" . '				color: '.$linkColor.';';
	$html=$html . "\r\n" . '			}';
	$html=$html . "\r\n" . '			p {';
	$html=$html . "\r\n" . '				text-align: center;';
	$html=$html . "\r\n" . '				color: '.$linkColor.';';
	$html=$html . "\r\n" . '			} ';
	$html=$html . "\r\n" . '			img {';
	$html=$html . "\r\n" . '				width: 80%;';
	$html=$html . "\r\n" . '			} ';
	$html=$html . "\r\n" . '		</style>';
	$html=$html . "\r\n" . '    </head>';
	$html=$html . "\r\n" . '    <body>';
	$html=$html . "\r\n" . "		<a href='https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=" . $riff . "'><p>Open in editor</p>";
	$html=$html . "\r\n" . "		<p><img src='".$fileName.".png' /></p>";
	$html=$html . "\r\n" . "		<p>v1.22.".$mltpl."</p></a>";
	
	$html=$html . "\r\n" . '		<div class="sharethis-inline-share-buttons"></div>';
	
	$html=$html . "\r\n" . '    </body>';
	$html=$html . "\r\n" . '</html>';
	$html=$html . "\r\n" . '<html>';
	fwrite($file, $html);
    fclose($file);
	$pimage->render("share/".$fileName.".png");
    header('Location: share/'.$fileName.'.html');
    exit();
}
catch(Exception $e) {
    echo '<p>Caught exception: ', $e->getMessage(), "</p>";
}
?>