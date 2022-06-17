/**********************************
********** layout **************
**********************************/
const layout = () => {
  const $doc = $(document);
  const $win = $(window);
  const $wrapper = $('#wrapper');
  if (!$wrapper.length) return;

  function setHeight(){
    const docH = $doc.height();
    const winH = $win.height();
    const height = docH > winH ? docH : winH;
    $wrapper.css({'min-height':height + 'px'});
  }

  setHeight();
  $(window).resize(function(){
    setHeight();
  });
}
