(function ($) {
  'use strict';

  if ($("#inline-datepicker").length) {
    $('#inline-datepicker').datepicker({
      enableOnReadonly: true,
      todayHighlight: true,
    });
  }

  // Check if the #proBanner element exists before manipulating it
  const proBanner = document.querySelector('#proBanner');
  const navbar = document.querySelector('.navbar');

  if (proBanner && navbar) {
    if ($.cookie('purple-pro-banner') != "true") {
      proBanner.classList.add('d-flex');
      navbar.classList.remove('fixed-top');
    } else {
      proBanner.classList.add('d-none');
      navbar.classList.add('fixed-top');
    }

    if (navbar.classList.contains("fixed-top")) {
      document.querySelector('.page-body-wrapper').classList.remove('pt-0');
      navbar.classList.remove('pt-5');
    } else {
      document.querySelector('.page-body-wrapper').classList.add('pt-0');
      navbar.classList.add('pt-5');
      navbar.classList.add('mt-3');
    }

    // Add event listener for banner close
    const bannerClose = document.querySelector('#bannerClose');
    if (bannerClose) {
      bannerClose.addEventListener('click', function () {
        proBanner.classList.add('d-none');
        proBanner.classList.remove('d-flex');
        navbar.classList.remove('pt-5');
        navbar.classList.add('fixed-top');
        document.querySelector('.page-body-wrapper').classList.add('proBanner-padding-top');
        navbar.classList.remove('mt-3');
        var date = new Date();
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        $.cookie('purple-pro-banner', "true", {
          expires: date
        });
      });
    }
  }
})(jQuery);
