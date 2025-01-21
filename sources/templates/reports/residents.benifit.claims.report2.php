<?php
$data = json_decode($_POST['data'], true);
$result = $data['res'];
$dateFrom = $data['param']['DATE_FROM'];
$dateTo = $data['param']['DATE_TO'];

?>
<!DOCTYPE HTML>
<html>
    <head>
        <style>
            * {
                font-family: ARIAL;
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
                <h1>BENIFIT CLAIMS</h1>
                <h3><?php echo 'From : '. $data['param']['DATE_FROM'].' - '.' To : '.$data['param']['DATE_TO']; ?></h3>
            </div>
            <div id="table-container">
                <?php foreach($result as $brgyName => $brgy) : $barangayPopulationCount = 0;?>
                <?php echo  'BARANGAY: <b>' .$brgy['barangay_name']. '</b> '.$brgy['population'].' benificiaries <br><br>' ?>
                    <?php foreach($brgy as $prkName => $hhleads) : ?>
                        <?php if (is_array($hhleads)): ?>
                        <?php echo 'Purok: <b>' .$prkName. '</b> - '. $hhleads['population'] .' benificiaries <br>' ?>
                        <?php  foreach($hhleads as $h => $resClaim) : ?>
                            <?php $hhpop = isset($resClaim['population']) ? $resClaim['population'] : 0; ?>
                            <?php $hhfname = isset($resClaim['household_leader']) ? $resClaim['household_leader'] : 0; ?>
                            <?php $hhcode = isset($resClaim['household_code']) ? $resClaim['household_code'] : 0; ?>
                            <?php if (isset($resClaim['contents']) && is_array($resClaim['contents']) && count($resClaim['contents']) > 0): ?>
                                <table class="table">
                                        <tr>
                                            <td colspan="7" style="background:#ccc;padding:0.2%;">
                                                <?php echo $hhcode; ?>
                                
                                            </td>
                                        </tr>
                                    
                                        <tr>
                                            <th>RESIDENT NAME</th>
                                            <th>ADDRESS</th>
                                            <th>DATE OF BIRTH</th>
                                            <th>AGE</th>
                                            <th>RELATIONSHIP</th>
                                            <th>BENIFIT CLAIM</th>
                                            <th>DATE CLAIM</th>
                                        </tr>
                                  
                                    <tbody>
                                        <?php
                                            $totalAmtPerClaim = 0;
                                            $benifitName = "";
                                            $temp = $resClaim['contents'][0];
                                            $change = true;
                                            $changeBenifitName = false;
                                            $i = 0;
                                            $j = 0;
                                        ?>
                                        <?php foreach ($resClaim['contents'] as $KEY => $r): ?>
                                            <?php 
                                                if ($r['RESIDENT_ID'] !== $temp['RESIDENT_ID'] || $i == 0) {
                                                    $change = true;
                                                    $temp = $r;
                                                } else {
                                                    $change = false;
                                                }

                                                if ($r['BENIFIT_NAME'] !== $benifitName || $i == 0) {
                                                    $benifitName = $r['BENIFIT_NAME'];
                                                    $changeBenifitName = true;
                                                } else {
                                                    $changeBenifitName = false;
                                                } 

                                                if($changeBenifitName) {
                                                } else {
                                                }
                                            ?>
                                            <?php if($changeBenifitName && $i !== 0): ?>
                                                <tr>
                                                    <td colspan="2" style="text-align:right;padding:0.2%;"><b></b></td>
                                                    <td colspan="2" style="text-align:left;padding:0.2%;">
                                                        <b></b>
                                                    </td>
                                                </tr>
                                            <?php endif; ?>
                                            <?php if($change && $i !== 0): ?>
                                                <tr>
                                                    <td colspan="7" style="background:#ccc;padding:0.2%;"></td>
                                                </tr>
                                            <?php endif; ?>
                                            <tr>
                                                <td><?php echo $change ? $r['FULLNAME'] : ''; ?></td>
                                                <td><?php echo $change ? $r['ADDRESS'] : ''; ?></td>
                                                <td><?php echo $change ? $r['BIRTHDAY'] : ''; ?></td>
                                                <td><?php echo $change ? $r['AGE'] : ''; ?></td>
                                                <td><?php echo $change ? (
                                                    $r['IS_FAMILY_LEADER'] == 0 ?
                                                    $r['RELATIONSHIP_TO_HH_LEADER'] : 'HOUSEHOLD LEADER'
                                                ) : ''; ?></td>
                                                <td><?php echo $r['BENIFIT_NAME'] ; ?></td>
                                                <td><?php echo $r['DATE_CLAIM']; ?></td>
                                            </tr>
                                            <?php if($i == count($result) - 1): ?>
                                                <tr>
                                                    <td colspan="2" style="text-align:right;padding:0.2%;"><b></b></td>
                                                    <td colspan="2" style="text-align:left;padding:0.2%;">
                                                        <b></b>
                                                    </td>
                                                </tr>
                                            <?php endif; ?>
                                            <?php if($i == count($result) - 1): ?>
                                                <tr>
                                                    <td colspan="7" style="background:#ccc;padding:0.2%;"></td>
                                                </tr>
                                            <?php endif; ?>
                                        <?php $i++; endforeach; ?>
                                        <tr>
                                            <td colspan="3" style="background:#ccc;padding:0.2%;">
                                                TOTAL HOUSEHOLD BENIFICIARIES : <?php echo $hhpop; ?>
                                            </td>
                                            <td colspan="4" style="background:#ccc;padding:0.2%;">
                                                HOUSEHOLD LEADER : <?php echo $hhfname; ?>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <BR><br>
                            <?php endif; ?> 
                        <?php endforeach; ?>
                        <?php endif; ?> 
                    <?php endforeach; ?>
                    <BR>----------------<br>
                <?php endforeach; ?>
            </div>
        </div>
    </body>
</html>