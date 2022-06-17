/**********************************
********** format **************
**********************************/
const format = (function(){
  const numComma = function(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return {
    numComma: numComma
  }
})();
