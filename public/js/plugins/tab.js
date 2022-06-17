/**********************************
********** tab **************
**********************************/
const tab = (selector, options) => {
  $(selector).tab(options);
  return {
    openTab: function(tabname){
      $(selector).data('tab').openTab(tabname)
    }
  }
}
$.tab = function($ele, options){
  this.$ele = $ele;
  this.init();
}
$.tab.prototype.init = function(){
  this.initElement();
  this.initEvent();
}
$.tab.prototype.initElement = function(){
  this.$link = this.$ele.find('.tab-link');
  this.link = '.tab-link';
  this.$content = this.$ele.find('.tab-content');
  this.content = '.tab-content';
}
$.tab.prototype.initEvent = function(){
  const self = this;
  this.$ele.on('click.tab', this.link, function(e){
    e.preventDefault();
    const selectedTab = $(this).find('a').attr('href').replace('#','');
    self.openTab(selectedTab);
  });
}
$.tab.prototype.openTab = function(selectedTab){
  this.$ele.find(`.tab-link a[href="#${selectedTab}"]`).closest('.tab-link').addClass('on').siblings().removeClass('on');
  this.$content.filter('#' + selectedTab).addClass('on').siblings().removeClass('on');
}
$.fn.tab = function(options){
  return this.each(function(){
    if ($(this).data('tab')) return;
    const instance = new $.tab($(this), options);
    $(this).data('tab', instance);
  });
}
