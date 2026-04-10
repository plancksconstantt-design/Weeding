<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$dbname = 'Weeding'; // как в твоей БД
$user = 'Anna';
$password = '12Google121';

function strval_post(string $key): string {
    return isset($_POST[$key]) ? trim((string)$_POST[$key]) : '';
}

function bool_from_radio(string $value, string $expected): bool {
    return $value === $expected;
}

try {
    $pdo = new PDO(
        "pgsql:host=$host;dbname=$dbname",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $fullName = strval_post('full_name');
    if ($fullName === '') {
        echo json_encode(['success' => false, 'error' => 'Не заполнено поле: имя и фамилия']);
        exit;
    }

    $attendance = strval_post('attendance');     // yes/no
    $guests = strval_post('guests');             // 1/2/3
    $transferTo = strval_post('transfer_to');    // no/Ostrovets/Mogilev
    $stay = strval_post('stay');                 // yes/no
    $transferBack = strval_post('transfer_back');// no/Ostrovets/Mogilev

    $drinks = [];
    if (isset($_POST['drinks'])) {
        $drinks = is_array($_POST['drinks']) ? $_POST['drinks'] : [$_POST['drinks']];
    }

    $present = bool_from_radio($attendance, 'yes');

    $guests1 = $guests === '1';
    $guests2 = $guests === '2';
    $guests3 = $guests === '3';

    $transferNo = bool_from_radio($transferTo, 'no');
    $transferOstrovets = bool_from_radio($transferTo, 'Ostrovets');
    $transferMogilev = bool_from_radio($transferTo, 'Mogilev');

    $stayContinuation = bool_from_radio($stay, 'yes');

    $transferBackNo = bool_from_radio($transferBack, 'no');
    $transferBackOstrovets = bool_from_radio($transferBack, 'Ostrovets');
    $transferBackMogilev = bool_from_radio($transferBack, 'Mogilev');

    $drinkSet = array_fill_keys(array_map('strval', $drinks), true);

    $whiteDry = isset($drinkSet['white_dry']);
    $whiteSweet = isset($drinkSet['white_sweet']);
    $redDry = isset($drinkSet['red_dry']);
    $redSweet = isset($drinkSet['red_sweet']);
    $sparkling = isset($drinkSet['sparkling']);
    $vodka = isset($drinkSet['vodka']);
    $cognac = isset($drinkSet['cognac']);
    $nonAlcoholic = isset($drinkSet['non_alcoholic']);

    $sql = 'INSERT INTO "Анкета" (
        "Фамилия_Имя",
        "Присутствие",
        "Количество_человек_1",
        "Количество_человек_2",
        "Количество_человек_3",
        "Трансфер_нет",
        "Трансфер_Островец",
        "Трансфер_Могилев",
        "Присутствие_на_продолжении",
        "Трансфер_обратно_нет",
        "Трансфер_обратно_Островец",
        "Трансфер_обратно_Могилев",
        "белое_вино_сухое/полусухое",
        "белое_вино_сладкое/полусладкое",
        "красное_вино_сухое/полусухое",
        "красное_вино_сладкое/полусладкое",
        "игристое_вино",
        "водка",
        "коньяк",
        "безалкогольные_напитки"
    ) VALUES (
        :full_name,
        :present,
        :guests1,
        :guests2,
        :guests3,
        :transfer_no,
        :transfer_ostrovets,
        :transfer_mogilev,
        :stay_continuation,
        :transfer_back_no,
        :transfer_back_ostrovets,
        :transfer_back_mogilev,
        :white_dry,
        :white_sweet,
        :red_dry,
        :red_sweet,
        :sparkling,
        :vodka,
        :cognac,
        :non_alcoholic
    )';

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':full_name' => $fullName,
        ':present' => $present,
        ':guests1' => $guests1,
        ':guests2' => $guests2,
        ':guests3' => $guests3,
        ':transfer_no' => $transferNo,
        ':transfer_ostrovets' => $transferOstrovets,
        ':transfer_mogilev' => $transferMogilev,
        ':stay_continuation' => $stayContinuation,
        ':transfer_back_no' => $transferBackNo,
        ':transfer_back_ostrovets' => $transferBackOstrovets,
        ':transfer_back_mogilev' => $transferBackMogilev,
        ':white_dry' => $whiteDry,
        ':white_sweet' => $whiteSweet,
        ':red_dry' => $redDry,
        ':red_sweet' => $redSweet,
        ':sparkling' => $sparkling,
        ':vodka' => $vodka,
        ':cognac' => $cognac,
        ':non_alcoholic' => $nonAlcoholic,
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
