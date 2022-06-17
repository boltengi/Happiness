/**********************************
********** passwordconfirm **************
**********************************/
const passwordconfirm = (selector, options) => {
  $(selector).passwordconfirm(options);
}
$.passwordconfirm = function($ele, options){
  this.$ele = $ele;
  this.isPasswordconfirm = false;
  this.init();
}
$.passwordconfirm.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.passwordconfirm.prototype.initElement = function() {
  this.$elePW = this.$ele.find('[data-password]');
  this.$eleForm = this.$elePW.find(':first-child');
  this.$eleNode = this.$eleForm;
  this.eleType = this.$eleForm[0].tagName;
}
$.passwordconfirm.prototype.initEvent = function(){
  const self = this;
  this.checkPasswordconfirm();
  this.$eleNode.eq(1).off('keyup.passwordconfirm').on('keyup.passwordconfirm', function(){
    self.checkPasswordconfirm();
  });
}
$.passwordconfirm.prototype.checkPasswordconfirm = function(){
  return this.isPasswordconfirm = this.$eleNode.eq(0).val() == this.$eleNode.eq(1).val() ? true :false;
}
$.fn.passwordconfirm = function(options){
  return this.each(function(){
    if($(this).data('passwordconfirm')) return;
    const instance = new $.passwordconfirm($(this), options);
    $(this).data('passwordconfirm', instance);
  });
}
