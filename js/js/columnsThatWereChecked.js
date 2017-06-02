"use strict";

function columnsThatWereChecked(itemData, checkedColumns){

  if(Object.keys(checkedColumns).length === 0){
    return itemData;
  } else {
    let dataToRender = [];
    itemData.forEach((item) => {
      let columnsToRender = {};
      for(let currentColumn in item){
        if(checkedColumns[currentColumn] || currentColumn === "F4101_PRP7"){
          columnsToRender[currentColumn] = item[currentColumn];
        };
      };
      dataToRender.push(columnsToRender);
    })
    return dataToRender;
  };
};
