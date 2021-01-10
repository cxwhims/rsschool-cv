console.log('hello');

window.onload = function() {
    menuItemClickHandler();
}
/* Hesder leptom menu */
const setActive = (element) => {
  let items = document.querySelectorAll('.header-navigation__link');
  items.forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add("active");
}

/* Hesder mobile menu */
(function() {

  var hamburger = {
    navToggle: document.querySelector('.nav-toggle'),
    nav: document.querySelector('nav'),

    doToggle: function(e) {
      this.navToggle.classList.toggle('expanded');
      this.nav.classList.toggle('expanded');
    }
  };

  hamburger.navToggle.addEventListener('click', function(e) { hamburger.doToggle(e); });
  hamburger.nav.addEventListener('click', function(e) { hamburger.doToggle(e); });

}());



/* Portfolio menu */
const menuItemClickHandler = () => {
    document.querySelector('.portfolio-menu').addEventListener('click', (e) => {
        if (e.target.classList.contains('portfolio-menu__item')) {
            let clickedItem = e.target;
            removeSelectedItem();
            selectClickedItem(clickedItem);
        }
    })
}

const removeSelectedItem = () => {
    let items = document.querySelectorAll('.portfolio-menu .portfolio-menu__item');
    items.forEach(item => {
        item.classList.remove('item_selected');
        item.classList.add('item_bordered');
    })
}

const selectClickedItem = (clickedItem) => {
    clickedItem.classList.add('item_selected');
    clickedItem.classList.remove('item_bordered');
}

function shuffleImages() {
  var container = document.getElementById("portfolio-table");
  var elementsArray = Array.prototype.slice.call(container.getElementsByClassName('portfolio-table__item'));
  elementsArray.forEach(function(element){
    container.removeChild(element);
  })
  shuffleArray(elementsArray);
  elementsArray.forEach(function(element){
    container.appendChild(element);
  })
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


/*  Slider  */

'use strict';
var multiItemSlider = (function () {

  function _isElementVisible(element) {
    var rect = element.getBoundingClientRect(),
      vWidth = window.innerWidth || doc.documentElement.clientWidth,
      vHeight = window.innerHeight || doc.documentElement.clientHeight,
      elemFromPoint = function (x, y) { return document.elementFromPoint(x, y) };
    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight)
      return false;
    return (
      element.contains(elemFromPoint(rect.left, rect.top))
      || element.contains(elemFromPoint(rect.right, rect.top))
      || element.contains(elemFromPoint(rect.right, rect.bottom))
      || element.contains(elemFromPoint(rect.left, rect.bottom))
    );
  }

  return function (selector, config) {
    var
      _mainElement = document.querySelector(selector), // основной элемент блока
      _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
      _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
      _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
      _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
      _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
      _positionLeftItem = 0, // позиция левого активного элемента
      _transform = 0, // значение транфсофрмации .slider_wrapper
      _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
      _items = [], // массив элементов
      _interval = 0,
      _html = _mainElement.innerHTML,
      _states = [
        { active: false, minWidth: 0, count: 1 },
        { active: false, minWidth: 980, count: 2 }
      ],
      _config = {
        isCycling: false, // автоматическая смена слайдов
        direction: 'right', // направление смены слайдов
        interval: 5000, // интервал между автоматической сменой слайдов
        pause: true // устанавливать ли паузу при поднесении курсора к слайдеру
      };

    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    // наполнение массива _items
    _sliderItems.forEach(function (item, index) {
      _items.push({ item: item, position: index, transform: 0 });
    });

    var _setActive = function () {
      var _index = 0;
      var width = parseFloat(document.body.clientWidth);
      _states.forEach(function (item, index, arr) {
        _states[index].active = false;
        if (width >= _states[index].minWidth)
          _index = index;
      });
      _states[_index].active = true;
    }

    var _getActive = function () {
      var _index;
      _states.forEach(function (item, index, arr) {
        if (_states[index].active) {
          _index = index;
        }
      });
      return _index;
    }

    var position = {
      getItemMin: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position < _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getItemMax: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position > _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getMin: function () {
        return _items[position.getItemMin()].position;
      },
      getMax: function () {
        return _items[position.getItemMax()].position;
      }
    }

    var _transformItem = function (direction) {
      var nextItem;
      if (!_isElementVisible(_mainElement)) {
        return;
      }
      if (direction === 'right') {
        _positionLeftItem++;
        if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
          nextItem = position.getItemMin();
          _items[nextItem].position = position.getMax() + 1;
          _items[nextItem].transform += _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }
        _transform -= _step;
      }
      if (direction === 'left') {
        _positionLeftItem--;
        if (_positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          _items[nextItem].position = position.getMin() - 1;
          _items[nextItem].transform -= _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }
        _transform += _step;
      }
      _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
    }

    var _cycle = function (direction) {
      if (!_config.isCycling) {
        return;
      }
      _interval = setInterval(function () {
        _transformItem(direction);
      }, _config.interval);
    }

    // обработчик события click для кнопок "назад" и "вперед"
    var _controlClick = function (e) {
      if (e.target.classList.contains('slider__control')) {
        e.preventDefault();
        var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
        _transformItem(direction);
        clearInterval(_interval);
        _cycle(_config.direction);
      }
    };

    // обработка события изменения видимости страницы
    var _handleVisibilityChange = function () {
      if (document.visibilityState === "hidden") {
        clearInterval(_interval);
      } else {
        clearInterval(_interval);
        _cycle(_config.direction);
      }
    }

    var _refresh = function () {
      clearInterval(_interval);
      _mainElement.innerHTML = _html;
      _sliderWrapper = _mainElement.querySelector('.slider__wrapper');
      _sliderItems = _mainElement.querySelectorAll('.slider__item');
      _sliderControls = _mainElement.querySelectorAll('.slider__control');
      _sliderControlLeft = _mainElement.querySelector('.slider__control_left');
      _sliderControlRight = _mainElement.querySelector('.slider__control_right');
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
      _positionLeftItem = 0;
      _transform = 0;
      _step = _itemWidth / _wrapperWidth * 100;
      _items = [];
      _sliderItems.forEach(function (item, index) {
        _items.push({ item: item, position: index, transform: 0 });
      });
    }

    var _setUpListeners = function () {
      _mainElement.addEventListener('click', _controlClick);
      if (_config.pause && _config.isCycling) {
        _mainElement.addEventListener('mouseenter', function () {
          clearInterval(_interval);
        });
        _mainElement.addEventListener('mouseleave', function () {
          clearInterval(_interval);
          _cycle(_config.direction);
        });
      }
      document.addEventListener('visibilitychange', _handleVisibilityChange, false);
      window.addEventListener('resize', function () {
        var
          _index = 0,
          width = parseFloat(document.body.clientWidth);
        _states.forEach(function (item, index, arr) {
          if (width >= _states[index].minWidth)
            _index = index;
        });
        if (_index !== _getActive()) {
          _setActive();
          _refresh();
        }
      });
    }

    // инициализация
    _setUpListeners();
    if (document.visibilityState === "visible") {
      _cycle(_config.direction);
    }
    _setActive();

    return {
      right: function () { // метод right
        _transformItem('right');
      },
      left: function () { // метод left
        _transformItem('left');
      },
      stop: function () { // метод stop
        _config.isCycling = false;
        clearInterval(_interval);
      },
      cycle: function () { // метод cycle 
        _config.isCycling = true;
        clearInterval(_interval);
        _cycle();
      }
    }

  }
}());

var slider = multiItemSlider('.slider', {
  isCycling: false
})
