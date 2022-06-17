/**********************************
********** required **************
**********************************/
const required = (selector, options) => {
  $(selector).required(options);
}
$.required = function($ele, options){
  this.$ele = $ele;
  this.isRequired = false;
  this.init(options);
}
$.required.default = {
  multiSelectItemSelector: '.selected-item'
}
$.required.prototype.init = function(options){
  this.options = $.extend(true, {}, $.required.default, options)
  this.initElement();
  this.initEvent();
}
$.required.prototype.initElement = function() {
  this.$eleForm = $(this.$ele.find('>:first-child')[0]);
  this.$eleNode = this.$eleForm;
  this.eleType = this.$eleForm[0] ? this.$eleForm[0].tagName :  undefined;
  if(this.eleType == 'SELECT') this.isMultiSelect = this.$ele.data().multi;
}
$.required.prototype.initEvent = function(){
  const self = this;
  this.checkRequired();
  if (this.eleType == 'INPUT' || this.eleType == 'TEXTAREA') {
    this.$eleForm.off('keyup.required').on('keyup.required', function(){
      self.checkRequired();
    });
  }else if(this.eleType == 'SELECT'){
    this.$eleForm.off('change.required').on('change.required', function(){
      self.checkRequired();
    });
    if(this.isMultiSelect) this.$ele.find(this.options.multiSelectItemSelector).find('button').off('click.required').on('click.required', function(){ self.checkRequired(); });
  }
}
$.required.prototype.checkRequired = function(){
  if(this.isMultiSelect) { return this.isRequired = this.$ele.find(this.options.multiSelectItemSelector).length ? true: false; }
  else {
    var val = this.$eleForm.val();
    /* check empty - spacebar */
    var checkedNull = val == null || val.replace(/ /gi,"") == "" ? false : true;
    this.isRequired = checkedNull;
    return this.isRequired;
  }
}
$.fn.required = function(options){
  return this.each(function(){
    if($(this).data('required')) return;
    const instance = new $.required($(this), options);
    $(this).data('required', instance);
  });
}
