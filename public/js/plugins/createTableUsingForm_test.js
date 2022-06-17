/**********************************
********** createTableUsingForm_test **************
**********************************/

// type
// input, select, checkbox, radio, textarea

const createTableUsingForm_test = (selector, options) => {
  $(selector).createTableUsingForm_test(options);
}

$.createTableUsingForm_test = function($ele, options){
  this.$ele = $ele;
  this.init(options);
}

$.createTableUsingForm_test.prototype.init = function(options){
  this.options = $.extend(true, {}, $.createTableUsingForm_test.default, options)
  this.initElement();
  this.initEvent();
}

$.createTableUsingForm_test.prototype.initElement = function() {
  this.$formGroup = this.$ele.find('.registration-group');
  this.$tableGroup = this.$ele.find('.registration-table-group');
  this.$tableTbody = this.$tableGroup.find('tbody');
  this.$addBtn = this.$formGroup.find('button[data-createTableUsingForm-addBtn]');
  this.dataArray = [];
  this.tr = this.options.tr;
}

$.createTableUsingForm_test.prototype.initEvent = function(){
  const self = this;

  // add button
  this.$addBtn.off('click.createTableUsingForm_test').on('click.createTableUsingForm_test', function(){
    // validation check
    // required, maxbyte check
    const validationChecker = () => {
      required('.ui-select[data-required]');
      required('.ui-input[data-required]');
      required('.ui-textarea[data-required]');
      maxbyte('.ui-input[data-maxbyte]')
      maxbyte('.ui-textarea[data-maxbyte]')

      const dataSelectorName = `[data-createTableUsingForm-target="${self.$ele.data('createtableusingformTarget')}"]`;
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
    if(!validationChecker()) return 0;
    // End validation check

    // Data initialization
    self.dataArray = [];

    self.$formGroup
      .find('[data-createTableUsingForm-value]')
      .each((index, item) => {
        const $type = $(item).find("div[class*='ui-']");
        const order = $(item).data('createtableusingformValue')

        const isSelect = $type.hasClass('ui-select');
        const isCheckbox = $type.hasClass('ui-checkbox');
        const isRadio = $type.hasClass('ui-radio');
        const isTextarea = $type.hasClass('ui-textarea');
        const isInput = $type.hasClass('ui-input');

        if(isSelect){
          $(item).find('[class*="ui-"]').find('select').each((index, item) => {
            const value = $(item).val();
            const text = $(item).find(`option[value=${value}]`).text()
            self.dataArray.push({order, text, value})
          })
        }else if(isCheckbox){
          $(item).find('[class*="ui-"]').find('input').each((index, item) => {
            let isStop = false;
            const isChecked = $(item).prop('checked');

            if(isChecked){
              let text = $(item).siblings('label').text();
              let value = $(item).val();

              self.dataArray.forEach((data, index) => {
                if(data.order == order){
                  text = self.dataArray[index].text.concat(`, ${text}`);
                  value = self.dataArray[index].value.concat(`, ${value}`);
                  self.dataArray.splice(index,1)
                  self.dataArray.push({order, text, value});
                  isStop = true;
                }
              })

              if(isStop){

              }else{
                self.dataArray.push({order, text, value})
              }

            }
          })
        }else if(isRadio){
          $(item).find('[class*="ui-"]').find('input').each((index, item) => {
            const isChecked = $(item).prop('checked');
            if(isChecked){
                const value = $(item).val();
                const text = $(item).siblings('label').text();
                self.dataArray.push({order, text, value})
            }
          })
        }else if(isTextarea){
          $(item).find('[class*="ui-"]').find('textarea').each((index, item) => {
            const value = $(item).val();
            const text = $(item).siblings('label').text();
            self.dataArray.push({order, text:value, value})
          })
        }else if(isInput){
          $(item).find('[class*="ui-"]').find('input').each((index, item) => {
            const value = $(item).val();
            const text = $(item).siblings('label').text();
            self.dataArray.push({order, text:value, value})
          })
        }

      })

    // create table
    self.createTable(self.dataArray);
  });
}

$.createTableUsingForm_test.prototype.createTable = function(dataArray){

  this.$tableTbody.prepend(this.tr)

  // binding data
  this.bindingData();

  // delete button event
  this.deleteTable();
}

$.createTableUsingForm_test.prototype.bindingData = function(){
  const $tr = this.$tableTbody.find('tr:first-child');
  const $td = $tr.find('td');
  const tdLength = $td.length;
  const dataArray = this.dataArray;

  $td.each((td_index, item) => {
    const $span = $(item).find('span');
    let order = null;
    let text = null;
    let value = null;

    dataArray.forEach((item, dA_index) => {
      if(td_index == item.order){
        order = item.order;
        text = item.text;
        value = item.value;
      }
    })

    if(order != null){
      $(item).attr('data-value', value)

      if($span.length){
        $span.text(text);
      }else{
        $(item).text(text);
      }
    }

  })
}

$.createTableUsingForm_test.prototype.deleteTable = function(){
  const $deleteBtn = this.$tableTbody.find('[data-delete-btn]:first');
  $deleteBtn.on('click', function(){
    $(this).closest('tr').remove()
  });
}

$.fn.createTableUsingForm_test = function(options){
  return this.each(function(){
    if($(this).data('createTableUsingForm_test')) return;
    const instance = new $.createTableUsingForm_test($(this), options);
    $(this).data('createTableUsingForm_test', instance);
  });
}
