/**********************************
********** form width control **************
**********************************/
const formWidth = (options) => {
  $('.ui-input[data-width]').formWidth();
  $('.ui-select[data-width]').formWidth();
  $('.ui-file[data-width]').formWidth();
  $('.ui-range[data-width]').formWidth();
}
$.formWidth = function(selector, options){
  this.$ele = selector;
  this.init();
}
$.formWidth.prototype.init = function(){
  const width = this.$ele.data('width');
  if (!isNaN(Number(width))) this.$ele.css({'flex-grow': width});
  else this.$ele.css({'flex': 'initial'}).width(width);
}
$.fn.formWidth = function(options) {
  return this.each(function(){
    if($(this).data('formWidth')) return;
    const instance = new $.formWidth($(this), options);
    $(this).data('formWidth', instance);
  })
}
