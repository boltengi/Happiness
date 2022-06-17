/**********************************
********** addContentList **************
**********************************/
const addContentList = (selector, options) => {
  $(selector).addContentList(options);
}
$.addContentList = function($ele, options) {
  this.$ele = $ele;
  this.init(options);
}
$.addContentList.default = {}
$.addContentList.prototype.init = function(options){
  this.options = $.extend(true, {}, $.addContentList.default, options)
  this.initElement();
  this.initEvent();
}
$.addContentList.prototype.initElement = function() {
  this.$contentItem = null;
  this.$btnContentItemAdd = this.$ele.find('.addContentItemBtn');
  this.$btnContentItemRemove = null;
  this.$contentListBox = this.$ele.find('.content-list-box');
  this.$showItemArray = this.$ele.find('[data-showItem]');
  this.closeBtnLink = '.content-list-box-close';
  this.isUiInput = null;
  this.isUiSelect = null;
  this.isUiRadio = null;
  this.isUiCheckbox = null;
  this.isUiTextarea = null;
  this.uiDataName = null;
  this.uiSelectDataVal = null;
  this.uiRadioDataVal = null;
  this.uiCheckDataVal = [];
  this.dtText = null;
  this.inputVal = null;
  this.selectText = null;
  this.radioText = null;
  this.checkboxTextArray = [];
  this.checkboxText =  null;
  this.textareaVal = null;
  this.uiDataArray = [];
  this.uiInputAll = this.$ele.find('.ui-input input');
  this.uiTextareaAll = this.$ele.find('.ui-textarea textarea');
}
$.addContentList.prototype.initEvent = function() {
  this.$btnContentItemAdd.on('click', this.contentItemAdd.bind(this));
  this.$ele.on('click', this.closeBtnLink, this.contentItemRemove);
}
$.addContentList.prototype.initializeUi = function(){
  // initialie input, textarea
  // will add the other type
  this.uiInputAll.each(function(index,item){
    $(item).val("");
  })
  this.uiTextareaAll.each(function(index,item){
    $(item).val("");
  })
}
$.addContentList.prototype.contentItemAdd = function(){
  // validation check
  // required, maxbyte check
  const isRequired = () => {
    required('.ui-input[data-required]');
    required('.ui-select[data-required]');
    required('.ui-textarea[data-required]');
    maxbyte('.ui-input[data-maxbyte]')
    maxbyte('.ui-textarea[data-maxbyte]')
    const dataSelectorName = `[data-addContentList-target="${this.$ele.data('addcontentlistTarget')}"]`;
    validation(dataSelectorName + ' [data-validation]');
    var validationNew = $(dataSelectorName + ' [data-validation]').data('validation');

    validationNew.checkValidation();
    if(!validationNew.isValidation){
      alert('Check again!');
      const $unValidNode = validationNew.getUnValidItems();
      if($unValidNode) $unValidNode[0].$item.find(":first-child").focus();
      return 0;
    }
    return 1;
  }
  if(!isRequired()) return 0;
  // End required check

  const self = this;
  this.$contentItem = $(
    `<div class="content-item">
      <button type="button" class="content-list-box-close">
        <span class="sr-only">close</span>
      </button>
    </div>`
  );
  this.$showItemArray.each(function(index, item){
    self.isUiInput = Boolean($(item).find("[class*='ui-']").hasClass('ui-input'));
    self.isUiSelect = Boolean($(item).find("[class*='ui-']").hasClass('ui-select'));
    self.isUiRadio = Boolean($(item).find("[class*='ui-']").hasClass('ui-radio'));
    self.isUiCheckbox = Boolean($(item).find("[class*='ui-']").hasClass('ui-checkbox'));
    self.isUiTextarea = Boolean($(item).find("[class*='ui-']").hasClass('ui-textarea'));
    self.dtText = $(item).siblings('dt').text();
    self.inputVal = $(item).find('input').val();
    self.checkboxTextArray = [];
    self.uiCheckDataVal = [];
    self.uiDataName = $(item).siblings('dt').data('name');
    $(item).find('select option').each(function(index, item){
      if($(item).is(':selected')) {
        self.selectText = $(item).text();
        self.uiSelectDataVal = $(item).val();
      }
    })
    $(item).find('[type="radio"]').each(function(index, item){
      const $item = $(item);
      if($item.prop('checked')){
        self.radioText = $item.siblings('label').text();
        self.uiRadioDataVal = $(item).val();
      }
    })
    $(item).find('[type="checkbox"]').each(function(index, item){
      const $item = $(item);
      if($item.prop('checked')){
        self.checkboxTextArray.push($item.siblings('label').text())
        self.uiCheckDataVal.push($(item).val());
      }
    })
    self.checkboxText = self.checkboxTextArray.join(', ');
    self.textareaVal = $(item).find('textarea').val();
    const uiDataArray = [
      {isTrue:self.isUiInput, text:self.inputVal, dataName:self.uiDataName, dataValue:self.inputVal},
      {isTrue:self.isUiSelect, text:self.selectText, dataName:self.uiDataName, dataValue:self.uiSelectDataVal},
      {isTrue:self.isUiRadio, text:self.radioText, dataName:self.uiDataName, dataValue:self.uiRadioDataVal},
      {isTrue:self.isUiCheckbox, text:self.checkboxText, dataName:self.uiDataName, dataValue:self.uiCheckDataVal},
      {isTrue:self.isUiTextarea, text:self.textareaVal, dataName:self.uiDataName, dataValue:self.textareaVal}
    ];

    const createList = (uiDataArray) => {
      uiDataArray.forEach((item, i) => {
        if(item.isTrue){
          const $dl = $(
            `<dl>
              <dt>${self.dtText}</dt>
              <dd data-name="${item.dataName}" data-value="${item.dataValue || ''}">
                ${item.text}
              </dd>
            </dl>`
          )
          self.$contentItem.append($dl)
        }
      });
    }
    createList(uiDataArray);
  });
  this.$contentListBox.prepend(this.$contentItem);

  // initialize ui- component
  this.initializeUi();
}
$.addContentList.prototype.contentItemRemove = function(e){
  $(this).closest('.content-item').remove();
}
$.fn.addContentList = function(options) {
  return this.each(function() {
    if($(this).data('addContentList')) return;
    const instance = new $.addContentList($(this), options);
    $(this).data('addContentList', instance);
  })
}
