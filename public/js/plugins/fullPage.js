/**********************************
********** fullpage **************
**********************************/
const fullpage = (selector, options) => {
  $(selector).fullpage(options);
}
$.fullpage = function($ele, options) {
  this.$ele = $ele;
  this.initElement();
  this.initEvent();
}
$.fullpage.prototype.initElement = function() {
  this.$btnFull = this.$ele;
}
$.fullpage.prototype.initEvent = function() {
  this.$btnFull.on('click', this.full);
}
$.fullpage.prototype.full = function() {
  const elem = document.documentElement;

  if(!$(this).data().isFull){
    if (elem.requestFullscreen) {
     elem.requestFullscreen();
     $(this).data('isFull', true);
   } else if (elem.webkitRequestFullscreen) { /* Safari */
     elem.webkitRequestFullscreen();
     $(this).data('isFull', true);
   } else if (elem.msRequestFullscreen) { /* IE11 */
     elem.msRequestFullscreen();
     $(this).data('isFull', true);
   } else{
     alert('이 브라우저는 풀페이지를 지원하지 않습니다!')
   }
  }else{
    if (document.exitFullscreen) {
      document.exitFullscreen();
      $(this).data('isFull', false);
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
      $(this).data('isFull', false);
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
      $(this).data('isFull', false);
    } else{
      alert('이 브라우저는 풀페이지 닫기를 지원하지 않습니다!')
    }
  }

}
$.fn.fullpage = function(options) {
  return this.each(function() {
    if($(this).data('fullpage')) return;
    const instance = new $.fullpage($(this), options);
    $(this).data('fullpage', instance);
    $(this).data('isFull', false);
  })
}
