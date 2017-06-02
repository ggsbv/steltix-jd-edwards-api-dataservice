"use strict";

function renderHbrs(dataToRender, outputElem, source){
  var template = Handlebars.compile(source);
  outputElem.innerHTML = template(dataToRender);
};
