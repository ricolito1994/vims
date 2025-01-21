<?php  ?>
<!DOCTYPE html>
<html>
<head>
<?php use templates\section\headimports as head; ?>
<?php use templates\section\bottomimports as bottom; ?>
<?php use templates\section\topnav as topnav; ?>
<?php include("sources/templates/section/imports.bottom.section.template.php"); ?>
<?php include("sources/templates/section/imports.head.section.template.php"); ?>
<?php include("sources/templates/section/topnav.section.template.php"); ?>
<!--styles here for it is first to load-->
<?php head\import("./"); ?>
</head>

<body>
	<div class="main-container" id="main-div">
		<?php topnav\topnav(""); ?>
		
		<div id="container-pages" >
			
		</div>
	</div>
</body>
<!--most likely import written codes-->
<?php bottom\import("./"); ?>
</html>