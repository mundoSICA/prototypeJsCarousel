PrototypeJS Carousel
========================================================================================

This script makes it easy to create a sliding carousel component.

This script uses the Prototype javascript framework and the effects.js library from Scriptaculous. You must include Prototype version 1.7+ in your pages before including this script. This library is known to work in recent versions of IE 6/7, FireFox, Opera and Safari.


Options
------------------------------------------------------------------------------------------


You can create multiple carousels on one page.

	var some_carousel = new Carousel('some-carousel');
	var some_carousel2 = new Carousel('some-carousel2');
	var other_carousel = new Carousel('other-carousel');
	
You can determine which section will be scrolled to initially by using the `initialSection` option:

	var my_carousel = new Carousel('my-carousel', {initialSection: 'section4'});

You can make the Carousel periodically update by using the `scrollDuration`(default 1.0seconds) and `sectionDuration`(default 3.0seconds) options:

	var my_carousel = new Carousel('my-carousel', {scrollDuration: 0.5, sectionDuration: 4});
