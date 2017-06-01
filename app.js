//State
var grid = document.getElementById("grid");
var moreButton = document.querySelector(".button-more");
var lessButton = document.querySelector(".button-less");
var colHeader = document.querySelector(".table-row-1");
var showingMore = false;
var descendingObject = {
  name: false,
  plan: false,
  forecast: false,
  bestcase: false,
  commit: false
};

// Data in json format
var jsonData = {
  europe:{
    name: "Europe",
    plan: 1053520,
    forecast: 12700200,
    bestcase: [12700200, 11700400],
    commit: [12700200, 11700400]
  },
  belgium:{
    name: "Belgium",
    plan: 2525200,
    forecast: 3125200,
    bestcase: [2900450, 2890120],
    commit: [2900450, 2890120]
  },
  england: {
    name: "England",
    plan: 4600400,
    forecast: 2500600,
    bestcase: [3900300, 2900300],
    commit: [3900300, 2900300]
  },
  sweden: {
    name: "Sweden",
    plan: 2425200,
    forecast: 5425200,
    bestcase: [6200200, 2400900],
    commit: [6200200, 2400900]
  },
  finland: {
    name: "Finland",
    plan: 1700200,
    forecast: 4700200,
    bestcase: [4702120, 4300200],
    commit: [4702120, 4300200]
  }
};


////////////////////////////////////
       // Creating Table//
////////////////////////////////////

function createTable(data){
  //Loop over the jsonData and create rows and columns
  Object.keys(data).forEach(function(row){
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

////////////////////////////////////
       // Sorting Function//
////////////////////////////////////

// Store data into array for sorting
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
  //need to store into an array.
  var sortedObjArray = sortingObj(jsonDataArray, descendingObject[selectedColumn], selectedColumn);
  //toggle descending boolean for next time it is clicked.
  descendingObject[selectedColumn] = descendingObject[selectedColumn] === false ? true : false;
  updateTable(sortedObjArray);

}

function sortingObj(objArray, descending, selectedColumn){
  var sortedObjArray;
  if(!descending){

    // Edge cases are required for bestcase and commit because their values are an array.
    // In this case, we take the first first option (bestcase[0]) to sort.

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

        // edge case for bestcase and commit
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

////////////////////////////////////
       // Event Listener//
////////////////////////////////////

function setEventListener(){
  var moreCol = document.querySelectorAll(".col-more");
  // appends eventlistener to more button. Toggles the button selected color and
  // the 'more' content on.
  moreButton.addEventListener("click", function(){
      if(!showingMore){
        for(var index = 0; index < moreCol.length; index++){
          moreCol[index].classList.toggle("col-more");
        }
        moreButton.children[0].classList.toggle("button-selected");
        lessButton.children[0].classList.toggle("button-selected");
        showingMore = true;
      }
  });

  //appends eventlistener to less button. vice versa from moreButton.
  lessButton.addEventListener("click", function(){
    if(showingMore){
      for(var index = 0; index < moreCol.length; index++){
        moreCol[index].classList.toggle("col-more");
      }
      moreButton.children[0].classList.toggle("button-selected");
      lessButton.children[0].classList.toggle("button-selected");
      showingMore = false;
    }
  });

  //append eventlistener to the column header for sorting
  colHeader.addEventListener("click", function(event){
    sortByColumns(event.target.dataset.col);
  });
}

createTable(jsonData);
setEventListener();
