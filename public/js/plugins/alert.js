/**********************************
********** alert **************
**********************************/
const alertModal = (selector, options) => {
  $(selector).alert(options);
  return {
    open: function(){
      $(selector).data('alert').open()
    },
    close: function(selector){
      $(selector).data('alert').close()
    }
  }
}
$.alert = function($ele, options){
  this.$ele = $ele;
  this.init(options);
}
$.alert.default = {}
$.alert.prototype.init = function(options){
  this.options = $.extend(true, {}, $.alert.default, options)
  this.initElement();
  this.initEvent();
}
$.alert.prototype.initElement = function(){
  this.$btnClose = this.$ele.find('.alert-btn-close');
}
$.alert.prototype.initEvent = function(){
  this.$btnClose.on('click', this.close.bind(this));
}
$.alert.prototype.open = function(){
  this.$ele.show();
}
$.alert.prototype.close = function(){
  this.$ele.hide();
}
$.fn.alert = function(options){
  return this.each(function(){
    if($(this).data('alert')) return;
    const instance = new $.alert($(this), options);
    $(this).data('alert', instance);
  })
}
