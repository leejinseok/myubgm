$(document).ready(function() {
  handleFullPage();
  handleCarousel();
});

function handleFullPage () {
  var options = {
    menu: '#menu',
    anchors: ['about', 'randomMusic', 'category', 'recommandation'],
    flankingItems: 5
  };
  $('#fullpage').fullpage(options);
}

var carousel;
function handleCarousel () {
  var option = {};
  carousel = $("#carousel").waterwheelCarousel(option);
}

function carouselNext () {
  carousel.next();
}

function carouselPrev () {
  carousel.pev();
}
