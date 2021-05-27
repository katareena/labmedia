'use strict';

(function () {
// --------------- dropdown menu ---------------
  const ESCAPE = 27;
  const burgerBtn = document.querySelector('.header__btn');
  const dropdown = document.querySelector('.header__dropdown');
  const main = document.querySelector('main');

  function moveDropdownHandler() {
    dropdown.classList.toggle('header__dropdown--open');
    dropdown.classList.toggle('header__dropdown--absolute');
    burgerBtn.classList.toggle('header__btn--close');
    burgerBtn.classList.toggle('header__btn--burger');
    main.classList.toggle('main--opasity');
    window.menuDropdown.switchListeners();
    window.menuDropdown.switchScroll();
  };

  function closeEscDropdownHandler (evt) {
    if (evt.keyCode === ESCAPE) {
      if (dropdown.classList.contains('header__dropdown--open')) {
        moveDropdownHandler();
      }
    }
  };

  function closeOutDropdownHandler (evt) {
    window.changeMatchesForIE.changeMatchesForIE();
    if (!evt.target.matches('.header__btn')) {
      const dropdowns = document.getElementsByClassName('header__dropdown');
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('header__dropdown--open')) {
          moveDropdownHandler();
        }
      }
    }
  };

  function switchListeners() {
    if (dropdown.classList.contains('header__dropdown--open')) {
      document.addEventListener('click', closeOutDropdownHandler);
      document.addEventListener('keydown', closeEscDropdownHandler);
    }

    if (!dropdown.classList.contains('header__dropdown--open')) {
      document.removeEventListener('click', closeOutDropdownHandler);
      document.removeEventListener('keydown', closeEscDropdownHandler);
    }
  };
  // getEventListeners(document);

  function switchScroll() {
    if (dropdown.classList.contains('header__dropdown--open')) {
      window.scroll.preventScroll();
    }

    if (!dropdown.classList.contains('header__dropdown--open')) {
      window.scroll.getScroll();
    }
  };

  window.menuDropdown = {
    switchListeners: switchListeners,
    switchScroll: switchScroll
  };

  burgerBtn.addEventListener('click', moveDropdownHandler);
})();

(function () {
// --------------- scroll ---------------
  const dropdown = document.querySelector('.header__dropdown');

  function preventScroll() {
    const body = document.body;
    body.style.height = '100vh';
    body.style.overflowY = 'hidden';
  };

  function getScroll() {
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
    body.style.height = '';
    body.style.overflowY = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  };

  window.scroll = {
    preventScroll: preventScroll,
    getScroll: getScroll
  };
})();
