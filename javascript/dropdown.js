var formCheck = {count: 0};
var selectbox = document.querySelector(".selectbox");
var form = document.getElementById("checkbox-form");
var checkboxes = document.getElementById("checkboxes");
var checkboxExpanded = false;


function createForm(data, key){
  // loop over the column titles
  // [name, plan, forecast, bestcase, commit]
  // and append to checkbox form
  Object.keys(data[key]).forEach(function(colTitle){

    //Select the first 5 column titles to display
    if(formCheck['count'] < 5){
      formCheck[colTitle] = true;
      formCheck['count'] += 1;
    } else {
      formCheck[colTitle] = false;
    }

    // create the html elements and place them under id=checkboxes
    var label = document.createElement("label");
    var inputCheckbox = document.createElement("input");
    var titleContent = document.createTextNode(`${colTitle}`); // capitalize

    inputCheckbox.type = "checkbox";
    inputCheckbox.classList.add(`checkbox-${colTitle}`);
    inputCheckbox.name = `${colTitle}`;

    //precheck the first five and disable the rest
    if(formCheck[colTitle]){
      inputCheckbox.checked = "checked";
    } else {
      label.classList.add("selector-disable");
      inputCheckbox.disabled = "true";
    }

    label.appendChild(inputCheckbox);
    label.appendChild(titleContent);

    checkboxes.appendChild(label);
  });

  // append apply button at the end
  var label = document.createElement("label");
  var inputSubmit = document.createElement("input");
  inputSubmit.type = "submit";
  inputSubmit.value = "apply";
  inputSubmit.classList.add("apply-button");
  label.appendChild(inputSubmit);
  checkboxes.appendChild(label);

  return;
}


// on 'apply', hides all columns that are not checked.
function handleSubmit(e){
  if(e.preventDefault) e.preventDefault();
  Object.keys(formCheck).forEach(function(key){
    var unCheckedColumns;
    if(key !== 'count' && !formCheck[key]){
      // append display-none to all unchecked columns
      unCheckedColumns = document.querySelectorAll(`.table-${key}`);
      for(var i = 0; i < unCheckedColumns.length; i++){
        unCheckedColumns[i].classList.add("disabled");
      }
      // display checked columns
    } else if( key !== 'count' && formCheck[key]) {
      unCheckedColumns = document.querySelectorAll(`.table-${key}`);
      for(var j = 0; j < unCheckedColumns.length; j++){
        unCheckedColumns[j].classList.remove("disabled");
      }
    }
  });

  //place the selector at the last column
  // var dropdowns = document.querySelectorAll('#checkbox-form');
  // console.log(dropdowns)
  // for(var i = dropdowns.length - 1; i >= 0; i--){
  //   console.log(dropdowns[i].dataset.form);
  //   if(formCheck[dropdowns[i].dataset.form]){
  //     console.log(formCheck[dropdowns[i].dataset.form])

  return;
}


// append eventlistener to selectbox to display checkboxes
selectbox.addEventListener("click", function(){
  // var checkboxes = document.getElementById("checkboxes"); // can delete
  if(!checkboxExpanded){
    checkboxes.style.display = "block";
    checkboxExpanded = true;
  } else {
    checkboxes.style.display = "none";
    checkboxExpanded = false;
  }
});

//append eventlistener to form to handle submit button
form.addEventListener("submit", handleSubmit);

//append eventlistener to checkedbox
// limits five checks
checkboxes.addEventListener("click", function(){
  if(event.target.name === undefined || event.target.name === "") return;

  if (formCheck.hasOwnProperty(event.target.name) && formCheck[event.target.name]){
    formCheck[event.target.name] = false;
    formCheck['count'] -= 1;
  } else {
    formCheck[event.target.name] = true;
    formCheck['count'] += 1;
  }

  //limit five
  if(formCheck['count'] ===  5){
    //disable all other buttons
    Object.keys(formCheck).forEach(function(key){
      if(!formCheck[key]){
        var disableSelector = document.querySelector(`.checkbox-${key}`);
        disableSelector.parentNode.classList.add('selector-disable');
        disableSelector.disabled = true;
      }
    });
    //undisable buttons when count is not five.
  } else if(formCheck['count'] === 4){
    Object.keys(formCheck).forEach(function(key){
      if(!formCheck[key]){
        var disableSelector = document.querySelector(`.checkbox-${key}`);
        disableSelector.parentNode.classList.remove('selector-disable');
        disableSelector.disabled = false;
      }
    });
  }
});
