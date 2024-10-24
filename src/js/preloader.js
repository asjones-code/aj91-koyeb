// For Live Projects
window.addEventListener('load', function () {
  document.body.classList.add('no-scroll');
  //document.querySelector('body').classList.add("loaded")


  setTimeout(function () {
    //document.querySelector('body').classList.add("loaded");
    document.querySelector('body').style.visibility = 'visible';

    document.body.classList.remove('no-scroll');

    // Correct way to remove the preloader
    const preloader = document.querySelector('.loader');
    if (preloader) {
      preloader.remove(); // Call remove() on the selected element
      //document.querySelector('.blicky').style.visibility = 'visible';
      document.querySelector('.blicky').classList.add("loaded");
      document.querySelector('header').classList.add("loaded");
      const canvas = document.querySelector('#blob canvas');

      if (canvas) {
        canvas.style.opacity = '1'; // Change opacity to 1 with smooth transition
      }





    }
  }, 1000); // 1000 milliseconds = 1 secon

  console.log('loaded');
});


