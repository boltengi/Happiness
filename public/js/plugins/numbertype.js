/**********************************
********** numbertype **************
**********************************/
const numbertype = (selector, options) => {
  $(selector).numbertype(options);
}
$.numbertype = function($ele, options){
  this.$ele = $ele;
  this.isNumbertype = false;
  this.numberExptext = /^[0-9]+$/;
  this.init();
}
$.numbertype.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.numbertype.prototype.initElement = function() {
  this.$eleForm = this.$ele.find(':first-child');
  this.$eleNode = this.$eleForm;
  this.eleType = this.$eleForm[0].tagName;
}
$.numbertype.prototype.initEvent = function(){
  const self = this;
  this.checkNumbertype();
  this.$eleForm.off('keyup.numbertype').on('keyup.numbertype', function(){
    self.checkNumbertype();
  });
}
$.numbertype.prototype.checkNumbertype = function(){
  const val = this.$eleForm.val() || '';
  return this.isNumbertype = this.numberExptext.test(val) ? true: false;
}
$.fn.numbertype = function(options){
  return this.each(function(){
    if($(this).data('numbertype')) return;
    const instance = new $.numbertype($(this), options);
    $(this).data('numbertype', instance);
  });
}
