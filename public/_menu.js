// const M = require('materialize-css');

    document.addEventListener('DOMContentLoaded', function(e) {
    const elems = document.querySelectorAll('.sidenav');
    if(elems){
        const instances = M.Sidenav.init(elems, {
            edge:'right',
            draggable:true,
            preventScrolling: true
        });
    }

  });

  document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.carousel');
    const instances = M.Carousel.init(elems, {fullWidth: true,
        indicators: true});
  });

  document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.collapsible');
    const instances = M.Collapsible.init(elems, {
        accordion: false
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, {
      
    });
  });