/**********************************
********** modal tab **************
**********************************/
const modalTab = (selector, options) => {
  $(selector).modalTab();
}
$.modalTab = function(selector, options){
  this.$ele = selector;
  this.init();
}
$.modalTab.prototype.init = function(){
  const self = this;
  this.$ele.on('click','.modal-tab-link', function(e){
    e.preventDefault();
    const index = self.$ele.find('.modal-tab-link').index($(this));
    $(this).addClass('on').siblings().removeClass('on');
    self.$ele.find('.modal-tab-content').eq(index).addClass('on').siblings().removeClass('on');
  });
}
$.fn.modalTab = function(options) {
  return this.each(function(){
    if($(this).data('modalTab')) return;
    const instance = new $.modalTab($(this), options);
    $(this).data('modalTab', instance);
  })
}
