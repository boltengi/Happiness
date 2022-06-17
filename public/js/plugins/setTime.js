/**********************************
********** ui-time **************
**********************************/
const setTime = function(selector, options){
  $(selector).setTime(options);
}
$.setTime = function($ele, options){
  this.$ele = $ele;
  this.isOpen = false;
  this.init();
}
$.setTime.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.setTime.prototype.initElement = function(){
  this.$timeSetting = this.$ele.find('.time-setting');
  this.$btnQuick = this.$ele.find('.btn-time-setting');
  this.$timeSettingContent = this.$ele.find('.time-setting-content');
  this.$btnClose = this.$ele.find('.btn-time-setting-close');
  this.$btnTimeChoice = this.$ele.find('.btn-time-choice');
  this.$btnSave = this.$ele.find('.btn-save');
}
$.setTime.prototype.open = function(){
  this.$timeSettingContent.show();
}
$.setTime.prototype.close = function(){
  this.$timeSettingContent.hide();
}
$.setTime.prototype.initEvent = function(){
  const self = this;
  this.$btnQuick.on('click.setTime', function(){
    if(!self.isOpen) self.open();
    else self.close();
  });
  this.$btnClose.on('click.setTime', function(){
    self.close();
  });
  this.$btnSave.on('click.setTime.close', function(){
    self.close();
  });
  this.$ele.on('click.setTime.close', '.btn-time-choice', function(){
    self.close();
  });
  $(document).on('click.setTime', function(e){
    const isTimset = $(e.target).closest(self.$ele).length || $(e.target).is(self.$ele).length;
    if(!isTimset) self.close();
  });
}
$.fn.setTime = function(options){
  return this.each(function(){
    if ($(this).data('setTime')) return;
    const instance = new $.setTime($(this), options);
    $(this).data('setTime', instance);
  });
}
