'use strict';

LB.DefaultEvent = function(stats){
  var _createdWidget = $(crel('div')).addClass('dayPlanner col-12');
  var _OKButton = LB.Widgets.OKButton();

  _createdWidget.append(_OKButton.render());

  return {
    render: function(){
      return _createdWidget;
    }
  }
}
