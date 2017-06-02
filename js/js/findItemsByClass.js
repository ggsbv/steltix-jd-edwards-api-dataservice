"use strict";

function findItemsByClass(data, requestedClass){
  var itemsFromSportClass = [];

  for(let i = 0; i < data.length; i++){
    var currentItem = data[i];

    if(requestedClass === "ALL" || currentItem.F4101_PRP7 === requestedClass){
      itemsFromSportClass.push(currentItem);
    };
  };
  return itemsFromSportClass;
};
