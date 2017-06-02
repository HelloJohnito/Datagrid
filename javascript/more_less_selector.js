var moreButton = document.querySelector(".button-more");
var lessButton = document.querySelector(".button-less");
var displayMore = false;

function addEventListenerMoreLess(){
  var moreCol = document.querySelectorAll(".col-more");

  // Append eventlistener to 'more' button. Toggles the button to display 'more' content and changes the color of the button to selected.
  moreButton.addEventListener("click", function(){
      if(!displayMore){
        for(var index = 0; index < moreCol.length; index++){
          moreCol[index].classList.toggle("col-more");
        }
        moreButton.children[0].classList.toggle("button-selected");
        lessButton.children[0].classList.toggle("button-selected");
        displayMore = true;
      }
  });

  // Append eventlistener to less button. vice versa from moreButton.
  lessButton.addEventListener("click", function(){
    if(displayMore){
      for(var index = 0; index < moreCol.length; index++){
        moreCol[index].classList.toggle("col-more");
      }
      moreButton.children[0].classList.toggle("button-selected");
      lessButton.children[0].classList.toggle("button-selected");
      displayMore = false;
    }
  });
}
