/**********************************
********** filter custom **************
**********************************/
const filterCustom = function(selector, options){
  $(selector).filterCustom(options);
}
$.filterCustom = function($ele, options){
  this.data = $.extend(true, [], options.data);
  this.originData = options.data;
  this.$ele = $ele;
  this.eventNS = 'filterCustom' + ($.filterCustom.count++)
  this.init();
}
$.filterCustom.default = {
  selectContentClass: 'select-content',
  render: {
    selectWrap: function($selector, type){
      const selectID = `select${type == 'init' ? 'Init' : 'Condition'}${this.eventNS}`;
      $selector.wrap(`<div class="ui-select default-style" id="${selectID}" ${type == 'init' ? 'data-width="140px"' : ''}></div>`);
      selectDropdown(`#${selectID}`);
      formWidth();
    },
    inputWrap: function($selector){
      $selector.wrap(`<div class="ui-input default-style"></div>`);
    }
  }
}
$.filterCustom.count = 0;
$.filterCustom.prototype.init = function(options){
  this.options = $.extend(true, {}, $.filterCustom.default, options);
  this.initElement();
  this.initEvent();
  this.isOpen = false;
}
$.filterCustom.prototype.initElement = function(){
  this.$customResult = this.$ele.find('.custom-result');
  this.$customSearch = this.$ele.find('.custom-search');
  this.$btnCustomSearch =  this.$ele.find('.btn-custom-search');
  this.$customSearchContent =  this.$ele.find('.custom-search-content');
  this.$customSearchHeader =  this.$ele.find('.custom-search-header');
  this.$btnClose =  this.$ele.find('.btn-custom-search-close')
  this.$customSearchBox =  this.$ele.find('.custom-search-box');
  this.$filterSelect = this.$ele.find('.filter-select');
  this.$conditionBox = this.$ele.find('.condition-box');
  this.$btnAdd = this.$ele.find('.btn-custom-add');
}
$.filterCustom.prototype.resetCondition = function(){
  const $conditionForm = this.$conditionBox.find('input');
  $conditionForm.val('');
}
$.filterCustom.prototype.whatisCondition = function(){
  return this.$conditionBox.find('input').length ? 'input' : 'select';
}
$.filterCustom.prototype.open = function(){
  this.$customSearchContent.show();
  this.initSelect();
  this.isOpen = true;
}
$.filterCustom.prototype.close = function(){
  this.$customSearchContent.hide();
  this.isOpen = false;
}
$.filterCustom.prototype.getCondition = function(obj){
  return this.data.find(element => {
    return JSON.stringify(element) === JSON.stringify(obj)
  })
}
$.filterCustom.prototype.addCondition = function(obj, origin){
  if(this.getCondition(obj)) return false;
  this.data.push(obj);
  this.initSelect();
  if(origin) this.originData.push(obj);
  return $.extend(true, [], this.data);
}
$.filterCustom.prototype.initSelect = function(){
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
$.filterCustom.prototype.createCondition = function($parent, dataOption){
  let $conditionForm;
  if(dataOption.type =='input'){
    $conditionForm = this.createConditionInput($parent);
  }else{
    const data = dataOption.options.map((e)=>({select : e}));
    $conditionForm = this.createConditionSelect($parent, data);
  }
}
$.filterCustom.prototype.createConditionSelect = function($parent, optionsData){
  const $select = $('<select name="" id=""></select>');
  optionsData.forEach(function(e){
    const $option = $(`<option value="${e.select.originval}">${e.select.dataval}</option>`);
    $option.data('option',e.condition);
    $option.appendTo($select);
  });
  $parent.html($select);

  this.options.render.selectWrap.call(this, $select, 'condition');
}
$.filterCustom.prototype.createConditionInput = function($parent){
  const $input = $('<input type="text" placeholder="">');
  $parent.html($input);
  this.options.render.inputWrap.call(this, $input);
  $input.focus();
}
$.filterCustom.prototype.changeSelect = function(){
  const self = this;
  this.$filterSelect.on('change', 'select', function(){
    self.$conditionBox.html('');
    const $selectedOption = $(this).find('option:selected');
    const dataOption = $selectedOption.data('option');
    self.createCondition(self.$conditionBox, dataOption);
  });
}
$.filterCustom.prototype.resetCustomSearch = function(){
  this.$filterSelect.find('select option:first-child').prop('selected', true).trigger('change');
}
$.filterCustom.prototype.addItem = function(obj){
  const selectVal = $.trim(obj.key.originval);
  const selectDataVal = $.trim(obj.key.dataval);
  const conditionVal = $.trim(obj.value.originval);
  const conditionDataVal = $.trim(obj.value.dataval);

  const $html = $('<div class="result-item"></div>');
  const $title = $(`<div class="result-title" data-result-key="${selectVal}">${selectDataVal}</div>`).appendTo($html);
  const $text = $(`<div class="result-text" data-result-value="${conditionVal}">${conditionDataVal}</div>`).appendTo($html);
  const $btnDelete = $(`<button type="button" class="btn btn-icon btn-result-delete"><span class="icon icon-custom-search-delete"><span class="sr-only"></span></span></button>`).appendTo($html);
  this.$customResult.append($html);
}
$.filterCustom.prototype.initEvent = function(){
  const self = this;
  this.$btnCustomSearch.on('click.filterCustom', function(){
    if(!self.isOpen) self.open();
    else self.close();
  });
  this.$btnClose.on('click.filterCustom', function(){
    self.close();
  });
  this.$btnAdd.on('click.filterCustom', function(){
    self.close();
  });
  $(document).on('click.filterCustom', function(e){
    const $filterSelectContent = $(`#${self.$filterSelect.find(`.ui-select`).data('selectcontent')}`);
    const $conditionBoxContent = $(`#${self.$conditionBox.find(`.ui-select`).data('selectcontent')}`);
    const isFilterCustom = (function($containers, e){
      const scrollX = $(window).scrollLeft(), scrollY = $(window).scrollTop();

      function isInclude($container,e){
        if(!$container.length) return false;
        const isVisible = $container.is(':visible');
        if(!isVisible) $container.show();
        const clientX = e.clientX, clientY = e.clientY;
        const containerX = $container.offset().left - scrollX, containerY = $container.offset().top - scrollY,
              containerW = $container.outerWidth(), containerH = $container.outerHeight();
        if(!isVisible) $container.hide();
        const coordinate = {
          topLeft: {x: containerX, y: containerY},
          topRight: {x: containerX + containerW, y: containerY},
          bottomRight: {x: containerX + containerW, y: containerY + containerH},
          bottomLeft: {x: containerX, y: containerY + containerH},
        }
        return (coordinate.topLeft.x < clientX && coordinate.topRight.x > clientX) && (coordinate.topLeft.y < clientY && coordinate.bottomLeft.y > clientY);
      }
      const isIncludes = $containers.map($container => isInclude($container, e));
      return isIncludes.find((item) => item === true);
    })([self.$customSearchContent, self.$btnCustomSearch, $filterSelectContent, $conditionBoxContent], e);

    if(!isFilterCustom) self.close();
  });

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
    self.addItem({key: {originval:selectVal, dataval:selectDataVal}, value: {originval:conditionVal, dataval:conditionDataVal}});
    self.resetCustomSearch()
  });
  this.$customResult.on('click', '.btn-result-delete', function(){
    $(this).closest('.result-item').remove();
  });

  this.changeSelect();
}
$.fn.filterCustom = function(options){
  return this.each(function(){
    if($(this).data('filterCustom')) return;
    const instance = new $.filterCustom($(this), options);
    $(this).data('filterCustom', instance);
  });
}
