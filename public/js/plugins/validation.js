/**********************************
********** validation **************
**********************************/
const validation = (selector, options) => {
  $(selector).validation(options);
}
$.validation = function($ele, options){
  this.$ele = $ele;
  this.isValidation = false;
  this.checktype = ['maxbyte', 'required', 'emailtype', 'numbertype', 'passwordconfirm'];
  this.validItems = [];
  this.init(options);
  this.checkValidationCallback = null;
}
$.validation.prototype.init = function(options){
  this.options = $.extend(true, {}, $.modal.default, options)
  this.initElement();
  this.initEvent();
}
$.validation.prototype.initElement = function() {
  const self = this;
  self.addValidItems();
}
$.validation.prototype.initEvent = function(){
  const self = this;
  this.checkValidation();
}
$.validation.prototype.addValidItem = function($validItem, idx){
  const self = this;
  const types = [];

  const validItemIdx = self.validItems.findIndex(function(element){
    return element.$item[0] == $validItem[0]
  });

  if (validItemIdx > -1) return false;

  $.each(self.checktype, function(index, element){
    if ($validItem.data(element)) types.push(element);
  });
  const item = {$item: $validItem, type: types};
  if (idx === undefined) return self.validItems.push(item);
  self.validItems.splice(idx, 0, item);
  self.checkItemValidation(self.validItems[idx]);
}
$.validation.prototype.addValidItems = function(){
  const self = this;
  self.$ele.find(`[data-valid]`).each(function(){
    self.addValidItem($(this));
  });
}
$.validation.prototype.removeValidItem = function($validItem){
  const self = this;
  const idx = self.validItems.findIndex(function(element){
    return element.$item[0] == $validItem[0]
  });

  if (idx < 0) return false;
  return self.validItems.splice(idx, 1);
}
$.validation.prototype.removeValidItems = function(){
  const self = this;
  self.validItems = [];
}
$.validation.prototype.checkItemValidation = function(item){
  let thisValidation = true;
  $.each(item.type, function(index, element){
    const _type = element.replace(/^./, element[0].toUpperCase());
    const ins = item.$item.data(element);
    let isThisValid = true;
    if(ins) {
      ins['check' + _type]();
      isThisValid = ins['is' + _type];
    }
    isThisValid = _type != 'Maxbyte' ? isThisValid : !isThisValid;
    thisValidation = thisValidation ? thisValidation && isThisValid : false;
  });
  item.isValid = thisValidation;
  return item.isValid;
}
$.validation.prototype.getUnValidItems = function(){
  if(this.isValidation) return null;
  const unValidItems = [];
  $.each(this.validItems, function(index, element){
    if (!element.isValid) unValidItems.push(element);
  })
  return unValidItems;
}
$.validation.prototype.checkValidation = function(){
  const self = this;
  let thisValidation = true;
  $.each(this.validItems, function(index, element){
    const isThisValid = self.checkItemValidation(element);
    thisValidation = thisValidation ? thisValidation && isThisValid : false;
  });
  this.isValidation = thisValidation;

  const unValidItems = this.getUnValidItems();

  this.options.checkValidationCallback && this.options.checkValidationCallback(unValidItems, this.isValidation);
  return this.isValidation;
}
$.fn.validation = function(options){
  return this.each(function(){
    if($(this).data('validation')) return;
    const instance = new $.validation($(this), options);
    $(this).data('validation', instance);
  });
}
