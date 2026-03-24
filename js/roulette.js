$(document).ready(function() {
    $('.btn-send').click(function() {
        // Генерируем случайное число от 1 до 3
        const randomNum = Math.floor(Math.random() * 3) + 1; 
    });

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

    
});