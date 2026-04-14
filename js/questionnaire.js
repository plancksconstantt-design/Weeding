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

    
    
});

