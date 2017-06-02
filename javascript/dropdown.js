var formCheck = {count: 0};
var selectbox = document.querySelector(".selectbox");
var form = document.getElementById("checkbox-form");
var checkboxes = document.getElementById("checkboxes");
var checkboxExpanded = false;


function createForm(data, key){
  // Loop over the column titles:
  // [name, plan, forecast, bestcase, commit]
  // And append to checkbox form
  Object.keys(data[key]).forEach(function(colTitle){

    // Select the first 5 column titles to display
    if(formCheck['count'] < 5){
      formCheck[colTitle] = true;
      formCheck['count'] += 1;
    } else {
      formCheck[colTitle] = false;
    }

    // Create the html elements and place them under id=checkboxes
    var label = document.createElement("label");
    var inputCheckbox = document.createElement("input");
    var titleContent = document.createTextNode(`${colTitle}`); // capitalize

    inputCheckbox.type = "checkbox";
    inputCheckbox.classList.add(`checkbox-${colTitle}`);
    inputCheckbox.name = `${colTitle}`;

    // Pre-check the first five and disable the rest
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

  // Append apply button at the end
  var label = document.createElement("label");
  var inputSubmit = document.createElement("input");
  inputSubmit.type = "submit";
  inputSubmit.value = "apply";
  inputSubmit.classList.add("apply-button");
  label.appendChild(inputSubmit);
  checkboxes.appendChild(label);

  return;
}


// On click 'apply', hides all columns that are not checked.
function handleSubmit(e){
  if(e.preventDefault) e.preventDefault();
  Object.keys(formCheck).forEach(function(key){
    var unCheckedColumns;
    if(key !== 'count' && !formCheck[key]){
      // Append display-none to all unchecked columns
      unCheckedColumns = document.querySelectorAll(`.table-${key}`);
      for(var i = 0; i < unCheckedColumns.length; i++){
        unCheckedColumns[i].classList.add("disabled");
      }
      // Display checked columns
    } else if( key !== 'count' && formCheck[key]) {
      unCheckedColumns = document.querySelectorAll(`.table-${key}`);
      for(var j = 0; j < unCheckedColumns.length; j++){
        unCheckedColumns[j].classList.remove("disabled");
      }
    }
  });
  return;
}


// Append eventlistener to selectbox to display checkboxes
selectbox.addEventListener("click", function(){
  if(!checkboxExpanded){
    checkboxes.style.display = "block";
    checkboxExpanded = true;
  } else {
    checkboxes.style.display = "none";
    checkboxExpanded = false;
  }
});

// Append eventlistener to form to handle submit button
form.addEventListener("submit", handleSubmit);

// Append eventlistener to checkedbox
// Limits five checks
checkboxes.addEventListener("click", function(){
  if(event.target.name === undefined || event.target.name === "") return;

  if (formCheck.hasOwnProperty(event.target.name) && formCheck[event.target.name]){
    formCheck[event.target.name] = false;
    formCheck['count'] -= 1;
  } else {
    formCheck[event.target.name] = true;
    formCheck['count'] += 1;
  }

  // Limit five selected items
  if(formCheck['count'] ===  5){
    // Disable all other buttons
    Object.keys(formCheck).forEach(function(key){
      if(!formCheck[key]){
        var disableSelector = document.querySelector(`.checkbox-${key}`);
        disableSelector.parentNode.classList.add('selector-disable');
        disableSelector.disabled = true;
      }
    });
    // 'Undisable' buttons when count is not five.
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
