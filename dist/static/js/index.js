$(document).ready(function() {
  handleFullPage();
  handleCarousel();
});

function handleFullPage () {
  var options = {
    menu: '#menu',
    anchors: ['about', 'randomMusic', 'category', 'recommandation'],
  };
  $('#fullpage').fullpage(options);
}

var carousel;
function handleCarousel () {
  var option = {
    flankingItems: 4,
    separation: 250,
    sizeMultiplier: 0.8,
    opacityMultiplier: 1
  };
  carousel = $("#carousel").waterwheelCarousel(option);
}

function carouselNext () {
  carousel.next();
}

function carouselPrev () {
  carousel.pev();
}
