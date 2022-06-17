/**********************************
********** emailtype **************
**********************************/
const emailtype = (selector, options) => {
  $(selector).emailtype(options);
}
$.emailtype = function($ele, options){
  this.$ele = $ele;
  this.isEmailtype = false;
  this.emailExptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  this.init();
}
$.emailtype.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.emailtype.prototype.initElement = function() {
  this.$eleForm = this.$ele.find(':first-child');
  this.$eleNode = this.$eleForm;
  this.eleType = this.$eleForm[0].tagName;
}
$.emailtype.prototype.initEvent = function(){
  const self = this;
  this.checkEmailtype();
  this.$eleForm.off('keyup.emailtype').on('keyup.emailtype', function(){
    self.checkEmailtype();
  });
}
$.emailtype.prototype.checkEmailtype = function(){
  const val = this.$eleForm.val() || '';
  return this.isEmailtype = this.emailExptext.test(val) ? true: false;
}
$.fn.emailtype = function(options){
  return this.each(function(){
    if($(this).data('emailtype')) return;
    const instance = new $.emailtype($(this), options);
    $(this).data('emailtype', instance);
  });
}
