// For Live Projects
window.addEventListener('load',function(){
    document.body.classList.add('no-scroll');
    document.querySelector('.bm-pl').classList.add("loaded")
    

    setTimeout(function() {
      document.querySelector('header').classList.add("show");
      document.body.classList.remove('no-scroll');

      // Correct way to remove the preloader
      const preloader = document.querySelector('.preloader');
      if (preloader) {
          preloader.remove(); // Call remove() on the selected element
      }
  }, 1000); // 1000 milliseconds = 1 secon

    console.log('loaded');
  });
  

