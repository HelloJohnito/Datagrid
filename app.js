//State
var grid = document.getElementById("grid");
var moreButton = document.querySelector(".button-more");
var lessButton = document.querySelector(".button-less");
var showingMore = false;


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


function createTable(data){
  //Loop over the rows and create rows and columns
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

    // add "table-name" CSS property to name column
    var newContent;
    if(col === "name"){
      newTableColumn.classList.add("table-name");
      newContent = document.createTextNode(row[col]);
    } else {
      // check for multiple inputs example: bestcase and commit
      if(row[col] instanceof Array){
        // add CSS property "more" to all inputs except the first.
        // the "more" property will toggle to display.
        for(var index = 0; index < row[col].length; index ++){
          var innerColDiv = document.createElement("div");
          newContent = document.createTextNode(row[col][index]);

          if(index !== 0) innerColDiv.classList.add("col-more");
          innerColDiv.appendChild(newContent);
          newTableColumn.appendChild(innerColDiv);
        }
        newTableRow.appendChild(newTableColumn);
        return;
      }

      newContent = document.createTextNode(row[col]);
    }

    newTableColumn.appendChild(newContent);
    newTableRow.appendChild(newTableColumn);
  });
}

function parseNumToDollars(num){
  var numToString = num.toString();
}


function setEventListener(){
  var moreCol = document.querySelectorAll(".col-more");

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
}

createTable(jsonData);
setEventListener();
