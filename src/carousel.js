/**
 * @author Fitorec <programacion@mundosica.com>
 * @copyright 2011 SICÁ (tm)
 * @package Carousel
 * @license MIT
 * @url https://github.com/mundoSICA/prototypeJsCarousel
 * @url-base http://code.google.com/p/missingmethod-projects/
 * @version 0.0.1
 * @dependencies prototype.js 1.7+, effects.js
 */

Carousel = Class.create();
Object.extend(Object.extend(Carousel.prototype, Abstract.prototype), {
	initialize: function(wrapper, options){
		var defaultOptions = {scrollDuration: 1.0, sectionDuration: 3, autoStar: true, initialSection: false};
	    this.scrolling  = false;
	    this.wrapper    = $(wrapper);
	    this.scroller   = this.wrapper.down('div.scroller');
	    this.sections   = this.wrapper.getElementsBySelector('div.section');
	    this.options    = Object.extend(defaultOptions, options || {});

	    this.sections.each( function(section, index) {
	      section._index = index;
	    });

	    this.events = {
	      click: this.click.bind(this)
	    };
	    this.addObservers();
			// initialSection should be the id of the section you want to show up on load
			if(!this.options.initialSection)
				this.options.initialSection = this.sections[0].id;
			this.moveTo(this.options.initialSection, this.scroller, { scrollDuration:this.options.scrollDuration });
			if(this.options.autoStar)
				this.start();
	  },
	
  addObservers: function() {
    var controls = this.wrapper.getElementsBySelector('ul.controls li a');
    controls.invoke('observe', 'click', this.events.click);
  },

  click: function(event) {
		this.stop();
    var element = Event.findElement(event, 'a');
    if (this.scrolling) this.scrolling.cancel();
    
    this.moveTo(element.href.split("#")[1], this.scroller, { scrollDuration:this.options.scrollDuration });
    Event.stop(event);
  },

	moveTo: function(element, container, options){
			this.current = $(element);
			var id_element = this.current.id;
			this.wrapper.getElementsBySelector('ul.controls li a').each( function(ctrLink) {
				if(ctrLink.href.split('#')[1] == id_element ){
					ctrLink.addClassName('active');
				}else
					ctrLink.removeClassName('active');
			});
			this.current = $(element);

			Position.prepare();
	    var containerOffset = Position.cumulativeOffset(container),
	     elementOffset = Position.cumulativeOffset($(element));

		  this.scrolling = new Effect.SmoothScroll(container, 
				{duration:options.scrollDuration, x:(elementOffset[0]-containerOffset[0]), y:(elementOffset[1]-containerOffset[1])});
		  return false;
		},
		
  next: function(){
    if (this.current) {
      var currentIndex = this.current._index;
      var nextIndex = (this.sections.length - 1 == currentIndex) ? 0 : currentIndex + 1;
    } else var nextIndex = 1;

    this.moveTo(this.sections[nextIndex], this.scroller, { 
      scrollDuration: this.options.scrollDuration
    });
  },
	
  previous: function(){
    if (this.current) {
      var currentIndex = this.current._index;
      var prevIndex = (currentIndex == 0) ? this.sections.length - 1 : 
       currentIndex - 1;
    } else var prevIndex = this.sections.length - 1;
    
    this.moveTo(this.sections[prevIndex], this.scroller, { 
      scrollDuration: this.options.scrollDuration
    });
  },

	stop: function()
	{
		clearTimeout(this.timer);
	},
	
	start: function()
	{
		this.periodicallyUpdate();
	},
		
	periodicallyUpdate: function()
	{
		if (this.timer != null) {
			clearTimeout(this.timer);
			this.next();
		}
		this.timer = setTimeout(this.periodicallyUpdate.bind(this), this.options.sectionDuration*1000);
	}

});

Effect.SmoothScroll = Class.create();
Object.extend(Object.extend(Effect.SmoothScroll.prototype, Effect.Base.prototype), {
  initialize: function(element) {
    this.element = $(element);
    var options = Object.extend({
      x:    0,
      y:    0,
      mode: 'absolute'
    } , arguments[1] || {}  );
    this.start(options);
  },
  setup: function() {
    if (this.options.continuous && !this.element._ext ) {
      this.element.cleanWhitespace();
      this.element._ext=true;
      this.element.appendChild(this.element.firstChild);
    }
   
    this.originalLeft=this.element.scrollLeft;
    this.originalTop=this.element.scrollTop;
   
    if(this.options.mode == 'absolute') {
      this.options.x -= this.originalLeft;
      this.options.y -= this.originalTop;
    } 
  },
  update: function(position) {   
    this.element.scrollLeft = this.options.x * position + this.originalLeft;
    this.element.scrollTop  = this.options.y * position + this.originalTop;
  }
});
