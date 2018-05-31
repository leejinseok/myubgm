$(document).ready(function() {
  handleFullPage();
  handleCarousel();
  handleAudioRandomMusic(0);
  handleCategorySwiper();
});

var isStopFullPageMouseWheel = false;
function handleCategorySwiper () {
  var swiper = new Swiper('section.category .swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    mousewheel: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}

function handleFullPage () {
  var options = {
    menu: '#menu',
    anchors: ['about', 'randomMusic', 'category', 'recommandation'],
    onLeave: function(index, nextIndex, direction){
      if ((nextIndex === 4 || nextIndex === 2) && isStopFullPageMouseWheel){
        return false;
      }
    }
  };
  $('#fullpage').fullpage(options);
}

var carousel;
function handleCarousel () {
  var option = {
    flankingItems: 4,
    separation: 250,
    sizeMultiplier: 0.8,
    opacityMultiplier: 1,
    clickedCenter: function ($clickedItem) {
    },
    movedToCenter: function ($newCenterItem) {
      var index = $('#carousel img').index($newCenterItem);
      handleAudioRandomMusic(index);
    }
  };
  carousel = $("#carousel").waterwheelCarousel(option);
}

function carouselNext () {
  carousel.next();
}

function carouselPrev () {
  carousel.pev();
}


var inlineStyleContent = new Array;
var inlineStyle = document.createElement('style');

function rangeInit () {
    var DEBUG = true;
    var rangeSelector = document.querySelectorAll('[type=range]');
    document.body.appendChild(inlineStyle);
    var eventname = new Event('input');
    for (var i = 0; i < rangeSelector.length; i++) {
      var item = rangeSelector[i];
      item.addEventListener('input', function () {
          var rangeInterval = Number(this.getAttribute('max') - this.getAttribute('min'));
          var rangePercent = (Number(this.value) + Math.abs(this.getAttribute('min'))) / rangeInterval * 100;
          // DEBUG ? console.log("#" + this.id + ": " + rangePercent + "%") : ''; // for debug
          writeStyle({
              id: this.id,
              percent: rangePercent
          });
      }, false);
      item.dispatchEvent(eventname); // update bars at startup
    }
}

/**
 * Write Style element
 * 
 * @param {object} obj id: HTML id, percent: value
 */
function writeStyle (obj) {
    var find = inlineStyleContent.map(function (x) {
      return x.id;
    }).indexOf(obj.id);

    var styleText = '';

    if (find === -1) {
        inlineStyleContent.push(obj);
    } else {
        inlineStyleContent[find] = obj;
    }

    for (var i = 0; i < inlineStyleContent.length; i++) {
      var item = inlineStyleContent[i];
      styleText += '#' + item.id + '::-webkit-slider-runnable-track{background-size:' + item.percent + '% 100%} ';
    }

    inlineStyle.textContent = styleText;
}

var audio = null;
var seekbar = null;
function handleAudioRandomMusic (index) {
  var currentTimeSpan = $('section.randomMusic #randomMusic_currentTime');
  var duration = $('section.randomMusic #randomMusic_duration');
  var cover = $('section.randomMusic #carousel img').eq(index);
  var data = cover.data();
  var src = data.musicSrc;
  var mainTitle = data.mainTitle;
  var subTitle = data.subTitle;

  $('section.randomMusic .wrapper-music-description .main-title').html(mainTitle);
  $('section.randomMusic .wrapper-music-description .sub-title').html(subTitle);

  audio = document.getElementById('randomMusic-audio');
  seekbar = document.getElementById('randomMusic-seekbar');

  audio.src = src;
  audio.load();
  // audio.play();

  audio.onloadeddata = function () {
    seekbar.max = audio.duration;
    audio.currentTime = 0;
    duration.html(secondSet(Math.floor(audio.duration)));
    rangeInit();
  }

  audio.ontimeupdate = function () {
    var current_time = this.currentTime;
    if (current_time == audio.duration) { // 만약에 사운드가 끝나면 다시 처음으로
        this.currentTime = 0;
    }

    currentTimeSpan.html(secondSet(current_time));

    seekbar.value = current_time;
    var rangeInterval = Number(seekbar.getAttribute('max') - seekbar.getAttribute('min'));
    var rangePercent = (Number(seekbar.value) + Math.abs(seekbar.getAttribute('min'))) / rangeInterval * 100;
    writeStyle({
        id: 'randomMusic-seekbar',
        percent: rangePercent
    });
  }

  seekbar.onchange = function () {
    audio.currentTime = this.value;
    currentTimeSpan.html(secondSet(this.value));
  };
}

function togglePlay (status) {
  var audioStatus = {
    PLAY: 1,
    STOP: -1,
    PAUSE: 0
  };

  if (status === audioStatus.PLAY) {
    audio.play();
    return;
  }

  if (status === audioStatus.STOP) {
    audio.pause();
    audio.currentTime = 0;
    return;
  }

  if (status === audioStatus.PAUSE) {
    audio.pause();
    return;
  }
}