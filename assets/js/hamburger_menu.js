var burgerIcon = document.querySelector('#burger');
var navbarMenu = document.querySelector('#nav-links');

var toolButton = document.querySelector('#toolButton');

burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
});

toolButton.addEventListener('click', () => {
toolButton.classList.toggle('is-active');
});

var test = document.querySelector('.footer');
