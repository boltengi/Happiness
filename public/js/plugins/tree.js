/**********************************
********** tree **************
**********************************/
const tree = (selector, options) => {
  $(selector).tree(options);
}
$.tree = function($ele, options){
  this.$ele = $ele;
  this.$eleTree = $ele.find('.tree');
  this.setting = $.extend(true, {}, $.tree.default, options);
  this.eventNS = 'tree' + ($.tree.count++)
  this.isSingle = $ele.data('single');
  this.init();
}
$.tree.count = 0;
$.tree.default = {
  optionFolderName: [],
  initCheckedItems: [],
  initClosedItems: [],
  data: [],
  initCheckedDataIDs : [],
  uniqueSensorName: 'sensor_id',
  checkCallback: function(){},
  selectedItem: null,
  selectCallback: function(){},
  textField: {
    file: 'text',
    folder: 'text'
  },

  render: {
    treeList: function(state = {}){
      return `<ul class="tree-list" style="${!state.opened ? 'display: none; ': ''}"></ul>`;
    },
    treeItemLi: function(element){
      const id = element.type  == 'folder' ? element.gid : element.sid;
      const dataID = element.type  == 'folder' ? 'tree-g-' + element.gid : 'tree-s-' + element.sid;
      const checkid = element.type  == 'folder' ? 'g' + element.gid : 's' + element.sid;

      // optionalFolderNmae Setting
      let optionFolderNameArray = [];
      for(let item in element){
        this.setting.optionFolderName.forEach(function(name){
          if(item == name) optionFolderNameArray.push(element[name]);
        })
      }
      let optionFolderName = optionFolderNameArray.join(', ');

      const getTextField = (element) => {
        const settingTextFeild = this.setting.textField;
        let textField = element['text'];
        if(typeof settingTextFeild[element.type] == 'string'){
          textField = element[settingTextFeild[element.type]];
        }else if(typeof settingTextFeild[element.type] == 'function'){
          textField = settingTextFeild[element.type](element);
        }else if(Array.isArray(settingTextFeild[element.type])){
          let optionFolderNameArray = [];
          settingTextFeild[element.type].slice(1).forEach(function(name){
            if(element[name]) optionFolderNameArray.push(element[name]);
          });
          let optionFolderName = optionFolderNameArray.join(', ');
          textField = `${element[settingTextFeild[element.type][0]]}(${optionFolderName})`;
        }
        return textField;
      }
      return `<li>
        <div
          class="tree-item
            ${element.state.opened ? 'on' : ''}
            ${element.state.checked ? 'checked' : ''}
            ${element.state.selected ? 'selected': ''}
            ${element.type  == 'folder' ? 'tree-type' : 'sensor-type'}
            ${element.parent  == '#' ? 'tree-root' : ''}"
          id="${this.eventNS}-${id}"
          ${element.type == 'folder' ? '' : `data-sid="${element.sid}" data-${this.setting.uniqueSensorName}="${element[this.setting.uniqueSensorName]}"`}
          data-id="${dataID}"
        >
          <div class="tree-ele">
            ${!this.isSingle ? `<span class="tree-checkbox">
              <input type="checkbox" name="checkbox${this.eventNS}${checkid}" id="checkbox${this.eventNS}${checkid}" ${element.state.checked ? " checked": null}>
              <label for="checkbox${this.eventNS}${checkid}"><span class="sr-only"></span></label>
            </span>` : ''}
            <span class="item-text">
              ${element.parent !== 'root' ? `<span class="icon ${element.type  == 'folder' ? 'icon-tree' : 'icon-sensor'} icon-sm"></span>`: ''}
              ${getTextField(element)}
            </span>
            ${element.type  == 'folder' ? '<button type="button" class="tree-btn-accordion on"></button>' : ''}
          </div>
        </div>
      </li>`;
    }
  }
}
// $.tree.createTreeObj = function(){
//   // 1.
//   // group list 를 depth 개녑 없이 만들고
//   // 해당 group 을 parent로 가지고 있는 sensor 를 chlidren으로 밀어 넣기
//   const treeFolder = {}
//   treeData.forEach(item=>{
//     console.log(item.parent)
//     if(item.type == 'folder'){
//       treeFolder[item.gid] = {...item, children:[]}
//     }
//   })
//   console.log(treeFolder)
//
//   treeData.forEach(item=>{
//     if(item.type == 'file'){
//       console.log(item.type)
//       treeFolder[item.parent].children.push(item)
//     }
//   })
//   console.log(treeFolder)
// }
// $.tree.createTreeObj = function(){
//   // 2.
//   // group list의 depth 개념 적용한 obj 만들기
//   const treeObj = {}
//   const createTreeFolder = (item) => {
//     return {
//       id : item.gid,
//       gid : item.gid,
//       parent : item.parent,
//       text : item.text,
//       type : item.type,
//       children : []
//     }
//   }
//   const createTravel = (dataObj, item) => {
//     console.log('createTravel', dataObj, item)
//     if(dataObj.gid == item.parent){
//       dataObj.children.push(createTreeFolder(item))
//     }else{
//       for(let i = 0; i<dataObj.children.length; i++){
//         createTravel(dataObj.children[i],item)
//       }
//     }
//   }
//   treeData.forEach(item=>{
//     console.log(item.parent)
//     if(item.type == 'folder'){
//       if (item.parent == '#') {
//         treeObj.id = item.gid
//         treeObj.gid = item.gid
//         treeObj.parent = item.parent
//         treeObj.text = item.text
//         treeObj.type = item.type
//         treeObj.children = []
//       }
//       createTravel(treeObj, item);
//     }
//   })
//   console.log('treeObj', treeObj);
// }
$.tree.createTreeObj = function(treeData){
  // group + sensor 의 depth 개념 적용한 obj 만들기
  const self = this;
  let treeObj = {'#': {id: '#', parent: null, children: {}, state: {checked: false, selected: false, opened: true}}}
  const createTreeItemObj = (k, item) => {
    const id = k;
    const isChecked = (item.state && item.state.checked) != undefined ? item.state.checked
                      : this.setting && this.setting.initCheckedDataIDs.findIndex((i)=> {
                        return i == (item.type == 'folder' ? 'tree-g-' + item.gid : 'tree-s-' + item.sid);
                      }) > -1;

    const isSelected = (item.state && item.state.selected) != undefined ? item.state.selected
                      : (this.isSingle && this.setting.selectedItem) && item[this.setting.selectedItem.type] == this.setting.selectedItem.value;
    const isOpen = (item.state && item.state.opened) != undefined ? item.state.opened : true;

    return Object.assign({}, item, {children: {}, id: id, state: {checked: isChecked, selected: isSelected, opened: isOpen}});
  }

  const obj = {
    '#': {id: '#', children: {}, state: {}}
  }
  treeData.forEach(element=>{
    const idType = element.type == 'folder' ? 'gid' : element.type == 'file' ? 'sid' : 'aid';
    const id = `${idType.replace('id','')}${element[idType]}`

    obj[id] = element;
    obj[id].id = id;
  });

  function getChildren(parent, children){
    let _parent;
    if(!parent) return _parent;
    if(parent == '#') return children;

    parent = 'g' + parent
    if(children.indexOf(parent) == -1) children.unshift(parent);
    return getChildren(obj[parent].parent, children)
  }

  Object.entries(obj).forEach(([k, v])=>{
    let parent = v.parent
    if(!parent) return;
    let children = getChildren(parent, []);
    let parentObj = treeObj['#'];
    children.forEach((element, index, array)=>{
      if(!parentObj.children[element]) parentObj.children[element] = createTreeItemObj(element, obj[element]);
      parentObj = parentObj.children[element];
    });
    if(!parentObj.children[k]) parentObj.children[k] = createTreeItemObj(k, v)
  });

  function allStateCheck(element){
    Object.entries(element.children).forEach(([key, _element]) => {
      if(element.state.checked) _element.state.checked = true;
      allStateCheck(_element);
    });
  }

  function eachStateCheck(element){
    function checkIsCheck(element){
      const parent = element;
      if(Object.keys(parent.children).length && Object.keys(parent.children).length == Object.entries(parent.children).filter(([key, _element]) => _element.state.checked).length){
        parent.state.checked = true;
      }
      if(Object.keys(parent.children).length != Object.entries(parent.children).filter(([key, _element]) => _element.state.checked).length){
        parent.state.checked = false;
      }
    }

    Object.entries(element.children).forEach(([key, _element]) => {
      eachStateCheck(_element);
    });
    checkIsCheck(element);
  }

  allStateCheck(treeObj['#'].children['g1']);
  eachStateCheck(treeObj['#'].children['g1']);

  return treeObj['#'].children['g1'];
}
$.tree.createTreeModel = function(treeData){
  console.time('createTreeModel');
  const obj = {
    '#': {id: 'root', children:[], parent: null, state: {opened: true, checked: false, selected: false}}
  };
  treeData.forEach(element=>{
    const idType = element.type == 'folder' ? 'gid' : element.type == 'file' ? 'sid' : 'aid';
    const id = `${idType.replace('id','')}${element[idType]}`

    obj[id] = element;
    obj[id].id = id;
    obj[id].children = [];
    obj[id].state = {opened: true, checked: false, selected: false};
  });
  Object.entries(obj).forEach(([k,v])=>{
    if(obj['g' + v.parent]) obj['g' + v.parent].children.push(k);
  });
  console.timeEnd('createTreeModel');
  return obj;
}
$.tree.travelTree = function(treeObj, matchingData, item){
  if(item) return item;
  if(treeObj[matchingData.type] == matchingData.value) item = treeObj;
  Object.entries(treeObj.children).forEach(function([key, element], index){
    item = $.tree.travelTree(element, matchingData, item);
  });
  return item;
}
$.tree.findTreeFolder = function(treeObj,gid){
  return $.tree.travelTree(treeObj, {type:'gid', value: gid});
}
$.tree.createGroupSensorObj = function(treeData){
    // 1.
    // group list 를 depth 개녑 없이 만들고
    // 해당 group 을 parent로 가지고 있는 sensor 를 chlidren으로 밀어 넣기
    const treeFolder = {}
    treeData.forEach(item=>{
      if(item.type == 'folder'){
        treeFolder[item.gid] = {...item, children:[]}
      }
    })

    treeData.forEach(item=>{
      if(item.type == 'file'){
        treeFolder[item.parent].children.push(item)
      }
    })

    return treeFolder;
}
$.tree.prototype.init = function(){
  this.createTreeElement();
  this.initElement();
  this.initEvent();
}
$.tree.prototype.setItemState = function(item, state){
  item.state = {...item.state, ...state};
  return state
}
$.tree.prototype.createTreeElement = function(){
  const self = this;
  if(!self.setting.data) return false;

  if (!this.rdata) this.rdata = $.tree.createTreeObj.call(this, self.setting.data);
  if (this.rdata.parent === '#') this.rdata.parent = 'root';

  function htmlToElement(htmlString){
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    return template.content.firstChild;
  }

  function travelData(data, $parent){
    if(!Object.keys(data.children).length) return;
    const ul = htmlToElement(self.setting.render.treeList.call(self, data.state));
    $parent[0].appendChild(ul);
    Object.entries(data.children).forEach(function([key, element], i){
      element.$dom = $(htmlToElement(createNode(element)));
      ul.appendChild(element.$dom[0]);
      travelData(element, element.$dom);
    });
  }

  self.$eleTree.find('>.tree-list').remove();

  const ul = htmlToElement(self.setting.render.treeList.call(self, this.rdata.state));
  this.rdata.$dom = $(htmlToElement(createNode(this.rdata)));
  this.$eleTree[0].appendChild(ul);
  ul.appendChild(this.rdata.$dom[0]);

  travelData(this.rdata, this.rdata.$dom);

  this.setting.initCheckedItems.forEach(function(element){
    const item = $.tree.travelTree(self.rdata, {type: element.type, value: element.value});
    if(!item) return console.error(element, ` of initCheckedItems no exist`);
    item.state.checked = true;
    item.$dom.find('> .tree-item .tree-checkbox input').prop('checked', true);
    self.applyCheck(item);
    self.allCheck(item, true);
    self.eachCheck(item);
  });

  this.setting.initClosedItems.forEach(function(element){
    const item = $.tree.travelTree(self.rdata, {type: element.type, value: element.value});
    if(!item) return console.error(element, ` of initClosedItems no exist`);
    item.state.opened = false;
    item.$dom.find('>.tree-item').removeClass('on');
    item.$dom.find('>.tree-list').hide();
  });

  function createNode(element){
    return self.setting.render.treeItemLi.call(self, element);
  }

}
$.tree.prototype.createTreeModelElement = function(){
  console.time('createTreeModelElement');
  const self = this;
  if(!self.mdata) self.mdata = $.tree.createTreeModel.call(this, self.setting.data);;
  let $ul = $('<ul class="tree-list"></ul>');
  self.$eleTree.append($ul);

  function createNode(element){
    return self.setting.render.treeItemLi.call(self, element)
  }
  Object.entries(self.mdata).forEach(function([key, element], index){
    if(element.id == '#') return;
    if (element.parent == '#') element.parent = 'root';
    if(!self.$ele.find('#' + self.eventNS + '-' + element.parent + '.tree-type').length){
      let html = $(createNode(element));
      $ul.append(html);
    }else{
      const $parent = self.$ele.find('#' + self.eventNS + '-' + element.parent + '.tree-type');
      if(!$parent.parent('li').find('ul').length) $parent.parent('li').append(self.setting.render.treeList.call(self, element.state));
      let html = $(createNode(element));
      $parent.next('ul').append(html);
    }
  });
  console.timeEnd('createTreeModelElement');
}
$.tree.prototype.initElement = function(){
  this.btnTreeAll = '.btn-tree-all';
  this.treeBtnAccordion = '.tree-btn-accordion';
  this.searchInput = '.tree-search input';
  this.searchBtn = '.tree-search .btn-search';
  this.$btnTreeAll = this.$ele.find('.btn-tree-all');
  this.$searchInput = this.$ele.find('.tree-search input');
  this.$searchBtn = this.$ele.find('.tree-search .btn-search');
}
$.tree.prototype.initEvent = function(){
  !this.isSingle && this.initAllCheckEvent();
  !this.isSingle && this.initCheckCallbackEvent();
  this.initAccordion();
  this.initSearch();
  this.isSingle && this.selectItem();
  this.isSingle && this.initSelectCallbackEvent();
}
$.tree.prototype.applyCheck = function (item){
  const $input = item.$dom.find('> .tree-item .tree-checkbox input');
  if($input.is(':checked')) $input.closest('.tree-item').addClass('checked');
  else $input.closest('.tree-item').removeClass('checked');
}

$.tree.prototype.allCheck = function (item, isChecked){
  const self = this;
  item.state.checked = isChecked;
  Object.entries(item.children).forEach(function([key, element]){
    const $input = element.$dom.find('> .tree-item .tree-checkbox input');
    element.state.checked = isChecked;
    $input.prop('checked', isChecked);

    self.applyCheck(element);
    self.allCheck(element, element.state.checked);
  });
}

$.tree.prototype.eachCheck = function (item){
  const self = this;
  if(item.parent === 'root') return;
  const parent = $.tree.travelTree(self.rdata, {type:'gid', value: `${item.parent}`});
  const $parentInput = parent.$dom.find('> .tree-item .tree-checkbox input');

  if(Object.keys(parent.children).length == Object.entries(parent.children).filter(([key, element])=>element.state.checked).length){
    parent.state.checked = true;
    $parentInput.prop('checked', true);
  }else{
    parent.state.checked = false;
    $parentInput.prop('checked', false);
  }

  self.applyCheck(parent);
  self.eachCheck(parent);
}
$.tree.prototype.initAllCheckEvent = function(){
  const self = this;

  this.$ele.on('click.triggerchecked', '.item-text', function(){
    const $treeItem = $(this).closest('.tree-item');
    if(!$treeItem.hasClass('checked')) $treeItem.addClass('checked').find('input').prop('checked', true);
    else $treeItem.removeClass('checked').find('input').prop('checked', false);
    $(this).closest('.tree-item').find('input').trigger('change');
  });

  this.$ele.on('change.allCheck', '.tree-checkbox input', function(){
    const $this = $(this);
    const isChecked = $this.is(':checked');
    const id = $this.closest('.tree-item').data('id').replace('tree-','').replace('-','');

    const item = $.tree.travelTree(self.rdata, {type:'id', value: id});

    self.applyCheck(item);
    self.allCheck(item, isChecked);
    self.eachCheck(item);
  });
}
$.tree.prototype.initCheckCallbackEvent = function(){
  const self = this;
  this.$ele.on('change.check', '.tree-checkbox input', function(){
    const uniqueSensorName = self.setting.uniqueSensorName;
    const checkedIds = {sid: []}
    checkedIds[uniqueSensorName] = [];

    checkedIds.sid = $.map(self.$ele.find('.tree-item.sensor-type input:checked'), function(element){
      return $(element).closest('.tree-item').data('sid');
    });
    checkedIds[uniqueSensorName] = $.map(self.$ele.find('.tree-item.sensor-type input:checked'), function(element){
      return $(element).closest('.tree-item').data(uniqueSensorName);
    });
    const checkedId = {
      sid: $(this).closest('.tree-item.sensor-type').data('sid')
    };
    checkedId[uniqueSensorName] = $(this).closest('.tree-item.sensor-type').data(uniqueSensorName);
    const dataIDs = $.map(self.$ele.find('.tree-item.checked'), function(element){
      return $(element).data('id');
    });

    self.setting.checkCallback({checkedIds:checkedIds, dataIDs: dataIDs, checkedId: $(this).is(':checked') ? checkedId : undefined});
  });
}
$.tree.prototype.openAccordion = function(item){
  item.$dom.find('>.tree-item').addClass('on');
  item.$dom.find('>.tree-list').slideDown();
}
$.tree.prototype.closeAccordion = function(item){
  item.$dom.find('>.tree-item').removeClass('on');
  item.$dom.find('>.tree-list').slideUp();
}
$.tree.prototype.initAccordion = function(){
  const self = this;
  self.$eleTree.on('click.tree', this.btnTreeAll, function(){
    if(!$(this).hasClass('on')) {
      $(this).addClass('on');

      self.setItemState(self.rdata, {opened: false});
      self.closeAccordion(self.rdata);
    } else {
      $(this).removeClass('on');
      
      self.setItemState(self.rdata, {opened: true});
      self.openAccordion(self.rdata);
    }
  });
  this.$ele.on('click.tree', this.treeBtnAccordion, function(){
    const $treeItem = $(this).closest('.tree-item');
    const type = 'id';
    const id = $treeItem.data('id').replace('tree-','').replace('-','');

    const item = $.tree.travelTree(self.rdata, {type, value: id});

    if(!item.state.opened) {
      self.setItemState(item, {opened: true});
      self.openAccordion(item);

      if(item.gid == 1) self.$ele.find(self.btnTreeAll).removeClass('on');
    } else {
      self.setItemState(item, {opened: false});
      self.closeAccordion(item);

      if(item.gid == 1) self.$ele.find(self.btnTreeAll).addClass('on');
    }
  });
}
$.tree.prototype.searchResult = function(value){
  const self = this;
  if (value == '') self.$eleTree.find('.tree-item').show();
  let count = 0;
  self.$eleTree.find('.tree-item').each(function(){
    const text = $.trim($(this).find('.item-text').text());
    if( text.indexOf(value) != -1 ) {
      count++;
      $(this).show();
    } else {
      $(this).hide()
    };
    if(count == 0 ){
      self.$ele.find('.tree-empty').show();
    }else{
      self.$ele.find('.tree-empty').hide();
    }
  });
}
$.tree.prototype.initSearch = function(){
  const self = this;
  self.$searchBtn.on('click', function(e){
    const value = self.$searchInput.val();
    self.searchResult(value);
  });
}
$.tree.prototype.selectItem = function(){
  const self = this;
  this.$ele.on('click', '.tree-item.sensor-type', function(){
    self.$ele.find('.tree-item').removeClass('selected');
    $(this).addClass('selected');
  });
}
$.tree.prototype.initSelectCallbackEvent = function(){
  const self = this;
  this.$ele.on('click', '.tree-item.sensor-type', function(){
    const checkedId = $(this).closest('.tree-item').data('sid');
    const sensorCheckedId = $(this).closest('.tree-item').data('sensor_id');
    self.setting.selectCallback({checkedId: {sid: checkedId, sensor_id: sensorCheckedId}});
  });
}
$.fn.tree = function(options){
  return this.each(function(){
    if($(this).data('tree')) return;
    const instance = new $.tree($(this), options);
    $(this).data('tree', instance);
  });
}
