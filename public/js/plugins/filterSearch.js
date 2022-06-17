/**********************************
********** filter search **************
**********************************/
const filterSearch = function(selector, options){
  $(selector).filterSearch(options);
}
$.filterSearch = function($ele, options){
  this.$ele = $ele;
  this.data = options.data;
  this.eventNS = 'filterSearch' + ($.filterSearch.count++)
  this.init(options);
}
$.filterSearch.default = {
  render: {
    selectWrap: function($selector, type){
      const selectID = `select${type == 'init' ? 'Init' : 'Condition'}${this.eventNS}`;
      $selector.wrap(`<div class="ui-select default-style" id="${selectID}" data-width="140px"></div>`);
      selectDropdown(`#${selectID}`);
    },
    inputWrap: function($selector){
      $selector.wrap(`<div class="ui-input default-style"></div>`);
    }
  }
}
$.filterSearch.count = 0;
$.filterSearch.prototype.init = function(options){
  this.options = $.extend(true, {}, $.filterSearch.default, options);
  this.initElement();
  this.initSelect();
  this.initEvent();
}
$.filterSearch.prototype.initElement = function(){
  this.$filterSearchArea = this.$ele.find('.filter-search-area');
  this.$searchArea = this.$ele.find('.search-area');
  this.$filterSelect = this.$ele.find('.filter-select');
  this.$btnAdd = this.$ele.find('.btn-filter-plus');
  this.$filterCondition = this.$ele.find('.filter-conditiion');
  this.$filterList = this.$ele.find('.table.collection-style.filter-type');
  this.$conditionBox = this.$filterSearchArea.find('.condition-box');
}
$.filterSearch.prototype.resetCondition = function(){
  const $conditionForm = this.$conditionBox.find('input');
  $conditionForm.val('');
}
$.filterSearch.prototype.whatisCondition = function(){
  return this.$conditionBox.find('input').length ? 'input' : 'select';
}
$.filterSearch.prototype.initSelect = function(){
  const $select = $('<select name="" id=""></select>');
  this.data.forEach(function(e){
    const $option = $(`<option value="${e.select.originval}">${e.select.dataval}</option>`);
    $option.data('option',e.condition);
    $option.appendTo($select);
  });
  this.$filterSelect.html($select);
  const condition = $select.find('option:selected').data('option');
  this.createCondition(this.$conditionBox, condition);

  this.options.render.selectWrap.call(this, $select, 'init');
}
$.filterSearch.prototype.createCondition = function($parent, dataOption){
  let $conditionForm;
  if(dataOption.type =='input'){
    $conditionForm = this.createConditionInput($parent);
  }else{
    const data = dataOption.options.map((e)=>({select : e}));
    $conditionForm = this.createConditionSelect($parent, data);
  }
}
$.filterSearch.prototype.createConditionSelect = function($parent, optionsData){
  const $select = $('<select name="" id=""></select>');
  optionsData.forEach(function(e){
    const $option = $(`<option value="${e.select.originval}">${e.select.dataval}</option>`);
    $option.data('option',e.condition);
    $option.appendTo($select);
  });
  $parent.html($select);

  this.options.render.selectWrap.call(this, $select, 'condition');
}
$.filterSearch.prototype.createConditionInput = function($parent){
  const $input = $('<input type="text" placeholder="">');
  $parent.html($input);
  this.options.render.inputWrap.call(this, $input);
}
$.filterSearch.prototype.changeSelect = function(){
  const self = this;
  this.$filterSelect.on('change', 'select', function(){
    self.$conditionBox.html('');
    const $selectedOption = $(this).find('option:selected');
    const dataOption = $selectedOption.data('option');
    self.createCondition(self.$conditionBox, dataOption);
  });
}
$.filterSearch.prototype.initEvent = function(){
  const self = this;
  this.$btnAdd.on('click', function(){
    const $selectedItem = self.$filterSelect.find('.ui-select select').find('option:selected');
    const selectVal = $selectedItem.val();
    const selectDataVal = $selectedItem.text();

    const whatIsForm = self.whatisCondition();
    let conditionVal, conditionDataVal;

    if(whatIsForm == 'input') {
      const $conditionForm = self.$conditionBox.find('input');
      conditionVal = $conditionForm.val();
      conditionDataVal = $conditionForm.val();
      if(conditionVal === '') return false;
    } else if(whatIsForm == 'select'){
      const $conditionForm = self.$conditionBox.find('select');
      conditionVal = $conditionForm.find('option:selected').val();
      conditionDataVal = $conditionForm.find('option:selected').text();
    }
    const $html = $('<tr></tr>');
    const $th = $(`<th scope="row" data-originval="${selectVal}">${selectDataVal}</th>`).appendTo($html);
    const $td = $(`<td data-originval="${conditionVal}">${conditionDataVal}</td>`).appendTo($html);
    const $btnMinus = $('<button type="button" class="btn btn-icon btn-filter-minus"><span class="icon icon-filter-minus"><span class="sr-only"></span></span></button>').appendTo($td);
    self.$filterList.find('tbody').append($html);
    if(whatIsForm == 'input') self.resetCondition();
  });

  this.$filterList.on('click', '.btn-filter-minus', function(){
    $(this).closest('tr').remove();
  });

  this.changeSelect();
}
$.fn.filterSearch = function(options){
  return this.each(function(){
    if($(this).data('filterSearch')) return;
    const instance = new $.filterSearch($(this), options);
    $(this).data('filterSearch', instance);
  });
}
