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

function findCheckedBoxes(checkboxList){
  var checkedBoxes = {};

  checkboxList.forEach((currentCheckbox) => {
    if(currentCheckbox.checked){
      checkedBoxes[currentCheckbox.value] = true;
    }
  });
  return checkedBoxes;
};

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

function renderHbrs(dataToRender, outputElem, source){
  var template = Handlebars.compile(source);
  outputElem.innerHTML = template(dataToRender);
};

$(document).ready(function () { // wait for document to be ready

  var req = {}; // empty object to hold our http request
  req.deviceName = 'bestCodexTeam'; // <<---- here change to a unique name
  req.username = "demo";
  req.password = "demo";

  // authenticate with the system by getting a token
  $.ajax({
    url: "http://demo.steltix.com/jderest/tokenrequest", // <<- JD Edwards API token service
    type: 'post', // <<- the method that we using
    data: JSON.stringify(req), // <<- JSON of our request obj
    contentType: 'application/json', // <<- telling server how we are going to communicate
    fail: function (xhr, textStatus, errorThrown) {

      console.log(errorThrown, textStatus, xhr) //  <<- log any http errors to the console

    }
  }).done(function (data, textStatus, xhr) {

    if (data.hasOwnProperty('userInfo')) {  // <<- see example response below

      var token = data.userInfo.token;

      // build a request obj to fetch data
      var reqData = {
        "deviceName" : "bestCodexTeam",
        "targetName" : "F4101",
        "targetType" : "table",
        "outputType":"GRID_DATA",
        "dataServiceType" : "BROWSE",
        "maxPageSize" : "100",
        "query" : {
          "autoFind" : true,
          "condition" : []
        }
      }


      reqData.token = token;  // <<- add our token from 1st request

      $.ajax({
        url: "http://demo.steltix.com/jderest/dataservice", // <<- can also try http://demo.steltix.com/jderest/formservice with example request object below"
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(reqData)
      }).done(function (data) {

        var rowset = data.fs_DATABROWSE_F4101.data.gridData.rowset;

        //select the element where the handlebars template will be output
        var ddDataOutputElem = document.querySelector("#ddClassSelect");

        //select the handlebars template source
        var ddListSrc = document.querySelector("#ddList").innerHTML;

        //find all unique classes in the data from the API
        const uniqueClasses = findUniqueClasses(rowset);
        var ddData = {
          option : uniqueClasses
        }
        //populate our dropdown list with all unique classes
        renderHbrs(ddData, ddDataOutputElem, ddListSrc);

        const submitButton = document.querySelector("#submitButton");

        //when submit button is clicked
        submitButton.addEventListener("click", (event) => {
          //select the <select> element
          const selectElem = document.querySelector("#selectClass");
          //get the value of the option that was selected
          const selectedClass = selectElem.value;

          //select the checkbox elements
          const checkboxList = document.querySelectorAll(".checkboxCell");
          //get the value of all the checked checkboxed
          const checkedBoxes = findCheckedBoxes(checkboxList);

          //select the element where the table containing the results will be
          //displayed
          var resultsElem = document.querySelector('.results');  // <<- handle for results
          //select the handlebars template
          var resultsTableSrc = document.querySelector("#outputTemplate").innerHTML;
          //find all items in the API data that match the selected class
          var resultsTableData = findItemsByClass(rowset, selectedClass);

          //reshape data so that only the columns that were checked are rendered
          var results = columnsThatWereChecked(resultsTableData, checkedBoxes);

          var tableData = {
            item : results
          }

          //display the results
          renderHbrs(tableData, resultsElem, resultsTableSrc);
        })
        })
      }
    })
  })



    // resultsElem.textContent = JSON.stringify(itemsFromSportClass, null, 3);  // <<-  add data to DOM







// Token request response example
// {
//   "username": "DEMO",
//   "environment": "JDV920",
//   "role": "*ALL",
//   "jasserver": "http://e1srv:7020",
//   "userInfo": {
//     "token": "044v2SEf1SZK9xhb/Say3dkrNzm43TUDkvtVBvPe8X08XQ=MDE4MDA5OTM5NTM0ODA4MTg2MTY3MzY1YWlzVGVzdGVyMTQ5NDk2NTI1OTg0Nw==",
//     "langPref": "  ",
//     "locale": "en",
//     "dateFormat": "MDE",
//     "dateSeperator": "/",
//     "simpleDateFormat": "MM/dd/yyyy",
//     "decimalFormat": ".",
//     "addressNumber": 0,
//     "alphaName": "DEMO",
//     "appsRelease": "E920",
//     "country": " ",
//     "username": "DEMO"
//   },
//   "userAuthorized": false,
//   "version": null,
//   "poStringJSON": null,
//   "altPoStringJSON": null,
//   "aisSessionCookie": "negS345IlfkoLIS3aLD2mO4uM35_uX0LzNVTbtemxEy-AhVMLdO1!1643583743!1494965259848",
//   "adminAuthorized": false,
//   "deprecated": true
// }



//  extra credit to play around with Form Services
// form service
//   var reqData = {
//                 "version": "ZJDE0001",
//                 "formActions": [],
//                 "deviceName": "bestCodexTeam",
//                 "formName": "P4101_W4101A"
//   }
