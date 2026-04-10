$(document).ready(function() {
  
     // КНОПКИ
    $('.whiteButton')[0].addEventListener(
        'pointerdown',
        function () {
            $('.whiteButton').addClass('pressed');
        }, false);
        $('.whiteButton')[0].addEventListener(
        'pointerup',
        function () {
            $('.whiteButton').removeClass('pressed');
        }, false);
    
        $('.redButton')[0].addEventListener(
        'pointerdown',
        function () {
            $('.redButton').addClass('pressed-red');
        }, false);
        $('.redButton')[0].addEventListener(
        'pointerup',
        function () {
            $('.redButton').removeClass('pressed-red');
        }, false);

    // Отправка анкеты в БД
    $('.btn-send').on('click', function (e) {
        e.preventDefault();

        const fullName = ($('input[name="full_name"]').val() || '').toString().trim();
        if (!fullName) {
            alert('Пожалуйста, введите имя и фамилию.');
            return;
        }

        const attendance = $('input[name="attendance"]:checked').val() || '';
        const guests = $('input[name="guests"]:checked').val() || '';
        const transferTo = $('input[name="transfer_to"]:checked').val() || '';
        const stay = $('input[name="stay"]:checked').val() || '';
        const transferBack = $('input[name="transfer_back"]:checked').val() || '';
        const track = ($('input[name="track"]').val() || '').toString().trim();

        const drinks = $('input[name="drinks"]:checked')
            .map(function () { return $(this).val(); })
            .get();

        $.ajax({
            url: 'php/questionnaire.php',
            method: 'POST',
            dataType: 'json',
            data: {
                full_name: fullName,
                attendance,
                guests,
                transfer_to: transferTo,
                stay,
                transfer_back: transferBack,
                track,
                drinks
            },
            success: function (res) {
                if (res && res.success) {
                    alert('Спасибо! Анкета отправлена.');
                    window.location.href = 'index.html';
                } else {
                    alert((res && res.error) ? res.error : 'Не удалось отправить анкету.');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                const status = xhr && typeof xhr.status !== 'undefined' ? xhr.status : '';
                const responseText = (xhr && xhr.responseText) ? String(xhr.responseText) : '';
                const preview = responseText ? responseText.slice(0, 300) : '';

                alert(
                    'Ошибка отправки анкеты.\n' +
                    'Статус: ' + status + ' ' + textStatus + (errorThrown ? (' (' + errorThrown + ')') : '') + '\n' +
                    (preview ? ('Ответ сервера:\n' + preview) : 'Ответ сервера пустой.')
                );
            }
        });
    });
});

