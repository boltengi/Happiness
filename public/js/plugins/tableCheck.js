/**********************************
********** tableCheck **************
**********************************/
const tableCheck = (selector, options) => {
  $(selector).tableCheck(options);
}
$.tableCheck = function($ele, options){
  this.$ele = $ele;
  this.ischeckable = this.$ele.data('ischeckable');
  this.initElement();
  this.initEvent();
}
$.tableCheck.prototype.initElement = function() {
  this.$allCheck = this.$ele.find('thead .cell-check .ui-checkbox input');
  this.allCheck = 'thead .cell-check .ui-checkbox input';
  this.$cellCheck = this.$ele.find(`tbody${this.ischeckable ? ' [data-ischeckable="true"]:not(".is-selected") ' : '' } .cell-check .ui-checkbox input`);
  this.cellCheck = `tbody${this.ischeckable ? ' [data-ischeckable="true"]:not(".is-selected") ' : '' } .cell-check .ui-checkbox input`;
}
$.tableCheck.prototype.initEvent = function() {
  const self = this;
  this.$ele.on('click.tableCheck', this.allCheck ,function(){
    const $this = $(this)
    if($this.is(':checked')) self.$ele.find(self.cellCheck).prop('checked', true)
    else self.$ele.find(self.cellCheck).prop('checked', false)
  });
  this.$ele.on('click.tableCheck', this.cellCheck, function(){
    self.checkCheckbox();
  });
}
$.tableCheck.prototype.checkCheckbox = function(){
  const hasCheckbox = this.$ele.find(this.cellCheck).length > 0;
  if(!hasCheckbox) return this.$allCheck.prop('checked', false);

  const isAllCheck = this.$ele.find(this.cellCheck).filter(':checked').length === this.$ele.find(this.cellCheck).length
  if(isAllCheck) this.$allCheck.prop('checked', true)
  else this.$allCheck.prop('checked', false)
}
$.fn.tableCheck = function(options){
  return this.each(function(){
    if ($(this).data('tableCheck')) return;
    const instance = new $.tableCheck($(this), options)
    $(this).data('tableCheck', instance);
  });
}
