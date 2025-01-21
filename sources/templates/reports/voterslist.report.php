<?php
    $data = json_decode($_POST['data'], true);

    function calculateAge ($birthdate) {
        $birthdateDateTime = new DateTime($birthdate);
        $now = new DateTime();
        $age = $now->diff($birthdateDateTime)->y;
        return $age;
    }
?>
<!DOCTYPE HTML>
<html>
    <head>
        <title>VOTERS' LIST</title>
        <style>
            * {
                font-family: ARIAL;
                font-size: 12px;
            }
            
            .table {
                border: 1px solid black;
                border-collapse: collapse;
                width:100%;
            }

            .table tr td, .table tr th {
                border: 1px solid black;
                padding: 0.5%;
            }

            #table-container {
                width:100%;
            }
        </style>
    </head>
    <body>
    <div style="width:100%;">
            <div id="title" align="center">
                <h1>VOTERS MASTER DATA</h1>
            </div>
            <div id="table-container">
                <table class='table'>
                <?php foreach ($data['res'] as $brgyKey => $brgyVal): ?>
                    <tr>
                        <td><B><?php echo $brgyVal['barangay_name']; ?></B></td>
                        <td><span style='font-size:9px;'>CAPTAIN | </span><b><?php echo $brgyVal['barangay_captain']; ?></b></td>
                        <td><span style='font-size:9px;'>ZONE COUNT | </span><b><?php echo $brgyVal['zone_count']; ?></td>
                        <td><span style='font-size:9px;'>HOUSEHOLD COUNT | </span><b><?php echo $brgyVal['house_hold_count']; ?></b></td>
                        <td><span style='font-size:9px;'>MEMBERS | </span><b><?php echo $brgyVal['members_count']; ?></b></td>
                    </tr>
                    <?php foreach ($brgyVal['kagawads'] as $kgwdKey => $kgwdVal): ?>
                    <tr>
                        <td></td>
                        <td align='right' ><span style='font-size:9px;'>KGWD | </span><B><?php echo $kgwdVal['kagawad_name']; ?></B></td>
                        <td><b><?php echo $kgwdVal['zone_count']; ?></td>
                        <td><b><?php echo $kgwdVal['house_hold_count']; ?></b></td>
                        <td><b><?php echo $kgwdVal['members_count']; ?></b></td>
                    </tr>
                    <?php foreach ($kgwdVal['zones'] as $zoneKey => $zoneVal): ?>
                    <tr>
                        <td></td>
                        <td align='right' style='font-size:9px;'><?php echo $zoneVal['zone_name']; ?></td>
                        <td><b><?php echo $zoneVal['zone_leader']; ?></b></td>
                        <td><b><?php echo $zoneVal['house_hold_count']; ?></b></td>
                        <td><b><?php echo $zoneVal['members_count']; ?></b></td>
                    </tr>
                    <?php foreach ($zoneVal['hh_leaders'] as $hhKey => $hhVal): ?>
                    <tr>
                        <td></td>
                        <td></td>
                        <td  align='right' style='font-size:9px;'>FAMILY LEADER</td>
                        <td><b><?php echo $hhVal['hh_leader_name']; ?></b></td>
                        <td><b><?php echo $hhVal['members_count']; ?></b></td>
                    </tr>
                    <?php foreach ($hhVal['hh_members'] as $memberKey => $memberVal): ?>
                    <tr>
                        <td></td>
                        <td></td>
                        <td align='right'></td>
                        <td align='right' >
                            <span style='font-size:9px;'><?php echo calculateAge($memberVal['BIRTHDAY']). ' y/o'; ?></span> | 
                            <span style='font-size:9px;'><?php echo $memberVal['RELATIONSHIP']; ?></span> | 
                            <?php echo $memberVal['FNAME']; ?>
                        </td>
                        <td align='right'><?php echo $memberVal['PRECINCT_NUMBER']; ?></td>
                    </tr>    
                    <?php endforeach; ?>   
                    <?php endforeach; ?>
                    <?php endforeach; ?>
                    <?php endforeach; ?>
                <?php endforeach; ?>
                </table>
            </div>
        </div>
    </body>
</html>