/**********************************
********** maxbyte **************
**********************************/
const maxbyte = (selector, options) => {
  $(selector).maxbyte(options);
}
$.maxbyte = function($ele, options){
  this.$ele = $ele;
  this.isMaxbyte = false;
  this.maxbyte = Number(this.$ele.data('rel'));
  this.typebyte = 0;
  this.init();
}
$.maxbyte.default = {
  isStopType: true
}
$.maxbyte.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.maxbyte.prototype.initElement = function() {
  this.$eleForm = this.$ele.find('input').length ? this.$ele.find('input') : this.$ele.find('textarea');
}
$.maxbyte.prototype.initEvent = function(){
  const self = this;
  this.initMaxbyteEvent();
  this.$eleForm.on('keyup', function(e){
    self.checkTypebyte();
    if(self.checkMax()) {
      self.isMaxbyte = true;
      self.stopType();
    }else{
      self.isMaxbyte = false;
    };
    self.infoCallback();

    self.checkTypebyte();
    if(!self.checkMax()) {
      self.notmaxcallback();
      self.isMaxbyte = false;
    }
  });
}
$.maxbyte.prototype.initMaxbyteEvent = function(){
  this.checkTypebyte();
  if(this.checkMax()) {
    this.isMaxbyte = true;
  }else{
    this.isMaxbyte = false;
  };
  this.infoCallback();
}
$.maxbyte.prototype.checkMaxbyte = function(){
  this.typebyte = this.checkTypebyte();
  this.isMaxbyte = this.checkMax();
}
$.maxbyte.prototype.infoCallback = function(){
  if(!this.maxcallback) return
  if(this.isMaxbyte) {
    this.maxcallback();
  }else {
    this.notmaxcallback();
  }
}
$.maxbyte.prototype.maxcallback = function(){
  this.$ele.parent('dd').next('dd').children('.form-info').addClass('on')
}
$.maxbyte.prototype.notmaxcallback = function(){
  this.$ele.parent('dd').next('dd').children('.form-info').removeClass('on')
}
$.maxbyte.prototype.remainOnlyTargetValue = function(inputVal, maxbyte){
  return inputVal.substring(0, inputVal.length - 1);
}
$.maxbyte.prototype.stopType = function(){
  const val = this.$eleForm.val();
  const fixedVal = this.remainOnlyTargetValue(val, this.maxbyte);
  if (fixedVal) this.$eleForm[0].value = fixedVal;
}
$.maxbyte.prototype.checkTypebyte = function(){
  const val = this.$eleForm.val();
  let thisValByte = 0;
  for(let i = 0; i<val.length; i++){
    const oneChar = escape(val.charAt(i))
    if (oneChar.length == 1) thisValByte++;
    else if (oneChar.indexOf('%u') != -1) thisValByte += 3;
    else if (oneChar.indexOf('%') != -1) thisValByte++;
  }
  return this.typebyte = thisValByte;
}
$.maxbyte.prototype.checkMax = function(){
  return this.typebyte > this.maxbyte;
}
$.fn.maxbyte = function(options){
  return this.each(function(){
    if($(this).data('maxbyte')) return;
    const instance = new $.maxbyte($(this), options);
    $(this).data('maxbyte', instance);
  });
}
