var app = angular.module('muybgmApp', []);

/**
 * 초 단위 output 셋업
 * @param  {string} time
 * @return {string}
 */
function secondSet (time) {
  var response_str = '';
  if (time < 10) {
      response_str = '0:0' + time;
  } else if (time < 60) {
      response_str = '0:' + time;
  } else {
      var minute = time / 60;
      minute = Math.floor(minute);
      minute = minute < 10 ? '0' + minute : minute;
      var second = (time % 60) < 10 ? "0" + (time % 60) : (time % 60);
      response_str = minute + ':' + second;
  }
  return response_str;
}