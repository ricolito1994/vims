<!DOCTYPE HTML>
<html>
<head>
	<?php
	session_start();
	$data = json_decode ($_POST['data'],false);

	function generateCardNumber ($ID = 123) 
	{
		$totalLen = 8;
		$num = str_split($ID);
		$strNum = $totalLen - count ($num);
		$ctr = 0;
		$resNumber = "";

		for($i = 0 ; $i < $totalLen; $i++) {
			if ($strNum > $i) {
				$resNumber .= 0;
			} else {
				$resNumber .= $num[$ctr];
				$ctr ++;
			}
		}
		$CODE = $_SESSION['CODE'];
		return "$CODE-$resNumber";
	}
	?>
	<title></title>
	<script type="text/javascript" src="/vims/sources/imports/scripts/qrcodejs/qrcode.min.js" ></script>
	<style>
		div#qrcode_ img{
			width:100%;
		}
		*{
			font-family:verdana;
		}
	</style>
</head>
<?php
//W:3.375IN
//H:2.125IN
?>
<body>
	<div style="height:2.125in;width:3.375in;border:1px solid black;padding:0.5%;">
		<div style="width:69%;float:left;height:100%;">
			<div style="height:25%;">
				<div style="float:left;width:25%;height:100%;">
					<img src="../../images/logo_cong.png" style="width:100%;height:100%;">
				</div>
				<div style="float:left;width:73%;height:100%;font-size:10px;">
					<div style="margin-top:10px;margin-left:5px;">
						<p align="center" style="font-size:8px;">REPUBLIC OF THE PHILIPPINES</p>
						<p align="center" style="margin-top:-10px;font-size:8px;font-weight:bold;">PROVINCE OF NEGROS OCCIDENTAL</p>
					</div>
				</div>
				<div style="clear:both"></div>
			</div>
			<div style="height:15%;" align="center">
				<div>
					<B style="font-size:11px;">HEALTH CARD</B>
				</div>
				<div style="margin-top:-10px;">
					<span style="font-size:10px;"><?php echo generateCardNumber($data->ID); ?></span>
				</div>
			</div>
			<div style="height:50%; ">
				<div style='font-size:8px;'>
					NAME:<br>
					<STRONG><?PHP ECHO $data->FIRSTNAME.' '.$data->MIDDLENAME.' '.$data->LASTNAME; ?></STRONG>
				</div>
				<div style='margin-top:5px;font-size:8px;'>
					ADDRESS:<br>
					<STRONG><?PHP ECHO $data->ADDRESS; ?></STRONG>
				</div>
				<div style='margin-top:5px;font-size:8px;'>
					COMORDIBITY:<br>
					<?php 
						$comordibity = count($data->COMORDIBITY) > 0 ? implode( ",", $data->COMORDIBITY ): 'NONE';
						
					?>
					<STRONG><?php echo strtoupper($comordibity); ?></STRONG>
				</div>
				<div style='margin-top:5px;font-size:8px;width:100%;'>
					<div style='width:50%;float:left;'>
						COVID VACCINATION:<br>
						<?php
						$vaccineDose = count ($data->VACCINATION);
						
						$vaccineDose = $vaccineDose > 0 ? "YES, $vaccineDose DOSE" : "NO";
						
						?>
						<STRONG><?php echo $vaccineDose; ?></STRONG>
					</div>
					<div style='width:50%;float:right;'>
						BLOOD TYPE:<br>
						<STRONG><?PHP echo $data->BLOOD_TYPE; ?></STRONG>
					</div>
					<div style="clear:both"></div>
				</div>
				
			</div>
			<!--<div style="height:50%">
				<div><span style="font-size:7px;" >NAME</span><BR>
				<b style="font-size:8px;"><?PHP ECHO $data->FIRSTNAME.' '.$data->MIDDLENAME.' '.$data->LASTNAME; ?></b>
				</div>
				
				<div>
					<span style="font-size:7px;">ADDRESS</span></BR>
					<b style="font-size:8px;"><?PHP ECHO $data->ADDRESS; ?><BR></b>
				</div>
				
				<div>
					<span style="font-size:7px;">COMORDIBITIES</span></BR>
					<b style="font-size:8px;">DIABETES, HYPERTENSION<BR></b>
				</div>
				
				<div>
					<span style="font-size:7px;">COVID 19 VACCINATION:</span></BR>
					<b style="font-size:8px;">YES<BR></b>
				</div>
			</div>-->
		</div>
		<div style="width:30%;float:right;height:100%;">
			<div id="qrcode_" style="width:100%;height:50%;"></div>
			<div  style="width:100%;height:50%;background:#cccc;font-size:10px;text-align:center;">
				<?php if ($data->ITEM_IMAGE == "") { ?>
					1x1 PHOTO
				<?php } else { ?>
					<img src="<?php echo $data->ITEM_IMAGE; ?>" style="height:100%;width:100%;"/>
				<?php } ?>
			</div>
		</div>
		
		<div style="clear:both"></div>
	</div>
	<div style="height:2.125in;width:3.375in;border:1px solid black;padding:0.5%;">
		<div style="width:100%;height:100%;">
			<div align="center" style="height:50%;">
				<div style="width:35%;height:100%;">
					<img src="../../images/logo_cong.png" style="width:100%;height:100%;">
				</div>
			</div>
			<div align="center" style="height:7%;">
				<div style="width:100%;height:100%;">
					<strong style="color:red;">IN CASE OF EMERGENCY</strong>
				</div>
			</div>
			<div align="center" style="height:7%;">
				<div style="width:100%;height:100%;">
					<strong style="font-size:10px;"><?php echo $data->EMERGENCY->NAME; ?></strong>
				</div>
			</div>
			<div align="center" style="height:7%;">
				<div style="width:100%;height:100%;">
					<strong style="font-size:10px;"><?php echo $data->EMERGENCY->ADDRESS; ?></strong>
				</div>
			</div>
			<div align="center" style="height:5%;">
				<div style="width:100%;height:100%;">
					<strong style="font-size:10px;"><?php echo $data->EMERGENCY->CONTACT_NUMBER; ?></strong>
				</div>
			</div>
		</div>
		
		<div style="clear:both"></div>
	</div>
</body>
	<script >
		var qrcode = new QRCode("qrcode_");
		qrcode.makeCode(`<?php echo $data->RESIDENT_ID; ?>`);
	</script>
</html>