/**********************************
********** siebar **************
**********************************/
const sidebar = (options) => {
  $('#sidebar .menu').sidebar(options);
}
$.sidebar = function($ele, options){
  this.$ele = $ele;
  this.init(options);
}
$.sidebar.prototype.init = function(options){
  const $sidebar = this.$ele,
      $navbar = $sidebar.children('ul'),
      $depth1 = $navbar.children('li');
  const depth = options.depth;
  const menu = options.menu;

  if (depth) {
    this.hierarchy = {depth: depth};
  } else if (menu) {
    this.hierarchy = {menu: menu};
  }
  this.setActive($depth1);
};
$.sidebar.prototype.setActive = function ($depth1) {
  const self = this;
  let hierarchyIndex = 0;
  function detphtree($depthN) {
    $depthN.each(function (index, item) {
      const $eachDepthN = $(this),
          $eachLink = $eachDepthN.children('a'),
          $eachContent = $eachLink.next('ul');

      let condition = false;
      if (!self.hierarchy) return;
      if (self.hierarchy.depth) {
        condition = index == self.hierarchy.depth['depth' + (hierarchyIndex + 1)];
      } else if (self.hierarchy.menu) {
        condition = $eachLink.data('menu') == self.hierarchy.menu[hierarchyIndex];
      }

      if (condition) {
        hierarchyIndex++;
        $eachLink.addClass('on');
        if ($eachContent.length) {
          const $depthN = $eachContent.children('li')
          detphtree($depthN);
        }
        return false;
      }
    });
  }
  detphtree($depth1);
}
$.fn.sidebar = function (options) {
  return this.each(function () {
    if ($(this).data('sidebar')) {
      return;
    }
    const instance = new $.sidebar($(this), options);
    $(this).data('sidebar', instance);
  });
}
