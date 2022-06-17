/**********************************
********** feedbar **************
**********************************/
const feedbar = (selector, options) => {
  $('#feedbar').feedbar();
}
$.feedbar = function(selector, options){
  this.$ele = selector;
  this.init();
  this.isOpen = false;
}
$.feedbar.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.feedbar.prototype.initElement = function(){
  this.$btnFeedbar = $('[data-btn="feedbar"]');
}
$.feedbar.prototype.open = function(){
  this.isOpen = true;
  this.$ele.addClass('on').removeClass('off');
}
$.feedbar.prototype.close = function(){
  this.isOpen = false;
  this.$ele.removeClass('on').addClass('off');
}
$.feedbar.prototype.initEvent = function(){
  const self = this;
  self.$btnFeedbar.off('click.feedbar').on('click.feedbar', function(){
    if (self.isOpen) self.close();
    else self.open();
  });
  $(document).off('click.feedbar').on('click.feedbar', function(e){
    const isFeedbar = self.$ele.has($(e.target)).length
    const isFeedbarBtn = self.$btnFeedbar.has($(e.target)).length || self.$btnFeedbar[0] == $(e.target)[0];
    if(!isFeedbar && !isFeedbarBtn && self.isOpen) self.close();
  });
}
$.fn.feedbar = function(options) {
  return this.each(function(){
    if($(this).data('feedbar')) return;
    const instance = new $.feedbar($(this), options);
    $(this).data('feedbar', instance);
  })
}
