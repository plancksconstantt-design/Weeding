function updateCountdown() {
    // Дата свадьбы: 8 августа 2026, 15:00
    const wedding = new Date(2026, 7, 8, 15, 0, 0);
    const now = new Date();

    let diff = wedding - now;
    if (diff <= 0) {
        $('#months').text('0');
        $('#days').text('0');
        $('#hours').text('0');
        return;
    }

 // Создаем копию текущей даты для расчета
    let current = new Date(now);
    // Расчет месяцев и дней вручную
    let years = wedding.getFullYear() - current.getFullYear();
    let months = wedding.getMonth() - current.getMonth();
    let days = wedding.getDate() - current.getDate();
    let hours = wedding.getHours() - current.getHours();
    let minutes = wedding.getMinutes() - current.getMinutes();
    // Корректировка отрицательных значений
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        // Получаем последний день предыдущего месяца
        let lastDayPrevMonth = new Date(wedding.getFullYear(), wedding.getMonth(), 0).getDate();
        days += lastDayPrevMonth;
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }
    // Общая разница в месяцах (годы переводим в месяцы)
    const totalMonths = years * 12 + months;
    $('#months').text(totalMonths);
    $('#days').text(days);
    $('#hours').text(hours);
}


// конверт
$(document).ready(function () {
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Intro envelope animation
    const $body = $('body');
    const $envelope = $('.envelope');
    const $mainInvitation = $('.mainInvitation');

    if ($envelope.length && $mainInvitation.length) {
        const getTodayKey = () => {
            const d = new Date();
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const todayKey = getTodayKey();
        const envelopeOpenedDate = localStorage.getItem('envelopeOpenedDate');
        const envelopeAlreadyOpened = envelopeOpenedDate === todayKey;

        if (envelopeAlreadyOpened) {
            // Конверт уже открывали: показываем сразу приглашение без анимации
            $envelope.remove();
            $body.removeClass('intro stage-opening stage-exit').addClass('stage-open');
            $mainInvitation.css({
                position: 'static',
                transform: 'translateY(0)'
            });
        } else {
            // Первый визит: показываем анимацию конверта
            $body.addClass('intro');

            let started = false;
            $envelope.on('click', function () {
                if (started) return;
                started = true;

                $body.addClass('stage-opening');
                $body.addClass('stage-exit'); // ← конверт начинает уезжать сразу

                // When invitation finished sliding to top
                const onInvitationTransitionEnd = function (e) {
                    if (e.originalEvent && e.originalEvent.propertyName !== 'transform') return;
                    $mainInvitation.off('transitionend', onInvitationTransitionEnd);

                    // After envelope exits, remove it and restore scroll
                    const onEnvelopeTransitionEnd = function (ev) {
                        if (ev.originalEvent && ev.originalEvent.propertyName !== 'transform') return;
                        $envelope.off('transitionend', onEnvelopeTransitionEnd);
                        $envelope.remove();
                        $body.removeClass('intro stage-opening stage-exit').addClass('stage-open');

                        // Запоминаем дату, когда конверт был открыт (раз в день)
                        localStorage.setItem('envelopeOpenedDate', todayKey);
                    };
                    $envelope.on('transitionend', onEnvelopeTransitionEnd);
                };

                $mainInvitation.on('transitionend', onInvitationTransitionEnd);
            });
        }
    }




    // КНОПКИ
    // Настройки для всех кнопок
const buttons = [
    { selector: '.btn-roulette', url: 'roulette.html', returnSection: 'roulette' },
    { selector: '.btn-questionnaire', url: 'questionnaire.html', returnSection: 'questionnaire' }
];

// Применяем обработчики ко всем кнопкам
buttons.forEach(btn => {
    $(btn.selector).on('pointerdown', function() {
        $(this).addClass('pressed');
    });
    
    $(btn.selector).on('pointerup', function() {
        $(this).removeClass('pressed');
    });
    
    $(btn.selector).click(function() {
        // Запоминаем, к какому блоку нужно вернуться на главной
        if (btn.returnSection) {
            localStorage.setItem('returnSection', btn.returnSection);
        }
        window.location.href = btn.url;
    });
});

    // При возврате на главную — прокрутка к нужному блоку (без конверта)
    const returnSection = localStorage.getItem('returnSection');
    if (returnSection) {
        let $target = null;
        if (returnSection === 'roulette') {
            $target = $('.details'); // блок с кнопкой "Рулетка"
        } else if (returnSection === 'questionnaire') {
            $target = $('.questionnaire'); // блок с кнопкой анкеты
        }

        if ($target && $target.length) {
            // Убираем конверт и сразу показываем приглашение
            if ($envelope.length) {
                $envelope.remove();
            }
            $body.removeClass('intro stage-opening stage-exit').addClass('stage-open');
            $mainInvitation.css({
                position: 'static',
                transform: 'translateY(0)'
            });

            // Мгновенный переход к нужному блоку без анимации пролистывания
            window.scrollTo(0, $target.offset().top);
        }

        // Очищаем, чтобы не скроллить каждый раз
        localStorage.removeItem('returnSection');
    }


});