Scoped.define("module:StickyHandler", [
    "base:Class",
    "base:Events.EventsMixin",
    "base:Maths",
    "browser:Events"
], function(Class, EventsMixin, Maths, DomEvents, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {
            /**
             * @param {HTMLElement} element
             * @param {HTMLElement} container
             * @param {Object} [options]
             * @param {boolean} [options.paused] - used to temporarily stop element from sticking to view
             */
            constructor: function(element, container, options) {
                inherited.constructor.call(this);
                this.element = element;
                this.container = container;
                this.paused = options.paused || false;
                this.events = this.auto_destroy(new DomEvents());
            },

            destroy: function() {
                if (this._elementObserver) this._elementObserver.disconnect();
                if (this._containerObserver) this._containerObserver.disconnect();
                inherited.destroy.call(this);
            },

            init: function() {
                this._initIntersectionObservers();
            },

            pause: function() {
                this.paused = true;
            },

            start: function() {
                this.paused = false;
            },

            isDragging: function() {
                return !!this.dragging;
            },

            stopDragging: function() {
                this.dragging = false;
            },

            elementWasDragged: function() {
                return !!this.__elementWasDragged;
            },

            _initIntersectionObservers: function() {
                var elementFirstObservation = true;
                var containerFirstObservation = true;
                this._elementObserver = new IntersectionObserver(elementCallback.bind(this));
                this._containerObserver = new IntersectionObserver(containerCallback.bind(this));

                function elementCallback(entries, observer) {
                    entries.forEach(function(entry) {
                        if (elementFirstObservation) {
                            elementFirstObservation = false;
                            return;
                        }
                        if (entry.isIntersecting || this.paused) return;
                        this.trigger("elementLeftView");
                        if (this._top) this.element.style.top = this._top;
                        if (this._left) this.element.style.left = this._left;
                        this._initEventListeners();
                    }.bind(this));
                }

                function containerCallback(entries, observer) {
                    entries.forEach(function(entry) {
                        if (containerFirstObservation) {
                            containerFirstObservation = false;
                            return;
                        }
                        if (!entry.isIntersecting) return;
                        this.trigger("containerEnteredView");
                        this.element.style.removeProperty("top");
                        this.element.style.removeProperty("left");
                        this.events.off(this.element, "mousedown touchstart");
                        this.dragging = false;
                    }.bind(this));
                }

                this._elementObserver.observe(this.element);
                this._containerObserver.observe(this.container);
            },

            _initEventListeners: function() {
                var lastX, lastY, diffX, diffY;
                this.events.on(this.element, "mousedown", mouseDownHandler, this);
                this.events.on(this.element, "touchstart", touchStartHandler, this);

                function mouseDownHandler(e) {
                    e = e || window.event;
                    e.preventDefault();
                    if (e.button !== 0) return;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    this.events.on(document, "mousemove", mouseMoveHandler, this);
                    this.events.on(document, "mouseup", mouseUpHandler, this);
                }

                function touchStartHandler(e) {
                    e = e || window.event;
                    e.preventDefault();
                    lastX = e.touches[0].clientX;
                    lastY = e.touches[0].clientY;
                    this.events.on(document, "touchmove", touchMoveHandler, this);
                    this.events.on(document, "touchend", touchEndHandler, this);
                }

                function mouseMoveHandler(e) {
                    e = e || window.event;
                    e.preventDefault();
                    diffX = lastX - e.clientX;
                    diffY = lastY - e.clientY;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    this.__elementWasDragged = true;
                    this.dragging = true;
                    this.element.style.top = Maths.clamp(this.element.offsetTop - diffY, 0, window.innerHeight - this.element.offsetHeight) + "px";
                    this.element.style.left = Maths.clamp(this.element.offsetLeft - diffX, 0, window.innerWidth - this.element.offsetWidth) + "px";
                    this._top = this.element.style.getPropertyValue("top");
                    this._left = this.element.style.getPropertyValue("left");
                }

                function touchMoveHandler(e) {
                    e = e || window.event;
                    e.preventDefault();
                    diffX = lastX - e.touches[0].clientX;
                    diffY = lastY - e.touches[0].clientY;
                    lastX = e.touches[0].clientX;
                    lastY = e.touches[0].clientY;
                    this.__elementWasDragged = true;
                    this.dragging = true;
                    this.element.style.top = Maths.clamp(this.element.offsetTop - diffY, 0, window.innerHeight - this.element.offsetHeight) + "px";
                    this.element.style.left = Maths.clamp(this.element.offsetLeft - diffX, 0, window.innerWidth - this.element.offsetWidth) + "px";
                    this._top = this.element.style.getPropertyValue("top");
                    this._left = this.element.style.getPropertyValue("left");
                }

                function mouseUpHandler() {
                    this.events.off(document, "mousemove mouseup");
                }

                function touchEndHandler() {
                    this.events.off(document, "touchmove touchend");
                }
            }
        };
    }]);
});