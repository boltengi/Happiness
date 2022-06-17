/**********************************
********** screen **************
**********************************/
const screen = (selector, options) => {
  $(selector).screen(options);
}
$.screen = function(selector, options){
  this.$ele = selector;
  this.init(options);
}
$.screen.default = {
  openBeforeCallback : null,
  openAfterCallback : null,
  closeBeforeCallback : null,
  closeAfterCallback : null,
}
$.screen.prototype.init = function(options){
  this.options = $.extend(true, {}, $.screen.default, options)
  this.isOpen = true;
  this.initElement();
  this.initEvent();
}
$.screen.prototype.initElement = function(){
  this.closeBtn = '.screen-btn-close';
  this.$closeBtn = this.$ele.find('.screen-btn-close');
}
$.screen.prototype.open = function(obj = {}){
  if(this.isOpen) return;
  this.isOpen = true;
  const beforeCallback = obj.beforeOpenCallback || this.options.beforeOpenCallback;
  const afterCallback = obj.afterOpenCallback || this.options.afterOpenCallback;

  beforeCallback && beforeCallback();
  this.$ele.show();
  afterCallback && afterCallback();
}
$.screen.prototype.close = function(obj = {}){
  if(!this.isOpen) return;
  this.isOpen = false;
  const beforeCallback = obj.beforeCloseCallback !== undefined ? obj.beforeCloseCallback : this.options.beforeCloseCallback;
  const afterCallback = obj.afterCloseCallback !== undefined ? obj.afterCloseCallback : this.options.afterCloseCallback;

  beforeCallback && beforeCallback();
  this.$ele.hide();
  afterCallback && afterCallback();
}
$.screen.prototype.remove = function(){
  this.$ele.remove();
}
$.screen.prototype.initEvent = function(){
  const self = this;
  this.$closeBtn.off('click.screenClose').on('click.screenClose', function(){
    self.close();
  });
}
$.fn.screen = function(options) {
  return this.each(function(){
    if($(this).data('screen')) return;
    const instance = new $.screen($(this), options);
    $(this).data('screen', instance);
  })
}
