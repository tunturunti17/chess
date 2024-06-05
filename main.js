const MySlider = function (wrapperQuery, btnNextSlideId, btnPrevSlideId, slidesPerView = 1, loop = false, renderPaginationFn, autoPlayInterval) {

  const wrapper = document.querySelector(wrapperQuery);
  const btnNext = document.getElementById(btnNextSlideId);
  const btnPrev = document.getElementById(btnPrevSlideId);

  const slidesAmmount = wrapper.childElementCount;
  const slideWidth = wrapper.children[0].offsetWidth;

  let setIntervalResult;
  let currentViewNumber = 1;
  let maxViewNumber = slidesAmmount / slidesPerView;

  function showNextView() {
      currentViewNumber++;

      if (currentViewNumber > maxViewNumber) {
          if (loop) {
              currentViewNumber = 1;
          } else {
              currentViewNumber = maxViewNumber;
          }
      }
      updateView();
  }

  function showPrevView() {
      currentViewNumber--;
      if (currentViewNumber < 1) {
          if (loop) {
              currentViewNumber = maxViewNumber;
          } else {
              currentViewNumber = 1;
          }
      }
      updateView();
  }

  const updateView = () => {
      wrapper.style.left = slideWidth * slidesPerView * (currentViewNumber - 1) * -1 + 'px';
      if (typeof renderPaginationFn === "function") {
          renderPaginationFn(currentViewNumber, slidesAmmount);
      }

      if (!loop) {
          if (currentViewNumber == 1) {
              btnPrev.classList.add('disabled');
          } else {
              btnPrev.classList.remove('disabled');
          }

          if (currentViewNumber == maxViewNumber) {
              btnNext.classList.add('disabled');
          } else {
              btnNext.classList.remove('disabled');
          }
      }
  }

  btnNext.addEventListener('click', showNextView);
  btnPrev.addEventListener('click', showPrevView);

  if (autoPlayInterval > 0) {
      setIntervalResult = setInterval(showNextView, autoPlayInterval);
  }

  this.clear = () => {
      if (setIntervalResult != undefined) {
          clearInterval(setIntervalResult);
      }
  }
  updateView();
}

const mediaQuery = window.matchMedia('(max-width: 576px)');

let participantsSlider;

function handleMobileQueryChange(e) {
  if (participantsSlider instanceof MySlider) {
      participantsSlider.clear();
  }
  if (e.matches) {
      participantsSlider = new MySlider('#slider_wrapper', 'btn_slide_next', 'btn_slide_prev', 1, true, (currentViewNumber, slidesAmmount) => {
          document.getElementById('slide_number').innerText = currentViewNumber * 1;
          document.getElementById('quantity_slides').innerText = slidesAmmount;
      }, 4000);

      stagesSlider = new MySlider('#stages_slider_wrapper', 'btn_stages_slide_next', 'btn_stages_slide_prev', 1, false, (currentViewNumber) => {
          const sliderPaginationDots = document.getElementsByClassName('stages-slider-dot');

          Array.from(sliderPaginationDots).forEach((dot, index) => {
              if (index == currentViewNumber - 1) {
                  dot.classList.add('active');
              } else {
                  dot.classList.remove('active');
              }
          });
      });

  } else {
      participantsSlider = new MySlider('#slider_wrapper', 'btn_slide_next', 'btn_slide_prev', 1, true, (currentViewNumber, slidesAmmount) => {
          document.getElementById('slide_number').innerText = currentViewNumber * 1;
          document.getElementById('quantity_slides').innerText = slidesAmmount;
      }, 4000);
  }
}

handleMobileQueryChange(mediaQuery);
mediaQuery.addListener(handleMobileQueryChange);
