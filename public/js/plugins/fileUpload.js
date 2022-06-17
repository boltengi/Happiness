/**********************************
********** fileUpload **************
**********************************/
const fileUpload = (selector , options) => {
  $(selector).fileUpload(options);
}
$.fileUpload = function($ele, options) {
  this.$ele = $ele;
  this.initElement();
  this.initEvent();
  if(this.$ele.data('fileinfo')){
    this.initFileInfo(this.$ele.data('fileinfo'));
  }
}

$.fileUpload.prototype.initFileInfo = function(fileInfo) {
  const fileInfoBox = $('<div class="file-info-box"></div>');
  const {download:{isTrue:IsDownload=false, link="", text:donwloadText=""}={}} = fileInfo;
  const {showInfo:{isTrue:IsShowInfo=false, total=0, success=0, error=0, text:showInfoText=""}={}} = fileInfo;
  if(IsDownload) {
    const aEle = `<a href="${link}" class="file-download">${donwloadText}</a>`;
    fileInfoBox.append(aEle);
  }
  if(IsShowInfo) {
    const fileInfo =  $('<div class="file-info"></div>');
    fileInfo.append(
    `<dl>
      <dt>${showInfoText}</dt>
      <dd>${total}</dd>
      <dt class="success-status">Success</dt>
      <dd class="success-status">${success}</dd>
      <dt class="fail-status">Error</dt>
      <dd class="fail-status">${error}</dd>
    </dl>`);
    fileInfoBox.append(fileInfo);
  }
  this.$ele.append(fileInfoBox);
}
$.fileUpload.prototype.initElement = function() {
  this.$btnUpload = this.$ele.find('.file-upload');
  this.$inputFile = this.$ele.find('input[type="file"]');
  this.link = 'input[type="file"]';
}
$.fileUpload.prototype.initEvent = function() {
  const self = this;
  this.$ele.on('change.fileUpload', this.link, function(){
    self.upload();
  });
}
$.fileUpload.prototype.upload = function() {
  const $fileInput = this.$inputFile;
  const fileInputText = $fileInput.val();
  const $fileName = this.$ele.find('.file-name');
  const fileName = fileInputText.substring(fileInputText.lastIndexOf('\\') + 1);
  if(fileName){
    $fileName.addClass('on');
  }else{
    $fileName.removeClass('on');
  }
  $fileName.text(fileName);
}
$.fn.fileUpload = function(options) {
  return this.each(function() {
    if($(this).data('fileUpload')) return;
    const instance = new $.fileUpload($(this), options);
    $(this).data('fileUpload', instance);
  })
}
