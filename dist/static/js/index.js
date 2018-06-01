$(document).ready(function() {
  handleFullPage();
  handleCarousel();
  handleBodyClickForHideModal();
  handleAudioRandomMusic(0);
  handleCategorySwiper();
  handleCategoryMusicClick();
});

function handleCategoryModalSwiper () {
  var swiper = new Swiper('.modal.category .swiper-container', {
    navigation: {
      nextEl: '.modal.category .swiper-button-next',
      prevEl: '.modal.category .swiper-button-prev',
    },
    simulateTouch: false
  });
}

var audioCategory = null;
var seekbarCategory = null;
function handleAudioCategoryMusic () {
  var currentTimeSpan = $('.modal.category #category_currentTime');
  var duration = $('.modal.category #category_duration');
  // var cover = $('modal.category img').eq(index);

  // var data = cover.data();
  // var src = data.musicSrc;
  // var mainTitle = data.mainTitle;
  // var subTitle = data.subTitle;
  var src = '/static/music/That_Kid_in_Fourth_Grade_Who_Really_Liked_the_Denver_Broncos.mp3';

  $('modal.category .wrapper-music-description .main-title').html('타이틀');
  $('modal.category .wrapper-music-description .sub-title').html('서브타이틀');

  audioCategory = document.getElementById('category-audio');
  seekbarCategory = document.getElementById('category-seekbar');

  audioCategory.src = src;
  audioCategory.load();
  // audio.play();

  audioCategory.onloadeddata = function () {
    seekbarCategory.max = audio.duration;
    audioCategory.currentTime = 0;
    duration.html(secondSet(Math.floor(audioCategory.duration)));
    rangeInit();
  }

  audioCategory.ontimeupdate = function () {
    var current_time = this.currentTime;
    if (current_time == audioCategory.duration) { // 만약에 사운드가 끝나면 다시 처음으로
        this.currentTime = 0;
    }

    currentTimeSpan.html(secondSet(current_time));

    seekbarCategory.value = current_time;
    var rangeInterval = Number(seekbarCategory.getAttribute('max') - seekbarCategory.getAttribute('min'));
    var rangePercent = (Number(seekbarCategory.value) + Math.abs(seekbarCategory.getAttribute('min'))) / rangeInterval * 100;
    writeStyle({
        id: 'category-seekbar',
        percent: rangePercent
    });
  }

  seekbarCategory.onchange = function () {
    audioCategory.currentTime = this.value;
    currentTimeSpan.html(secondSet(this.value));
  };
}

function handleCategoryMusicClick () {
  var img = $('section.category .container .swiper-container .swiper-wrapper .swiper-slide .wrapper div img');
  var modal = $('.modal.category');
  img.click(function () {
    modal.addClass('active');
    handleCategoryModalSwiper();
    handleAudioCategoryMusic();
    var setFullPageScrollDisable = setInterval(function () {
      if (isStopFullPageMouseWheel) {
        clearInterval(setFullPageScrollDisable);
      }
      isStopFullPageMouseWheel = true;
    }, 100);
  });
}

function handleBodyClickForHideModal () {
  $('html, body').click(function (e) {
    var targetId = e.target.id;
    if (targetId === 'slideGame' || targetId === 'slideAnimation' || targetId === 'slideMovie') {
      hideModal();
    }
  });
}

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

app.controller('mainCtrl', function ($scope) {
  var categoryMusic = {
    game: [
      {
        src: '/static/images/category/game/1.jpg',
      },
      {
        src: '/static/images/category/game/2.jpg',
      },
      {
        src: '/static/images/category/game/3.jpg',
      },
      {
        src: '/static/images/category/game/4.jpg',
      },
      {
        src: '/static/images/category/game/5.jpg',
      },
      {
        src: '/static/images/category/game/6.jpg',
      },
      {
        src: '/static/images/category/game/7.jpg',
      },
      {
        src: '/static/images/category/game/8.jpg',
      },
    ],
    animation: [
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
    ],
    movie: [
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
      {
        src: '',
      },
    ]
  };


});
