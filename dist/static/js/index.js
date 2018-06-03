$(document).ready(function() {
  handleFullPage();
  handleCarousel();
  handleBodyClickForHideModal();
  handleAudioRandomMusic(0);
  // Category
  handleCategorySwiper();
  handleCategoryMusicClick();
  handleCategoryPlayBtnClick();
  handleCategoryModalPlayListEach();
});

function handleCategoryModalPlayListEach () {
  var playList = $('.modal.category .playlist');
  for(var i = 0; i < playList.length; i++) {
    handleAudioCategoryMusic(null, i);
  }
}

/**
 * 카테고리 > 모달 > 플레이버튼 클릭
 */
function handleCategoryPlayBtnClick () {
  var playBtn = $('.modal.category .playbtn');
  var tableTr = $('.modal.category .playlist-table table tr');
  var slide = $('.modal.category .swiper-slider');
  var playList = $('.modal.category .playlist');
  playBtn.click(function () {
    tableTr.removeClass('active');
    $(this).parents('tr').addClass('active');
    var data = $(this).data();
    var index = data.index;
    playList.eq(index).find('.play-and-download .pause').removeClass('hide');
    playList.eq(index).find('.play-and-download .play').addClass('hide');
    handleAudioCategoryMusic(data, index);
  })
}

function handleCategoryModalSwiper () {
  var swiper = new Swiper('.modal.category .swiper-container', {
    navigation: {
      nextEl: '.modal.category .swiper-button-next',
      prevEl: '.modal.category .swiper-button-prev',
    },
    simulateTouch: false,
  });
}


/**
 * 카테고리 뮤직 셋업
 */
function handleAudioCategoryMusic (data, index) {
  var init = false;

  if (!data) {
    // tableTr.eq(1).addClass('active');
    init = true;
    data = {
      src: '/static/music/That_Kid_in_Fourth_Grade_Who_Really_Liked_the_Denver_Broncos.mp3',
      title: '여시주의',
      artist: 'Red Velvet (레드벨벳)'
    };
  }

  data.index = index;

  var playList = $('.modal.category .playlist').eq(data.index);
  var audioCategory = null;
  var seekbarCategory = null;
  // var currentTimeSpan = $('.modal.category .playlist #category_currentTime');
  // var duration = $('.modal.category .playlist #category_duration');
  // var tableTr = $('.modal.category .playlist .playlist-table table tr');
  
  var currentTimeSpan = playList.find('#category_currentTime');
  var duration = playList.find('#category_duration');
  var tableTr = playList.find('.playlist-table table tr');
  var currentMusicTitle = playList.find('.image-and-musicData .musicData .audioPlay .title');
  var currentMusicArtist = playList.find('.image-and-musicData .musicData .audioPlay .artist');

  playList.find('.image-and-musicData .musicData .audioPlay .title').html(data.title);
  playList.find('.image-and-musicData .musicData .audioPlay .artist').html(data.artist);
  
  audioCategory = document.getElementById('category-audio-' + Number(data.index + 1));
  seekbarCategory = document.getElementsByClassName('category-seekbar')[data.index];

  audioCategory.src = data.src;
  audioCategory.load();
  if (!init) audioCategory.play();

  // 오디오 로딩
  audioCategory.onloadeddata = function () {
    seekbarCategory.max = audioCategory.duration;
    audioCategory.currentTime = 0;
    duration.html(secondSet(Math.floor(audioCategory.duration)));
    rangeInit();
  }

  // 오디오 타임 변경
  audioCategory.ontimeupdate = function () {
    var current_time = this.currentTime;
    if (current_time == audioCategory.duration) { // 만약에 사운드가 끝나면 다시 처음으로
        this.currentTime = 0;
    }

    currentTimeSpan.html(secondSet(Math.floor(current_time)));

    seekbarCategory.value = current_time;
    var rangeInterval = Number(seekbarCategory.getAttribute('max') - seekbarCategory.getAttribute('min'));
    var rangePercent = (Number(seekbarCategory.value) + Math.abs(seekbarCategory.getAttribute('min'))) / rangeInterval * 100;
    writeStyle({
        id: 'category-seekbar-' + data.index + 1,
        percent: rangePercent
    });
  }

  // 오디오 타임변경 (임의로)
  seekbarCategory.onchange = function () {
    audioCategory.currentTime = this.value;
    currentTimeSpan.html(secondSet(Math.floor(this.value)));
  };
}

/**
 * 카테고리 > 모달 > 플레이
 * @param {*} el 
 */
function playCategoryMusic (el, index) {
  var audio = document.getElementById('category-audio-' + index);
  var el = $(el);
  el.addClass('hide');
  el.next().removeClass('hide');
  audio.play();
}

/**
 * 카테고리 > 모달 > 일시정지
 * @param {*} el 
 */
function pauseCategoryMusic (el, index) {
  var audio = document.getElementById('category-audio-' + index);
  var el = $(el);
  el.addClass('hide');
  el.prev().removeClass('hide');
  audio.pause();
}

/**
 * 카테고리 모달 보여주기
 */
function handleCategoryMusicClick () {
  var img = $('section.category .container .swiper-container .swiper-wrapper .swiper-slide .wrapper div img');
  var modal = $('.modal.category');
  img.click(function () {
    modal.addClass('active');
    handleCategoryModalSwiper();
    var setFullPageScrollDisable = setInterval(function () {
      if (isStopFullPageMouseWheel) {
        clearInterval(setFullPageScrollDisable);
      }
      isStopFullPageMouseWheel = true;
    }, 100);
  });
}

/**
 * 모달 감추기
 */
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


function handleAudioRandomMusic (index) {
  var audio = null;
  var seekbar = null;
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
