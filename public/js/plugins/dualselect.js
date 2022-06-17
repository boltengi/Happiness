/**********************************
********** dualselect **************
**********************************/
const dualselect = (selector, options) => {
  $(selector).dualselect(options);
}
$.dualselect = function(selector, options){
  this.$ele = selector;
  this.init(options);
}
$.dualselect.default = {
}
$.dualselect.prototype.init = function(options){
  this.options = $.extend(true, {}, $.dualselect.default, options)
  this.initElement();
  this.initEvent();
}
$.dualselect.prototype.initElement = function(){
  this.$allItemBox = this.$ele.find('.all-item-box');
  this.$targetItemBox = this.$ele.find('.target-item-box');
  this.$leftBtn = this.$ele.find('.btn-dual-arrow-left');
  this.$rightBtn = this.$ele.find('.btn-dual-arrow-right');
  this.$searchBtn = this.$ele.find('.btn-explore');
}
$.dualselect.prototype.initEvent = function(){
  const self = this;

  this.$rightBtn.on('click.moveToRight', function(){
    const $allSelectedTr = self.$allItemBox.find('.tbody-scroll tr:not(".is-selected")').filter(function(){
      if (!$(this).data('ismovable')) return;
      return $(this).find('.ui-checkbox input').is(':checked');
    });
    $allSelectedTr.addClass('is-selected').hide();

    const $targetSelectedTr = $allSelectedTr.clone().show();
    $targetSelectedTr.prependTo(self.$targetItemBox.find('tbody'));
    self.$targetItemBox.find('tbody tr').each(function(){
      $(this).removeClass('is-selected')
      const $thisInput = $(this).find('.ui-checkbox input');
      $thisInput.attr('id',$thisInput.attr('id') + '-target');
      $thisInput.next('label').attr('for',$thisInput.attr('id'))
    });

    self.search(self.$targetItemBox);
    self.checkCheckbox();

    self.checkEmptybox(self.$allItemBox);
  });

  this.$leftBtn.on('click.moveToLeft', function(){
    const selectedDualIdx = [];
    const $targetSelectedTr = self.$targetItemBox.find('.tbody-scroll tr').filter(function(){
      if (!$(this).data('ismovable')) return;
      const isChecked = $(this).find('.ui-checkbox input').is(':checked')
      if(isChecked) selectedDualIdx.push($(this).data('dualid'));
      return isChecked;
    });
    $targetSelectedTr.remove();

    const $allSelectedTr = self.$allItemBox.find('.tbody-scroll tr').filter(function(){
      const dualid = $(this).data('dualid');
      return selectedDualIdx.filter(function(item){ return dualid == item }).length;
    });
    $allSelectedTr.removeClass('is-selected').show().find('.ui-checkbox input').prop('checked', true);

    self.search(self.$allItemBox);
    self.checkCheckbox();

    self.checkEmptybox(self.$targetItemBox);
  });

  this.$searchBtn.on('click.search', function(){
    const $searchedUtemList = $(this).closest('.item-box');
    self.search($searchedUtemList);
    self.checkCheckbox();
  });
}
$.dualselect.prototype.search = function($searchedUtemList){
  const inputVal = $searchedUtemList.find('.ui-explore input').val();
  const $itemlist = $searchedUtemList.find('.item-list');

  let count = 0;
  $itemlist.find('tbody tr:not(".is-selected")')
  .hide()
  .each(function(){
    const $thisTr = $(this).attr('data-ischeckable', false).attr('data-ismovable', false);
    let isInclude = false;
    $thisTr.find('td').each(function(){
      const text = $(this).text();
      if( text.indexOf(inputVal) != -1 ) isInclude = true;
    });
    if(isInclude) count++;
    if(isInclude) {$thisTr.show().attr('data-ischeckable', true).attr('data-ismovable', true);}
    if(count == 0 ){
      $itemlist.find('.dualselect-empty').show();
    }else{
      $itemlist.find('.dualselect-empty').hide();
    }
  });
}
$.dualselect.prototype.checkCheckbox = function(){
  const allItemCheck = this.$allItemBox.find('.table-check').data('tableCheck');
  allItemCheck.checkCheckbox();
  const targetItemCheck = this.$targetItemBox.find('.table-check').data('tableCheck');
  targetItemCheck.checkCheckbox();
}
$.dualselect.prototype.checkEmptybox = function($witchItembox){
  const isNotEmpty = $witchItembox.find('.tbody-scroll tr').filter(function(){return $(this).is(':visible')}).length;
  if(isNotEmpty) $witchItembox.find('.item-list').find('.dualselect-empty').hide();
  else $witchItembox.find('.item-list').find('.dualselect-empty').show();
}
$.fn.dualselect = function(options) {
  return this.each(function(){
    if($(this).data('dualselect')) return;
    const instance = new $.dualselect($(this), options);
    $(this).data('dualselect', instance);
  })
}
