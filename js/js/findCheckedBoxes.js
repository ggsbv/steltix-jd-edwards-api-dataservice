"use strict";

function findCheckedBoxes(checkboxList){
  var checkedBoxes = {};

  checkboxList.forEach((currentCheckbox) => {
    if(currentCheckbox.checked){
      checkedBoxes[currentCheckbox.value] = true;
    }
  });
  return checkedBoxes;
};
