/**********************************
********** header dropdown **************
**********************************/
const headerDropdown = (options) => {
  $('.header-dropdown').headerDropdown(options);
}
$.headerDropdown = function($ele, options){
  this.$ele = $ele;
  this.init();
}
$.headerDropdown.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.headerDropdown.prototype.initElement = function(){
  this.$btn = this.$ele.find('.btn-dropdown');
  this.$content = this.$ele.find('.header-dropdown-content');
}
$.headerDropdown.prototype.initEvent = function(){
  const self = this;
  this.$btn.on('click', function(){
    if(!self.$btn.hasClass('on')) self.open();
    else self.close();
  });
  $(document).on('click', function(e){
    const isHeaderDropdown = self.$ele.has($(e.target)).length;
    if(!isHeaderDropdown) self.close();
  });
}
$.headerDropdown.prototype.open = function(){
  this.$btn.addClass('on');
  this.$content.show();
}
$.headerDropdown.prototype.close = function(){
  this.$btn.removeClass('on');
  this.$content.hide();
}
$.fn.headerDropdown = function(options){
  return this.each(function(){
    if($(this).data('headerDropdown')) return;
    const instance = new $.headerDropdown($(this), options);
    $(this).data('headerDropdown', instance);
  });
}
