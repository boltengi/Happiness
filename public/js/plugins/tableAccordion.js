/**********************************
********** tableAccordion **************
**********************************/
const tableAccordion = (selector, options) => {
  $(selector).tableAccordion(options);
}
$.tableAccordion = function($ele, options){
  this.$ele = $ele;
  this.init();
  this.beforeSlideDown = options && options.beforeSlideDown;
  this.afterSlideUp = options && options.afterSlideUp;
}
$.tableAccordion.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.tableAccordion.prototype.initElement = function() {
  this.$btn = this.$ele.find('.btn-accordion');
  this.btn = '.btn-accordion';
}
$.tableAccordion.prototype.open = function($btn){
  const $title = $btn.closest('.accordion-content-title');
  const $content = $title.next('.accordion-content');
  const $contentBox = $content.find('.accordion-content-box');

  $btn.addClass('on');
  $title.addClass('on');
  $content.show();
  $contentBox.slideDown();
}
$.tableAccordion.prototype.close = function($btn){
  const self = this;
  const $title = $btn.closest('.accordion-content-title');
  const $content = $title.next('.accordion-content');
  const $contentBox = $content.find('.accordion-content-box');

  $btn.removeClass('on');
  $title.removeClass('on');
  $contentBox.slideUp(function(){
    if (this.afterSlideUp) this.afterSlideUp({btnEle: $btn});
    $content.hide();
  });
}
$.tableAccordion.prototype.initEvent = function(){
  const self = this;
  this.$ele.on('click.tableAccordion', this.btn, function(){
    const $this = $(this);
    const isOpen = $this.hasClass('on');
    if (!isOpen){
      if (!self.beforeSlideDown) return self.open($this);
      const promise = self.beforeSlideDown({btnEle: $this});
      if (!promise || typeof promise.then !== 'function') return self.open($this);
      promise.then(function(){
        self.open($this);
      });
    } else {
      self.close($this);
    }
  });
}
$.fn.tableAccordion = function(options){
  return this.each(function(){
    if($(this).data('tableAccordion')) return;
    const instance = new $.tableAccordion($(this), options);
    $(this).data('tableAccordion', instance);
  });
}
