$( document ).ready(function() {
  sticky();
  home_height();
  $(window).scroll(sticky);
});

$( window ).resize(function() {
  sticky();
  home_height();
  $(window).scroll(sticky);
});


function sticky() {

  var window_width = $(window).width();

  var description = $('.descrip_wrapper');
  var window_top= $(window).scrollTop();
  var div_top= $('.container').offset().top;

  var description_col_width = $('.descrip_col').width();
  var description_wrapper_width = description.width();
  var description_gutter = (description_col_width-description_wrapper_width)/2;

  if (window_width >800) {
    if (window_top > div_top-32) {
        description.addClass('stick');
    } 
    else {
        description.removeClass('stick');
    }

    $('.stick').css('left',description_gutter-24);
  }
}

function home_height() {

  var window_height = $(window).height();

  var header_height = $('header').outerHeight();
  var container = $('.container');

  container.css('height',window_height-header_height);
}


/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );



/*!
* Script to trigger the overlay
 */

(function() {
  var container = document.querySelector( 'div.container' ),
    triggerBttn = document.getElementById( 'trigger-overlay' ),
    menuBttn = document.querySelector( 'div.menu-btn' ),
    overlay = document.querySelector( 'div.overlay' ),
    header = document.querySelector('header'),
    closeBttn = overlay.querySelector( 'button.overlay-close' );
    transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    support = { transitions : Modernizr.csstransitions };

  function toggleOverlay() {
    if( classie.has( overlay, 'open' ) ) {
      classie.remove( overlay, 'open' );
      classie.remove( container, 'overlay-open' );
      classie.add( overlay, 'close' );
      classie.remove( header, 'none');
      classie.remove( menuBttn, 'cross');

      var onEndTransitionFn = function( ev ) {
        if( support.transitions ) {
          if( ev.propertyName !== 'visibility' ) return;
          this.removeEventListener( transEndEventName, onEndTransitionFn );
        }
        classie.remove( overlay, 'close' );
      };
      if( support.transitions ) {
        overlay.addEventListener( transEndEventName, onEndTransitionFn );
      }
      else {
        onEndTransitionFn();
      }
    }
    else if( !classie.has( overlay, 'close' ) ) {
      classie.add( overlay, 'open' );
      classie.add( container, 'overlay-open' );
      classie.add( header, 'none');
      classie.add( menuBttn, 'cross')
    }
  }

  triggerBttn.addEventListener( 'click', toggleOverlay );
  closeBttn.addEventListener( 'click', toggleOverlay );
})();
