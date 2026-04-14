$(document).ready(function() {
  
    // КНОПКИ
    if ($('.whiteButton')[0]) {
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
    }
    
    if ($('.redButton')[0]) {
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
    }

    // Отправка анкеты в БД
    $('.btn-send').on('click', function (e) {
        e.preventDefault();

        // Валидация формы
        const fullName = ($('input[name="full_name"]').val() || '').toString().trim();
        if (!fullName) {
            alert('Пожалуйста, введите имя и фамилию.');
            return;
        }

        const attendance = $('input[name="attendance"]:checked').val() || '';
        if (!attendance) {
            alert('Пожалуйста, укажите, планируете ли Вы быть.');
            return;
        }

        // Собираем данные формы
        const guests = $('input[name="guests"]:checked').val() || '';
        const transferTo = $('input[name="transfer_to"]:checked').val() || '';
        const stay = $('input[name="stay"]:checked').val() || '';
        const transferBack = $('input[name="transfer_back"]:checked').val() || '';
        const track = ($('input[name="track"]').val() || '').toString().trim();

        const drinks = $('input[name="drinks"]:checked')
            .map(function () { return $(this).val(); })
            .get();

        // Блокируем кнопку отправки
        const $sendBtn = $('.btn-send');
        $sendBtn.prop('disabled', true).text('Отправка...');

        // Отправляем данные на сервер Flask
        $.ajax({
            url: '/submit_anketa',  // Изменено с php на Flask эндпоинт
            method: 'POST',
            dataType: 'json',
            data: {
                full_name: fullName,
                attendance: attendance,
                guests: guests,
                transfer_to: transferTo,
                stay: stay,
                transfer_back: transferBack,
                track: track,
                drinks: drinks
            },
            success: function (res) {
                if (res && res.success) {
                    alert(res.message || 'Спасибо! Анкета отправлена.');
                    // Очищаем форму
                    $('input[name="full_name"]').val('');
                    $('input[name="attendance"]').prop('checked', false);
                    $('input[name="guests"]').prop('checked', false);
                    $('input[name="transfer_to"]').prop('checked', false);
                    $('input[name="stay"]').prop('checked', false);
                    $('input[name="transfer_back"]').prop('checked', false);
                    $('input[name="drinks"]').prop('checked', false);
                    $('input[name="track"]').val('');
                    // Перенаправляем на главную
                    window.location.href = 'index.html';
                } else {
                    alert((res && res.error) ? 'Ошибка: ' + res.error : 'Не удалось отправить анкету.');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Ошибка AJAX:', {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    textStatus: textStatus,
                    errorThrown: errorThrown
                });
                
                let errorMessage = 'Ошибка отправки анкеты.\n';
                errorMessage += 'Статус: ' + xhr.status + ' ' + xhr.statusText + '\n';
                
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage += 'Ошибка: ' + xhr.responseJSON.error;
                } else if (xhr.responseText) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.error) {
                            errorMessage += 'Ошибка: ' + response.error;
                        } else {
                            errorMessage += 'Ответ сервера: ' + xhr.responseText.substring(0, 200);
                        }
                    } catch (e) {
                        errorMessage += 'Ответ сервера: ' + xhr.responseText.substring(0, 200);
                    }
                } else {
                    errorMessage += 'Сервер не отвечает. Проверьте, запущен ли Flask сервер.';
                }
                
                alert(errorMessage);
            },
            complete: function() {
                // Разблокируем кнопку
                $sendBtn.prop('disabled', false).text('Отправить');
            }
        });
    });
});