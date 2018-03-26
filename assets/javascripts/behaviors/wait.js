'use strict';
LB.Wait = function(stats){
  var _createdWidget = $(crel('div')).addClass('wait dayPlanner active col-12');

  var checkStatus = function(){
    LB.Backend.getStats(function(data){
      if(data.day_status == 'wait'){
        setTimeout(function() {
          checkStatus();
        }, 5000);
      }
      else
        LB.paintScreen();
    });
  }

  setTimeout(function() {
    checkStatus();
  }, 5000);

  return {
    render: function(){
      return _createdWidget;
    }
  }
}
