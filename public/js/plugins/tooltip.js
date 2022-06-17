/**********************************
********** tooltip **************
**********************************/
const tooltip = (selector, options) => {
  $(selector).tooltip(options);
}
$.tooltip = function($ele, options){
  this.$ele = $ele;
  this.isOpen = false;
  this.hoverFlag = false;
  this.eventNS = 'tooltip' + ($.tooltip.count++)
  this.contentWidth = this.$ele.data('width');
  this.evnettype = this.$ele.data('tooltipevent') || 'click';
  this.direction = this.$ele.data('direction') || 'top-left';
  this.position = this.$ele.data('position') || 'self';
  this.init(options);
}
$.tooltip.defaults = {
  eleClassSelector: '.ui-tooltip',
  delay: 600
}
$.tooltip.count = 0;
$.tooltip.prototype.init = function(settings){
  $.extend(this, {...settings});
  this.initElement();
  this.initEvent();
}
$.tooltip.prototype.initElement = function(){
  this.$ele.addClass(this.eventNS);
  this.$link = this.$ele.find('.btn-tooltip');
  this.link = '.btn-tooltip';
  this.linkWidth = this.$link.data('width');
  this.$contentbox = this.$ele.find('.tooltip-contentbox');
  this.contentbox = '.tooltip-contentbox';
}
$.tooltip.prototype.initEvent = function(){
  const self = this;

  this.$contentbox.width(this.contentWidth);
  this.$link.width(this.linkWidth);

  if(this.evnettype == 'click'){
    this.$ele.off(`click.${this.eventNS}`).on(`click.${this.eventNS}`, this.link, function(e){
      e.preventDefault();
      var $this = $(this);
      if(!self.isOpen) self.open();
      else self.close();
    });

    $(document).on(`click.${this.eventNS}`).on(`click.${this.eventNS}`, function(e){
      const isTooltip = self.$ele.has($(e.target)).length;
      if(!isTooltip) self.close();
    });

  } else if(this.evnettype == 'hover') {
    this.$ele.off(`mouseenter.${this.eventNS}`).on(`mouseenter.${this.eventNS}`, this.link, function(e){
      e.preventDefault();
      self.open();
    });

    this.$ele.off(`mouseleave.${this.eventNS}`).on(`mouseleave.${this.eventNS}`, function(e){
      e.preventDefault();
      setTimeout(()=> {
        if(self.hoverFlag) return
        self.hoverFlag = false;
        self.close();
      }, self.delay);
    });

    let tooltipcontent = `${self.eleClassSelector}.${self.eventNS} ${this.contentbox}`;
    if(this.position != 'self') tooltipcontent = `#${self.eventNS}content`;
    $('body').off(`mouseleave.${this.eventNS}`).on(`mouseleave.${this.eventNS}`, tooltipcontent, function(e){
      e.preventDefault();
      self.hoverFlag = false;
      self.close();
    });

    $('body').off(`mouseenter.${this.eventNS}`).on(`mouseenter.${this.eventNS}`, tooltipcontent, function(e){
      e.preventDefault();
      self.hoverFlag = true;
      self.open();
    });
  }
}
$.tooltip.prototype.calcuratePosition = function(){
  const direction = this.direction;
  let contentX = 0,
      contentY = 0
  const linkX = this.$link.children().offset().left,
      linkY = this.$link.children().offset().top,
      linkWidth = this.$link.children().outerWidth(),
      linkHeight = this.$link.children().outerHeight();

  this.$contentbox.show();
  const contentWidth = this.$contentbox.css({'display': 'inline-block'}).outerWidth(),
        contentHeight = this.$contentbox.css({'display': 'inline-block'}).outerHeight();
  const arrowSpacing = 8;
  this.$contentbox.hide();
  switch(direction){
    case 'top-center':
      contentX = linkX - contentWidth/2 + linkWidth/2;
      contentY = linkY - contentHeight - arrowSpacing;
      break;
    case 'top-right':
      contentX = linkX - contentWidth + linkWidth/2 + arrowSpacing*2;
      contentY = linkY - contentHeight - arrowSpacing;
      break;
    case 'bottom-left':
      contentX = linkX + linkWidth/2 - arrowSpacing*2;
      contentY = linkY + arrowSpacing + linkHeight;
      break;
    case 'bottom-center':
      contentX = linkX - contentWidth/2 + linkWidth/2;
      contentY = linkY + arrowSpacing + linkHeight;
      break;
    case 'bottom-right':
      contentX = linkX - contentWidth + linkWidth/2 + arrowSpacing*2;
      contentY = linkY + arrowSpacing + linkHeight;
      break;
    case 'left-top':
      contentX = linkX + linkWidth + arrowSpacing;
      contentY = linkY + linkHeight/2 - arrowSpacing*2;
      break;
    case 'left-middle':
      contentX = linkX + linkWidth + arrowSpacing;
      contentY = linkY + linkHeight/2 - contentHeight/2;
      break;
    case 'left-bottom':
      contentX = linkX + linkWidth + arrowSpacing;
      contentY = linkY - contentHeight + linkHeight/2 + arrowSpacing*2;
      break;
    case 'right-top':
      contentX = linkX - contentWidth - arrowSpacing;
      contentY = linkY + linkHeight/2 - arrowSpacing*2;
      break;
    case 'right-middle':
      contentX = linkX - contentWidth - arrowSpacing;
      contentY = linkY + linkHeight/2 - contentHeight/2;
      break;
    case 'right-bottom':
      contentX = linkX - contentWidth - arrowSpacing;
      contentY = linkY - contentHeight + linkHeight/2 + arrowSpacing*2;
      break;
    default: // 'top-left'
      contentX = linkX + linkWidth/2 - arrowSpacing*2;
      contentY = linkY - contentHeight - arrowSpacing;
      break;
  }
  return {
    x: contentX,
    y: contentY
  }
}
$.tooltip.prototype.open = function(selectedTab){
  this.isOpen = true;

  if(this.position == 'self') {
    this.$contentbox.show();
  }else{
    if($('#'+ this.eventNS + 'content').length) return;
    $(this.eleClassSelector).removeClass('on');
    $('body').children(this.contentbox).remove();
    const {x, y} = this.calcuratePosition();
    this.$contentbox.clone().attr('id', this.eventNS + 'content')
    .css({
      'display': 'inline-block',
      'position': 'absolute', 'left': 0, 'top': 0,
      'transform': `translate(${x}px, ${y}px)`
    })
    .appendTo($('body'));
  }

  this.$ele.addClass('on');;
}
$.tooltip.prototype.close = function(selectedTab){
  this.isOpen = false;

  if(this.position == 'self') {
    this.$contentbox.hide();
  }else{
    $('#'+ this.eventNS + 'content').remove();
  }

  this.$ele.removeClass('on');;
}
$.fn.tooltip = function(userOptions){
  return this.each(function(){
    if ($(this).data('tooltip')) return;
    const options = $.extend({}, $.tooltip.defaults, userOptions);
    const instance = new $.tooltip($(this), options);
    $(this).data('tooltip', instance);
  });
}
