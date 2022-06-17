/**********************************
********** slider **************
**********************************/
const slider = (selector, options) => {
  $(selector).slider(options);
}
$.slider = function(selector, options){
  this.$ele = selector;
  this.init(options);
}
$.slider.default = {
}
$.slider.prototype.init = function(options){
  this.options = $.extend(true, {}, $.slider.default, options)
  this.initElement();
  this.initEvent();
}
$.slider.prototype.initElement = function(){
  this.$slider = this.$ele.find('.slider');
  this.$sliderHeader = this.$ele.find('.slider-header');
  this.$sliderContent = this.$ele.find('.slider-content');
  this.$sliderBtnbox = this.$ele.find('.slider-btnbox');
}
$.slider.prototype.initEvent = function(){
  const self = this;

  this.$slider.each(function(){
    if($(this).hasClass('on')) $(this).find('.slider-content').show();
  })
  this.$sliderBtnbox.on('click', function(){
    const $thisSlider = $(this).closest('.slider');
    $(this).closest('.slider').addClass('on').find('.slider-content').slideDown();
    $thisSlider.siblings('.slider').removeClass('on').find('.slider-content').slideUp('fast');
  });
}
$.fn.slider = function(options) {
  return this.each(function(){
    if($(this).data('slider')) return;
    const instance = new $.slider($(this), options);
    $(this).data('slider', instance);
  })
}
