/**********************************
********** select **************
**********************************/
const selectDropdown = (selector, _options) => {
  $(selector).selectDropdown(_options);
}
$.selectDropdown = function($ele, _options){
  this.$ele = $ele;
  this.eventNS = 'selectDropdown' + ($.selectDropdown.count++)
  this.init(_options);
}
$.selectDropdown.defaults = {
  eleDefaultClass: 'ui-select',
  isMulti: false,
  isType: undefined,
  selectbtntext: 'Save changes',
  selectmulticontainer: false,
  selectBoxClass: 'select-box',
  selectDropboxClass: 'select-dropbox',
  selectContentClass: 'select-content',
  selectListClass: 'select-list',
  selectItemClass: 'select-item',
  selectItemAClass: 'select-item a',
  selectedItemClass: 'selected-item',
  btnSelectedDeleteClass: 'btn-selected-delete',
  selectMultiContainerClass: 'select-multi-container',
  selectMultiClass: 'select-multi',
  selectBtnClass: 'btn-chocieselect',
  render: {
    selectedItem: function(element){
      const {originval,textval,dataval} = element;
      const html = `${
        this.isType == 'iconTextBoth' ?
                                    `<span class="icon icon-${dataval}">${textval}</span><span class="color-${dataval}">${textval}</span>` :
        this.isType == 'icon' ?
                                    `<span class="icon icon-${dataval}">${textval}</span>` :
        this.isType == 'iconText' ?
                                    `<span class="icon icon-${dataval}"></span>` :
                                    textval
      }`;
      return html;
    },
    option: function(element){
      const {originval, textval, dataval, isSelected} = element;

      const {isMulti} = this;

      const html = `
        <li class="${this.selectItemClass}${isSelected || originval == this.nowSelectedItem ?' on' : ''}" data-originval="${originval}"
          ${isSelected && isMulti && originval !== '' ?' style="display: none; "' : ''}
        >
          <a href="#">
            ${
              this.isType == 'iconTextBoth' ?
                                          `<span class="icon icon-${dataval}">${dataval}</span><span class="color-${dataval}">${textval}</span>` :
              this.isType == 'icon' ?
                                          `<span class="icon icon-${dataval}">${dataval}</span>` :
              this.isType == 'iconText' ?
                                          `<span class="icon icon-${dataval}">${dataval}</span><span class="color-${dataval}">${textval}</span>` :
                                          textval
            }
          </a>
        </li>
      `;
      return html;
    },
    checkboxOption: function(element){
      const {originval, textval, dataval, isSelected, disabled, datanull, dataall} = element;
      if(datanull) return
      const html = `
        <li class="
          ${this.selectItemClass}${isSelected ?' on' : ''}
          ${dataall ? ' select-all' : ''}
          "
          data-originval="${originval}"
          ${dataall ? ' data-rel="all"' : ''}
        >
          <div class="ui-checkbox">
            <input type="checkbox" id="${this.eventNS}${originval}" value="${originval}" ${isSelected ? 'checked' : ''} ${disabled ? 'disabled="disabled"' : ''}>
            <label for="${this.eventNS}${originval}">${textval}</label>
          </div>
        </li>
      `;
      return html;
    },
    selectBtn: function(text){
      return `<button type="button" class="btn btn-normal primary-style smaller-size ${this.selectBtnClass}">
        ${this.selectbtntext}
      </button>`
    },
    item: function(element){
      const {originval,textval,dataval, disabled} = element;
      const html = `
        <div class="${this.selectedItemClass}" data-originval="${originval}">
          <span class="text">${textval}</span>
          <button type="button" class="${this.btnSelectedDeleteClass}"
            ${disabled ? 'disabled': ''}
          >x</button>
        </div>
      `;
      return html;
    },
  }
}
$.selectDropdown.count = 0;
$.selectDropdown.prototype.init = function(settings){
  $.extend(this, {
    isOpen: false,
    nowSelectedItem: '',
    selectedItem : this.isMulti ? [] : this.nowSelectedItem,
    ...settings
  });

  if(settings.templates) this.render = $.extend({}, this.render, settings.templates);

  this.initElement();
  this.initCreateElement();
  this.initEvent();

  if (!this.isMulti) this.singleInit();
  else if (this.isMulti === true) this.multiInit();
  else if (this.isMulti === 'checkbox') this.multiCheckboxInit();
}
$.selectDropdown.prototype.initElement = function(){
  this.$select = this.$ele.find('select');
}
$.selectDropdown.prototype.singleInit = function(){
  this.singleCreateElement();
  this.singleEvent();
}
$.selectDropdown.prototype.multiInit = function(){
  this.multiCreateElement();
  this.multiEvent();
}
$.selectDropdown.prototype.multiCheckboxInit = function(){
  this.checkboxCreateElement();
  this.checkboxEvent();
}
$.selectDropdown.prototype.initCreateElement = function(){
  const self = this;
  this.$selectDropbox && this.$selectDropbox.remove();

  const $selectDropbox = this.$selectDropbox = $(`<div class="${this.selectDropboxClass}" />`).appendTo(this.$ele);
  const $selectBox = this.$selectBox = $(`<div class="${this.selectBoxClass}" />`).appendTo($selectDropbox);
  const $selectContent = this.createSelectContent();
  const $selectList = this.$selectList = $(`<ul class="${this.selectListClass}" />`).appendTo($selectContent);
}
$.selectDropdown.prototype.createSelectContent = function(){
  if(this.position !== 'body'){
    this.$selectContent = $(`<div class="${this.selectContentClass}" />`).appendTo(this.$selectDropbox);
  } else {
    this.$selectContent = $(`<div class="${this.selectContentClass}" />`).appendTo($('body'));
  }
  const selectcontent = this.$selectContent.data('selectcontent') || `${this.eventNS}Content`;

  this.$ele.attr('data-selectcontent', selectcontent);
  this.$selectContent.attr({id: selectcontent});
  this.$selectContent.attr({'data-direction': this.direction});
  this.eleClass.forEach(item=>{this.$selectContent.addClass(item);});
  return this.$selectContent;
}
$.selectDropdown.prototype.singleCreateElement = function(){
  const selectedItem = this.getOption(this.selectedItem);
  this.singleSetSelectedItem(this.selectedItem);
  this.singleApplySelectBox(selectedItem);
}
$.selectDropdown.prototype.multiCreateElement = function(){
  if (this.selectmulticontainer) this.$selectMultiContainer = $(this.selectmulticontainer).addClass(this.selectMultiContainerClass);
  else this.$selectMultiContainer = $(`<div class="${this.selectMultiContainerClass}" />`).appendTo(this.$selectDropbox);
  const $selectMulti = this.$selectMulti = $(`<div class="${this.selectMultiClass}" />`).appendTo(this.$selectMultiContainer);

  this.selectedItem.forEach(function(value, index, array){

    const selectedItem = this.getOption(value);
    const html = this.render.item.call(this, selectedItem);
    $(html).appendTo(this.$selectMulti);

    if (index === array.length - 1) this.nowSelectedItem = value;
  }, this);

  const lastSelectedItem = this.getOption(this.nowSelectedItem);
  this.multiApplySelectBox(lastSelectedItem);
}
$.selectDropdown.prototype.checkboxCreateElement = function(){

  if (this.selectmulticontainer) this.$selectMultiContainer = $(this.selectmulticontainer).addClass(this.selectMultiContainerClass);
  else this.$selectMultiContainer = $(`<div class="${this.selectMultiContainerClass}" />`).appendTo(this.$selectDropbox);
  const $selectMulti = this.$selectMulti = $(`<div class="${this.selectMultiClass}" />`).appendTo(this.$selectMultiContainer);

  this.selectedItem.forEach(function(value, index, array){

    const selectedItem = this.getOption(value);
    const html = this.render.item.call(this, selectedItem);
    $(html).appendTo(this.$selectMulti);

    if (index === array.length - 1) this.nowSelectedItem = value;
  }, this);

  this.checkApplySelectBox();
}
$.selectDropdown.prototype.initEvent = function(){
  const self = this;
  this.$ele.on('click.selectDropdown', `.${this.selectBoxClass}`, function(){
    if (!self.isOpen) self.open();
    else self.close();
  });

  $(document).on('click.selectDropdown', function(e){
    const isSelect = $(e.target).closest(self.$selectBox).length || $(e.target).is(self.$selectBox).length
                      || $(e.target).closest(self.$selectContent).length
                      || $(e.target).is(self.$selectContent).length;

    if(!isSelect) self.close();
  });
}
$.selectDropdown.prototype.singleEvent = function(){
  const self = this;

  this.$select.on('change.selectDropdown', function(){
    const value = $(this).find('option:selected').val();
    self.singleSelectEvent(value);
  });

  this.$selectContent.on('click.selectDropdown', `.${this.selectItemAClass}`, function(e){
    e.preventDefault();
    const index = self.$selectContent.find(`.${self.selectItemAClass}`).index($(this));
    self.$select.find(`option:eq(${index})`).prop("selected", true);
    self.$select.trigger('change');
  });
}
$.selectDropdown.prototype.multiEvent = function(){
  const self = this;

  this.$select.on('change.selectDropdown', function(){
    const value = $(this).find('option:selected').val();
    self.multiSelectEvent(value);
  });

  this.$selectContent.on('click.selectDropdown', `.${this.selectItemAClass}`, function(e){
    e.preventDefault();
    const index = self.$selectContent.find(`.${self.selectItemAClass}`).index($(this));
    self.$select.find(`option:eq(${index})`).prop("selected", true);
    self.$select.trigger('change');
  });

  this.$selectContent.on('click.selectDropdown.multi', `.${this.selectItemAClass}`, function(e){
    e.preventDefault();

    const value = String($(this).closest('li').data('originval'));
    if(value === "") return;

    const selectedItem = self.getOption(value);
    const html = self.render.item.call(self, selectedItem);
    $(html).appendTo(self.$selectMulti);
  });

  this.$selectMultiContainer.on('click.selectDropdown.multi', `.${this.btnSelectedDeleteClass}`, function(e){
    e.preventDefault();

    const value = String($(this).closest(`.${self.selectedItemClass}`).data('originval'));
    self.$select.find(`option[value="${originval}"]`).prop('disabled', false);
    const selectedItem = self.getOption(value);
    const {originval, textval, dataval} = selectedItem;
    self.$selectMulti.find(`.${self.selectedItemClass}[data-originval="${originval}"]`).remove();

    self.multiSetSelectedItem(value);
    self.multiApplySelectBox(selectedItem);
  });
}
$.selectDropdown.prototype.checkboxEvent = function(){
  const self = this;
  this.$selectContent.on('click.selectDropdown.multiCheck', `.${this.selectBtnClass}`, function(e){
    e.preventDefault();

    self.$selectMulti.html('');
    self.selectedItem.forEach(function(item){
      const selectedItem = self.getOption(item);
      const html = self.render.item.call(self, selectedItem);
      $(html).appendTo(self.$selectMulti);
    });
  });

  this.$selectMultiContainer.on('click.selectDropdown.multiCheck', `.${this.btnSelectedDeleteClass}`, function(e){
    e.preventDefault();

    const value = String($(this).closest(`.${self.selectedItemClass}`).data('originval'));
    self.$select.find(`option[value="${originval}"]`).prop('disabled', false);

    const selectedItem = self.getOption(value);
    const {originval, textval, dataval} = selectedItem;

    self.deleteItem(value);

    self.$selectMulti.find(`.${self.selectedItemClass}[data-originval="${originval}"]`).remove();
    self.checkApplySelectBox();

    self.$ele.find(`input[type="checkbox"][value="${value}"]`).prop('checked', false);
  });

  this.$selectContent.on('click.selectDropdown.multiCheck',`.${this.selectBtnClass}`,  function(){
    self.checkSelectEvent();

    self.$selectMulti.html('');
    self.selectedItem.forEach(function(value){
      const selectedItem = self.getOption(value);
      const html = self.render.item.call(self, selectedItem);
      $(html).appendTo(self.$selectMulti);
    });
  });

  this.$selectContent.on('change.selectDropdown.multiCheck', `.ui-checkbox input`, function(e){
    const $thisCheckbox = $(this);
    const val = $thisCheckbox.val();
    const $checkbox = self.$selectContent.find(`.ui-checkbox input`);
    if(val === '@all') {
      const isAllChecked = $thisCheckbox.is(":checked");
      $checkbox.each(function(){
        const $eachCheckbox = $(this);
        if($eachCheckbox.is(':disabled')) return;
        if(isAllChecked) $eachCheckbox.prop('checked', true);
        else $eachCheckbox.prop('checked', false);
      });
    }else{
      const $allCheckbox = self.$selectContent.find(`.ui-checkbox input[value="@all"]`);
      let checkedLength = 0, allLength = 0;
      self.$selectContent.find(`.ui-checkbox input`).each(function(){
        const $this = $(this);
        if($this.is(":disabled")) return;
        if($this.val() == '@all') return;
        if($this.is(":checked")) checkedLength++;
        allLength++;
      });
      let isAllChecked = checkedLength == allLength;
      if(isAllChecked) $allCheckbox.prop('checked', true);
      else $allCheckbox.prop('checked', false);
    }
  });
}
$.selectDropdown.prototype.open = function(){
  if(this.isOpen) return;
  this.$selectBox.addClass('on');
  // this.$selectContent.css({
  //   visibility: 'visible',
  // });
  this.$selectContent.show().addClass('on');
  this.isOpen = true;

  if(!this.isMulti) {
    this.singleRefreshOptions();
    this.selectScrollTop();
  } else if(this.isMulti === true) {
    this.multiRefreshOptions();
    this.selectScrollTop();
  } else if(this.isMulti === 'checkbox') {
    this.allEachCheck();
    this.checkRefreshOptions();
  }
}
$.selectDropdown.prototype.close = function(){
  if(!this.isOpen) return;
  this.$selectBox.removeClass('on');
  // this.$selectContent.css({
  //   visibility: 'hidden',
  // });
  //
  this.$selectContent.hide().removeClass('on');
  this.isOpen = false;
}
$.selectDropdown.prototype.selectScrollTop = function(){
  if (!this.$selectContent.find(`.${this.selectItemClass}`).length) return;
  const $thisSelectItemA = this.$ele.find(`.${this.selectItemClassA}.on`);
  if(!$thisSelectItemA.length) return;
  const itemATop = $thisSelectItemA.offset().top;
  const selectListTop = this.$selectList.offset().top;
  const selectListScrollTop = this.$selectList.scrollTop();
  const scrollTop = itemATop - selectListTop + selectListScrollTop;
  this.$selectList.scrollTop(scrollTop);
}
$.selectDropdown.prototype.getOption = function(selectedItem){
  return this.options.find(element => element.originval === selectedItem);
}
$.selectDropdown.prototype.setPosition = function(){
  if(this.position != 'body') return;
  const selectX = this.$selectBox.offset().left,
      selectY = this.$selectBox.offset().top,
      selectHeight = this.$selectBox.outerHeight(),
      contentHeight = this.$selectContent.outerHeight();
  let x = selectX + 'px', y;

  let spacing = 0;

  if(this.isMulti == 'checkbox'){
    spacing = 10;
  }

  if(this.direction != 'up'){
    y = (selectY + selectHeight + spacing - 1) + 'px';
  }else {
    y = (selectY - contentHeight - spacing + 1 ) + 'px';
  }

  const minWidth = this.$selectBox.outerWidth();
  this.$selectContent.css({'min-width': minWidth + 'px'});
  this.$selectContent.css({ top: y, left: x });
}
$.selectDropdown.prototype.singleRefreshOptions = function(){
  this.$selectContent.html('');
  this.$selectList.html('');
  this.options.forEach(function(element){
    let html = ''
    html = this.render.option.call(this, element);
    this.$selectList.append(html);
  }, this);
  this.$selectContent.prepend(this.$selectList);
  this.setPosition();
}
$.selectDropdown.prototype.multiRefreshOptions = function(){
  this.$selectContent.html('');
  this.$selectList.html('');
  this.options.forEach(function(element){
    let html = ''
    html = this.render.option.call(this, element);
    this.$selectList.append(html);
  }, this);
  this.$selectContent.prepend(this.$selectList);
  this.setPosition();
}
$.selectDropdown.prototype.checkRefreshOptions = function(){
  const self = this;
  this.$selectContent.html('');
  this.$selectContent.addClass('choice-style');
  const $selectList = this.$selectList = $(`<ul class="select-list" />`);
  const $selectFooter = this.$selectFooter = $(`<div class="select-footer" />`).appendTo(this.$selectContent);
  const $selectBtn = this.$selectBtn = $(this.render.selectBtn.call(this)).appendTo(this.$selectFooter);

  this.options.forEach(function(element){
    const html = this.render.checkboxOption.call(this, element);
    this.$selectList.append(html);
  }, this);
  this.$selectContent.prepend(this.$selectList);

  this.setPosition();
}
$.selectDropdown.prototype.singleApplySelectBox = function(element = {}){
  const self = this;
  const { originval } = element;
  const html = this.render.selectedItem.call(this, element);
  this.$selectBox.html(html).data('originval', originval);
}
$.selectDropdown.prototype.multiApplySelectBox = function(element = {}){
  const self = this;
  const { originval } = element;
  const html = this.render.selectedItem.call(this, element);
  this.$selectBox.html(html).data('originval', originval);
}
$.selectDropdown.prototype.checkApplySelectBox = function(){
  const self = this;
  const element = this.getOption('@null');
  const { originval } = element;
  const html = this.render.selectedItem.call(this, element);
  this.$selectBox.html(html);
}
$.selectDropdown.prototype.singleSelectEvent = function(value){
  const selectedItem = this.getOption(value);

  this.singleSetSelectedItem(value);
  this.singleApplySelectBox(selectedItem);

  this.singleRefreshOptions();

  this.close();
}
$.selectDropdown.prototype.multiSelectEvent = function(value){
  const selectedItem = this.getOption(value);

  this.multiSetSelectedItem(value);

  this.multiApplySelectBox(selectedItem);

  this.multiRefreshOptions();

  this.close();
}
$.selectDropdown.prototype.checkSelectEvent = function(){
  const self = this;
  const selectedItems = []
  this.$selectList.find('.ui-checkbox input').each(function(){
    const $input = $(this);
    if(!$input.is(':checked')) return;
    const value = $input.val();
    if(value == '@null' || value == '@all') return;

    selectedItems.push(value)
  });

  this.checkSetSelectedItem(selectedItems);
  this.checkApplySelectBox();

  this.checkRefreshOptions();

  this.close();
}
$.selectDropdown.prototype.singleSetSelectedItem = function(value){
  this.nowSelectedItem = value;
  this.selectedItem = this.nowSelectedItem;
  const optionObj = {};
  if(value === '') return this.options.forEach(item=>item.isSelected = false);
  this.options.forEach(item=>{
    item.isSelected = false;
    // if(item.originval === '') return;
    optionObj[item.originval] = item;
  });

  [value].forEach(value=>optionObj[value].isSelected = true)
}
$.selectDropdown.prototype.multiSetSelectedItem = function(value){
  const isDuplicated = this.selectedItem.find(element => element == value, this);

  if (!isDuplicated) {
    this.nowSelectedItem = value;
    this.addItem(this.nowSelectedItem);
  } else {
    this.nowSelectedItem = '';
    this.deleteItem(value);
  }
}
$.selectDropdown.prototype.checkSetSelectedItem = function(values){
  const self = this;
  this.nowSelectedItem = {};
  this.selectedItem = values;

  this.changeState();
  this.allEachCheck();
}
$.selectDropdown.prototype.changeState  = function() {
  const optionObj = {};
  this.options.forEach(item=>{
    item.isSelected = false;
    optionObj[item.originval] = item;
  }, this);
  if(Array.isArray(this.selectedItem)) {
    this.selectedItem.forEach(value=>{
      if(!this.getOption(value)) return;
      this.getOption(value).isSelected = true;
    }, this);
  } else {
    this.getOption(this.selectedItem).isSelect = true;
  }
}
$.selectDropdown.prototype.addItem = function(value){
  this.selectedItem.push(value);
  this.changeState();
  this.allEachCheck();
}
$.selectDropdown.prototype.deleteItem = function(value){
  const i = this.selectedItem.indexOf(value);
  if(i > -1) this.selectedItem.splice(i, 1);

  this.changeState();
  this.allEachCheck();
}
$.selectDropdown.prototype.allEachCheck = function(){
  let checkedLength = 0, allLength = 0;
  this.options.forEach(function(option){
    if(option.disabled) return;
    if(option.originval == '@all') return;
    if(option.originval == '@null') return;
    if(option.isSelected) checkedLength++;
    allLength++;
  });
  const allisSelected = checkedLength == allLength;

  this.options.forEach(item=>{if(item.originval == '@all') item.isSelected = allisSelected;});
}
$.fn.selectDropdown = function(userOptions){
  return this.each(function(){
    const $selector = $(this);
    const $options = $selector.find('option');
    if($selector.data('selectDropdown')) return;

    const dataOptions = {};
    dataOptions.direction = $selector.data('direction');
    dataOptions.eleClass = $selector.attr('class').split(' ').filter(item=>item !== 'ui-select', this);
    dataOptions.selectbtntext = $selector.data('selectbtntext');
    dataOptions.selectmulticontainer = $selector.data('selectmulticontainer');
    dataOptions.position = $selector.data('position');
    dataOptions.selectcontent = $selector.data('selectcontent');
    dataOptions.isMulti = $selector.data('multi');
    dataOptions.isType =  $selector.hasClass('icon-text-both-type') ? 'iconTextBoth' :
                          $selector.hasClass('icon-type') ? 'icon' :
                          $selector.hasClass('icon-text-type') ? 'iconText' : undefined
    dataOptions.options = [];
    if(dataOptions.isMulti){
      dataOptions.selectedItem = [];
      const dataSelectedItem = $selector.data('selectedItem');
      if(dataSelectedItem) dataSelectedItem.forEach(element=>dataOptions.selectedItem.push(String(element.originval)));
      dataOptions.nowSelectedItem = $options.eq(0).val();
    }else{
      dataOptions.selectedItem = $options.eq(0).val();
      dataOptions.nowSelectedItem = dataOptions.selectedItem;
    }
    $options.each(function(index, element){
      const $option = $(this);

      const originval = $option.val();
      const textval = $option.text();
      const dataval = $option.data('val');

      let disabled, datanull, dataall;
      if($option.data('null')) datanull = true;
      if($option.data('all')) dataall = true;
      if($option.is(':disabled')) disabled = true;

      let isSelected = $option.is(':checked');
      if(dataOptions.selectedItem.indexOf(originval) > -1) isSelected = true;
      dataOptions.options.push({originval, textval, dataval, isSelected, disabled, datanull, dataall});

      if($option.is(':checked')) {
        if(dataOptions.isMulti) {
          dataOptions.nowSelectedItem = $option.val();
        }else{
          dataOptions.selectedItem = $option.val();
          dataOptions.nowSelectedItem = dataOptions.selectedItem;
        }
      };
    });
    const options = $.extend({}, $.selectDropdown.defaults, userOptions, dataOptions);

    const instance = new $.selectDropdown($selector, options);
    $(this).data('selectDropdown', instance);
  })
}
