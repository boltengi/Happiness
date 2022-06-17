/**********************************
********** inputMultiPrint **************
**********************************/
const inputMultiPrint = (selector, options) => {
  $(selector).inputMultiPrint(options);
}

$.inputMultiPrint = function($ele, options) {
  this.$ele = $ele;
  this.init(options);
}

$.inputMultiPrint.default = {}
$.inputMultiPrint.prototype.init = function(options){
  this.options = $.extend(true, {}, $.inputMultiPrint.default, options)
  this.initElement();
  this.initEvent();
}

$.inputMultiPrint.prototype.initElement = function(){
  this.$formComponent = this.$ele.children().eq(0);
  this.inputValue = null;
  this.isKeyDown = false;
  this.$inputMulti = null;
}

$.inputMultiPrint.prototype.initEvent = function(){
  const self = this;
  // create formtag-multi
  this.$ele.append('<div class="input-multi"></div>');
  this.$inputMulti = this.$ele.find('.input-multi');

  this.$formComponent.on('keydown focusout', function(key) {
    // get inputValue
    self.inputValue = $(this).val();
    // input 값이 없을때 실행 X
    if(!self.inputValue) return;
    // keydown 후 focusout이 일어나 다시 함수가 실행되는것 방지
    if(this.isKeyDown){
      this.isKeyDown = false;
      return;
    }
    if(key.keyCode == 13){
      this.isKeyDown = true;
      this.blur();
      self.print(self.$inputMulti, 'inputed-item', self.inputValue);
      self.$formComponent.val('');
      const $itme = (self.$inputMulti).children(':first-child')
      const $btn = $itme.find('.btn-selected-delete');
      self.printClear($itme, $btn);
    }else if($(this).is(':focus') == false){
      self.print(self.$inputMulti, 'inputed-item', self.inputValue);
      self.$formComponent.val('');
      const $itme = (self.$inputMulti).children(':first-child')
      const $btn = $itme.find('.btn-selected-delete');
      self.printClear($itme, $btn);
    }
  })
}

$.inputMultiPrint.prototype.print = function($parent, className, selfValue){
  $parent.prepend(`
  <div class="${className}">
    <span class="text">${selfValue}</span>
    <button type="button" class="btn-selected-delete">x</button>
  </div>`);
}

$.inputMultiPrint.prototype.printClear = function($parent, $btn){
  $btn.on('click', function(){
    $parent.remove();
  })
}

$.fn.inputMultiPrint = function(options) {
  return this.each(function() {
    if( $(this).data('inputMultiPrint') || !($(this).data().outputmulti) ) return;

    const instance = new $.inputMultiPrint($(this), options);
    $(this).data('inputMultiPrint', instance);
  })
}
