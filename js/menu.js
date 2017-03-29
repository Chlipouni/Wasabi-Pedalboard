var menu; 
var menuState;
var divs;

function handleJackMenu(elem) {
  elem.addEventListener( "click", function(e) {
    e.preventDefault();
    let p = pedalboard.findPedalWhoseInputIsHighlighted();
    if (p.inputJacks.length > 1) {
      createMenuItems(p.inputJacks);
      toggleMenuOn();
      positionMenu(e);
    } else {
      if (typeof p.inputJacks != "undefined" && p.inputJacks != null && p.inputJacks.length > 0) {
        pedalboard.currentState = "removingJack";
        mouseUpDraggable();
      }
    }
  });
}

function createMenuItems(jacks) {
  document.getElementById("menu-container").innerHTML = "";
  jacks.forEach(function(j) {
    var ul = document.getElementById("menu-container");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode("Jack " + j.p1.id.substring(5,6)));
    li.classList.add("context-menu__item");
    ul.appendChild(li);
  })
}

function toggleMenuOn() {
  if ( menuState !== 1 ) {
    menuState = 1;
    menu.classList.add("context-menu--active");
  }
}

function toggleMenuOff() {
  if ( menuState !== 0 ) {
    menuState = 0;
    menu.classList.remove("context-menu--active");
  }
}

// Get mouse pointer position
function getPosition(e) {
  var rect = e.target.getBoundingClientRect();
  var posx = e.clientX;// - rect.left;
  var posy = e.clientY;// - rect.top;
  return {
    x: posx,
    y: posy
  };
}

function positionMenu(e) {
  var clickCoords = getPosition(e);
  var clickCoordsX = clickCoords.x;// + e.target.offsetLeft;
  var clickCoordsY = clickCoords.y;// + e.target.offsetTop;

  var menuWidth = menu.offsetWidth + 1;
  var menuHeight = menu.offsetHeight + 1;

  var windowWidth = e.target.innerWidth;
  var windowHeight = e.target.innerHeight;

  if ((windowWidth - clickCoordsX) < menuWidth) {
    menu.style.left = windowWidth - menuWidth + "px";
  } else {
    menu.style.left = clickCoordsX - menuWidth + "px";
  }

  if ((windowHeight - clickCoordsY) < menuHeight) {
    menu.style.top = windowHeight - menuHeight + "px";
  } else {
   menu.style.top = clickCoordsY - menuHeight/2 + "px";
  }
}

function resizeListener (elem) {
  window.onresize = function(e) {
    // Hide menu if the window is resized
    toggleMenuOff();
  }
}