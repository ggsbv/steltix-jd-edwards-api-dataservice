"use strict";

function findUniqueClasses(data){
  var classList = {};

  data.forEach(function(item){
    let currentClass = item.F4101_PRP7;
    if(!classList[currentClass] && currentClass.trim("") !== ""){
      classList[currentClass] = 1;
    };
  });

  return Object.keys(classList);
};
