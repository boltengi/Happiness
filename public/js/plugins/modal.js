/**********************************
********** modal **************
**********************************/
const popupModal = (selector, options) => {
  $(selector).modal(options);
  return {
    open: function(){
      $(selector).data('modal').open()
    },
    close: function(selector){
      $(selector).data('modal').close()
    }
  }
}
$.modal = function($ele, options){
  this.$ele = $ele;
  this.init(options);
  this.modalTab();
}
$.modal.default = {
  afterCloseCallback: null
}
$.modal.prototype.init = function(options){
  this.options = $.extend(true, {}, $.modal.default, options)
  if (this.$ele.data('height')) this.isFixedHeight = true;
  this.initElement();
  this.initEvent();
}
$.modal.prototype.setHeight = function(){
  this.$ele.show()
  if(this.isFixedHeight) this.modalHeight = this.$ele.data('height');
  else this.modalHeight = this.$modalWrap.height();
  this.$ele.hide();
  this.$ele.find('.modal-box').height(this.modalHeight);
}
$.modal.prototype.initElement = function(){
  this.$modalWrap = this.$ele.find('.modal-wrap');
  this.$btnClose = this.$ele.find('.modal-btn-close');
}
$.modal.prototype.initEvent = function(){
  this.setHeight();
  this.$btnClose.on('click', this.close.bind(this));
}
$.modal.prototype.open = function(){
  this.$ele.show();
  this.options.afterOpen && this.options.afterOpen();
}
$.modal.prototype.close = function(){
  this.$ele.hide();
  this.options.afterCloseCallback && this.options.afterCloseCallback();
}
$.modal.prototype.modalTab = function(){
  modalTab(this.$ele);
}
$.fn.modal = function(options){
  return this.each(function(){
    if($(this).data('modal')) return;
    const instance = new $.modal($(this), options);
    $(this).data('modal', instance);
  })
}
