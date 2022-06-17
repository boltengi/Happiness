/**********************************
********** createTableUsingForm **************
**********************************/
const createTableUsingForm = (selector, options) => {
  $(selector).createTableUsingForm(options);
}

$.createTableUsingForm = function($ele, options){
  this.$ele = $ele;
  this.init();
}

$.createTableUsingForm.prototype.init = function(options){
  this.options = $.extend(true, {}, $.createTableUsingForm.default, options)
  this.initElement();
  this.initEvent();
}

$.createTableUsingForm.prototype.initElement = function() {
  this.$eleFormGroup = this.$ele.find('.registration-group');
  this.$eleTableGroup = this.$ele.find('.registration-table-group');
  this.$eleTableTbody = this.$eleTableGroup.find('tbody');
  this.$eleAddBtn = this.$eleFormGroup.find('button[data-add]');
  this.dataArray = [];
}

$.createTableUsingForm.prototype.initEvent = function(){
  const self = this;

  // add button
  this.$eleAddBtn.off('click.createTableUsingForm').on('click.createTableUsingForm', function(){
    // Data initialization
    self.dataArray = [];

    self.$eleFormGroup.find('input').each((index, item)=>{ self.dataArray.push(item.value) });
    // create table
    self.createTable(self.dataArray);
  });
}

$.createTableUsingForm.prototype.createTable = function(dataArray){
  this.$eleTableTbody.prepend(`
    <tr>
      <td><span class="ellipsis">${dataArray[0]}</span></td>
      <td><span class="ellipsis">${dataArray[1]}</span></td>
      <td><span class="ellipsis">${dataArray[2]}</span></td>
      <td><span class="ellipsis"></span></td>
      <td class="cell-center">
        <button type="button" class="btn btn-normal point-style" data-delete-btn>Delete</button>
      </td>
    </tr>
  `)

  // delete button event
  this.deleteTable();
}

$.createTableUsingForm.prototype.deleteTable = function(){
  const $deleteBtn = this.$eleTableTbody.find('[data-delete-btn]:first');
  $deleteBtn.on('click', function(){
    $(this).closest('tr').remove()
  });
}

$.fn.createTableUsingForm = function(options){
  return this.each(function(){
    if($(this).data('createTableUsingForm')) return;
    const instance = new $.createTableUsingForm($(this), options);
    $(this).data('createTableUsingForm', instance);
  });
}
