$(document).ready(function() {
   
      //кнопка узнать подарок
        $('.btn-send').click(function(){
    let images = [
        'img/presents/present_1.png',
        'img/presents/present_2.png',
        'img/presents/present_3.png',
        'img/presents/present_4.png'
    ];
    
    let randomIndex = Math.floor(Math.random() * images.length);
    $('.present').attr('src', images[randomIndex]);

     $('.presentCard-div').append('<button class="yes-button text-CormorantSemiBold">Выбрать</button>');
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