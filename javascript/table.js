var grid = document.getElementById("grid");
var colHeader = document.querySelector(".table-row-1");

function createTable(data){
  var jsonDataKeys = Object.keys(data);

  // create the dropdown form
  createForm(data, jsonDataKeys[0]);

  //Loop over the jsonData and create rows and columns for the table
  jsonDataKeys.forEach(function(row){
    addElement(data[row]);
  });
}

function addElement(row) {
  //create row
  var newTableRow = document.createElement("div");
  newTableRow.classList.add("table-row");
  grid.appendChild(newTableRow);

  //create columns
  Object.keys(row).forEach(function(col){
    var newTableColumn = document.createElement("div");
    newTableColumn.classList.add("table-col");
    newTableColumn.classList.add(`table-${col}`);

    //show only five columns, disable those that are not selected
    //formCheck is an object with keys as column name
    // and values as a boolean depending on if it is selected
    if(!formCheck[col]){
      newTableColumn.classList.add("disabled");
    }

    newTableColumn.dataset.col = col;
    var newContent;
      // check for multiple inputs. Example: bestcase and commit
    if(row[col] instanceof Array){
      // add CSS property "col-more" to all inputs except the first.
      // the "col-more" property will toggle to display depending on the selected button.
      for(var index = 0; index < row[col].length; index ++){
        var innerColDiv = document.createElement("div");
        newContent = document.createTextNode(parseNumToDollars(row[col][index]));

        if(index !== 0) innerColDiv.classList.add("col-more");
        innerColDiv.appendChild(newContent);
        newTableColumn.appendChild(innerColDiv);
      }
      newTableRow.appendChild(newTableColumn);
      return;
    }

    newContent = document.createTextNode(parseNumToDollars(row[col]));
    newTableColumn.appendChild(newContent);
    newTableRow.appendChild(newTableColumn);
  });
}


///////////////////////////////////
       // Sorting Function//
////////////////////////////////////

// keep track of descending or ascending
var descendingObject = {
  name: false,
  plan: false,
  forecast: false,
  bestcase: false,
  commit: false,
  monthlypay: false,
  comment: false
};

// Store data into an array for sorting
var jsonDataArray = createObjToArray(jsonData);

function createObjToArray(obj){
  var objArray = [];
  for(var key in obj){
    var newObj = {};
    newObj[key] = obj[key];
    objArray.push(newObj[key]);
  }
  return objArray;
}


function sortByColumns(selectedColumn){

  // returns an array with objects sorted by selected column
  var sortedObjArray = sortingObj(jsonDataArray, descendingObject[selectedColumn], selectedColumn);

  //toggle the boolean in descendingObject for next time it is clicked.
  descendingObject[selectedColumn] = descendingObject[selectedColumn] === false ? true : false;

  //re-renders the table
  updateTable(sortedObjArray);
}


function sortingObj(objArray, descending, selectedColumn){
  var sortedObjArray;
  if(!descending){

    // Edge cases are required for bestcase and commit because their values are an array.
    // In this case, we take the first option (bestcase[0]) to sort.
    sortedObjArray = objArray.slice().sort(function(a,b){
      if(a[selectedColumn] instanceof Array && b[selectedColumn] instanceof Array){
        return a[selectedColumn][0] > b[selectedColumn][0] ? 1: -1;
      } else {
        return a[selectedColumn] > b[selectedColumn] ? 1 : -1;
      }
    });

  } else {
    sortedObjArray = objArray.slice().sort(function(a,b){
      if(a[selectedColumn] instanceof Array && b[selectedColumn] instanceof Array){
        return a[selectedColumn][0] < b[selectedColumn][0] ? 1: -1;
      } else {
        return a[selectedColumn] < b[selectedColumn] ? 1 : -1;
      }
    });
  }
  return sortedObjArray;
}


function updateTable(sortedObjArray){
  let num = 0;
  //iterate through each row and column and replace the innerhtml with new sorted input.
  for(var rowIndex = 1; rowIndex < grid.children.length;  rowIndex++){
    var tableRow = grid.children[rowIndex];
    for(var colIndex = 0; colIndex < tableRow.children.length; colIndex++){
        var tableCol = tableRow.children[colIndex];
        var sortedObject = sortedObjArray[rowIndex - 1];

        // edge case for bestcase and commit (multiple inputs)
        if(sortedObject[tableCol.dataset.col] instanceof Array){
          for(var i = 0; i < tableCol.children.length; i++){
            tableCol.children[i].innerHTML = parseNumToDollars(sortedObject[tableCol.dataset.col][i]);
          }
        } else {
          tableCol.innerHTML = parseNumToDollars(sortedObject[tableCol.dataset.col]);
        }
    }
  }
}


function parseNumToDollars(num){
  if(typeof num === "string") return num;

  var numToString = num.toString();
  var counter = 0;
  for(var i = numToString.length; i >= 0; i--){
    if(counter === 3){
      counter = 0;
      numToString = numToString.slice(0,i) + "," + numToString.slice(i,numToString.length);
    }
    counter += 1;
  }
  if(numToString[0] === ","){
    numToString = "$" + numToString.slice(1,numToString.length);
  } else {
    numToString = '$' + numToString;
  }

  return numToString;
}


//append eventlistener to the column header for sorting
colHeader.addEventListener("click", function(event){
  sortByColumns(event.target.dataset.col);
});
