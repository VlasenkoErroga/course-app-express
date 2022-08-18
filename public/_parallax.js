// const M = require('materialize-css');


const elemsParallax = document.querySelectorAll('.parallax');
  document.addEventListener('DOMContentLoaded', function() {
    if(elemsParallax){
      const instances = M.Parallax.init(elemsParallax, {responsiveThreshold: 768});
    }
  });


  document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.dropdown-trigger');
    const instances = M.Dropdown.init(elems, {
      closeOnClick: true,
      constrainWidth: false,
      container: '.container'
    });
  });
