<?php
$data = json_decode($_POST['data'], true);

if (count($data['res']) == 0) {
    echo '<b>No Results Found.</b>';
    return;
}

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
                <h2>HOUSE HOLD LEADER: <?php echo $result[0]['HHLEADERFULLNAME']; ?></h2>
                <h3><?php echo 'From : '. $data['param']['DATE_FROM'].' - '.' To : '.$data['param']['DATE_TO']; ?></h3>
            </div>
            <div id="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>RESIDENT NAME</th>
                            <th>ADDRESS</th>
                            <th>DATE OF BIRTH</th>
                            <th>AGE</th>
                            <th>RELATIONSHIP</th>
                            <th>BENIFIT CLAIM</th>
                            <th>DATE CLAIM</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            $totalAmtPerClaim = 0;
                            $benifitName = "";
                            $temp = $result[0];
                            $change = true;
                            $changeBenifitName = false;
                            $i = 0;
                            $j = 0;
                        ?>
                        <?php foreach ($result as $r): ?>
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
                                    <td colspan="6" style="background:#ccc;padding:0.2%;"></td>
                                </tr>
                            <?php endif; ?>
                            <tr>
                                <td><?php echo $change ? $r['FULLNAME'] : ''; ?></td>
                                <td><?php echo $change ? $r['ADDRESS'] : ''; ?></td>
                                <td><?php echo $change ? $r['BIRTHDAY'] : ''; ?></td>
                                <td><?php echo $change ? $r['AGE'] : ''; ?></td>
                                <td><?php echo $change ? $r['RELATIONSHIP_TO_HH_LEADER'] : ''; ?></td>
                                <td><?php echo $changeBenifitName ? $r['BENIFIT_NAME'] : ''; ?></td>
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
                                    <td colspan="6" style="background:#ccc;padding:0.2%;"></td>
                                </tr>
                            <?php endif; ?>
                        <?php $i++; endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </body>
</html>