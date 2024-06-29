/* Util.js */
/* -------------------- */
// Utility function
function Util() {}

/*
	class manipulation functions
*/
Util.hasClass = function (el, className) {
	if (el.classList) return el.classList.contains(className);
	else
		return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
};

Util.addClass = function (el, className) {
	var classList = className.split(" ");
	if (el.classList) el.classList.add(classList[0]);
	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(" "));
};

Util.removeClass = function (el, className) {
    var classList = className.split(" ");
    if (el && el.classList) {
        el.classList.remove(classList[0]);
    } else if (el && Util.hasClass(el, classList[0])) {
        var reg = new RegExp("(\\s|^)" + classList[0] + "(\\s|$)");
        el.className = el.className.replace(reg, " ");
    }
    if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(" "));
};

Util.toggleClass = function (el, className, bool) {
	if (bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function (el, attrs) {
	for (var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
};

/*
  DOM manipulation
*/
Util.getChildrenByClassName = function (el, className) {
	var children = el.children,
		childrenByClass = [];
	for (var i = 0; i < el.children.length; i++) {
		if (Util.hasClass(el.children[i], className))
			childrenByClass.push(el.children[i]);
	}
	return childrenByClass;
};

/*
	Animate height of an element
*/
Util.setHeight = function (start, to, element, duration, cb) {
	var change = to - start,
		currentTime = null;

	var animateHeight = function (timestamp) {
		if (!currentTime) currentTime = timestamp;
		var progress = timestamp - currentTime;
		var val = parseInt((progress / duration) * change + start);
		element.setAttribute("style", "height:" + val + "px;");
		if (progress < duration) {
			window.requestAnimationFrame(animateHeight);
		} else {
			cb();
		}
	};

	//set the height of the element before starting animation -> fix bug on Safari
	element.setAttribute("style", "height:" + start + "px;");
	window.requestAnimationFrame(animateHeight);
};

/*
	Smooth Scroll
*/

Util.scrollTo = function (final, duration, cb) {
	var start = window.scrollY || document.documentElement.scrollTop,
		currentTime = null;

	var animateScroll = function (timestamp) {
		if (!currentTime) currentTime = timestamp;
		var progress = timestamp - currentTime;
		if (progress > duration) progress = duration;
		var val = Math.easeInOutQuad(progress, start, final - start, duration);
		window.scrollTo(0, val);
		if (progress < duration) {
			window.requestAnimationFrame(animateScroll);
		} else {
			cb && cb();
		}
	};

	window.requestAnimationFrame(animateScroll);
};

/*
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
	if (!element) element = document.getElementsByTagName("body")[0];
	element.focus();
	if (document.activeElement !== element) {
		element.setAttribute("tabindex", "-1");
		element.focus();
	}
};

/*
  Misc
*/

Util.getIndexInArray = function (array, el) {
	return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function (property, value) {
	if ("CSS" in window) {
		return CSS.supports(property, value);
	} else {
		var jsProperty = property.replace(/-([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
		return jsProperty in document.body.style;
	}
};

/*
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

//Custom Event() constructor
if (typeof window.CustomEvent !== "function") {
	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
}

/*
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d / 2;
	if (t < 1) return (c / 2) * t * t + b;
	t--;
	return (-c / 2) * (t * (t - 2) - 1) + b;
};

/* Main js */
/* -----------------*/
(function () {
	// Horizontal Timeline - by CodyHouse.co
	var HorizontalTimeline = function (element) {
		this.element = element;
		this.datesContainer = this.element.getElementsByClassName(
			"h--timeline-dates"
		)[0];
		this.line = this.datesContainer.getElementsByClassName("h--timeline-line")[0]; // grey line in the top timeline section
		this.fillingLine = this.datesContainer.getElementsByClassName(
			"h--timeline-filling-line"
		)[0]; // gold filling line in the top timeline section
		this.date = this.line.getElementsByClassName("h--timeline-date");
		this.selectedDate = this.line.getElementsByClassName(
			"h--timeline-date--selected"
		)[0];
		this.dateValues = parseDate(this);
		this.minLapse = calcMinLapse(this);
		this.navigation = this.element.getElementsByClassName(
			"h--timeline-navigation"
		);
		this.contentWrapper = this.element.getElementsByClassName(
			"h--timeline-events"
		)[0];
		this.content = this.contentWrapper.getElementsByClassName(
			"h--timeline-event"
		);

		this.eventsMinDistance = 60; // min distance between two consecutive events (in px)
		this.eventsMaxDistance = 140; // max distance between two consecutive events (in px)
		this.translate = 0; // this will be used to store the translate value of this.line
		this.lineLength = 0; //total length of this.line

		// store index of selected and previous selected dates
		this.oldDateIndex = Util.getIndexInArray(this.date, this.selectedDate);
		this.newDateIndex = this.oldDateIndex;

		initTimeline(this);
		initEvents(this);
	};

	function initTimeline(timeline) {
		// set dates left position
		var left = 0;
		for (var i = 0; i < timeline.dateValues.length; i++) {
			var j = i == 0 ? 0 : i - 1;
			var distance = daydiff(timeline.dateValues[j], timeline.dateValues[i]),
				distanceNorm =
					(Math.round(distance / timeline.minLapse) + 2) *
					timeline.eventsMinDistance,
				containerWidth = timeline.datesContainer.offsetWidth,
				distanceCorrecture = 0;

			if (distanceNorm < timeline.eventsMinDistance) {
				distanceNorm = timeline.eventsMinDistance;
			} else if (distanceNorm > timeline.eventsMaxDistance) {
				distanceNorm = timeline.eventsMaxDistance;
			}
			left = left + distanceNorm;
			timeline.date[i].setAttribute("style", "left:" + left + "px");
		}

		// set line/filling line dimensions
		timeline.line.style.width =
			left + timeline.eventsMinDistance + distanceCorrecture + "px";
		timeline.lineLength = left + timeline.eventsMinDistance + distanceCorrecture;

		// add 100px more to line/filling line if container bigger then timeline lineLength
		if (containerWidth > timeline.lineLength) {
			timeline.line.style.width =
				left + timeline.eventsMinDistance + distanceCorrecture + "px";
			timeline.lineLength = timeline.lineLength + distanceCorrecture;
		}

		// reveal timeline
		Util.addClass(timeline.element, "h--timeline--loaded");
		selectNewDate(timeline, timeline.selectedDate);
		resetTimelinePosition(timeline, "next");
	}

	function initEvents(timeline) {
		var self = timeline;
		// deactivate the buttons
		deaktivateNavigationButtons(self);

		// click on arrow navigation
		if (self.navigation[0]) {
			self.navigation[0].addEventListener("click", function (event) {
				event.preventDefault();
				translateTimeline(self, "prev");
				deaktivateNavigationButtons(self);
			});
		} else {
			console.log("self.navigation[0] is undefined");
		}

		if (self.navigation[1]) {
			self.navigation[1].addEventListener("click", function (event) {
				event.preventDefault();
				translateTimeline(self, "next");
				deaktivateNavigationButtons(self);
			});
		} else {
			console.log("self.navigation[1] is undefined");
		}

		// select a new event
		for (var i = 0; i < self.date.length; i++) {
			(function (i) {
				if (self.date[i]) {
					self.date[i].addEventListener("click", function (event) {
						event.preventDefault();
						selectNewDate(self, event.target);
					});
				} else {
					console.log("self.date[" + i + "] is undefined");
				}

				if (self.content[i]) {
					self.content[i].addEventListener("animationend", function (event) {
						if (i == self.newDateIndex && self.newDateIndex != self.oldDateIndex)
							resetAnimation(self);
					});
				} else {
					console.log("self.content[" + i + "] is undefined");
				}
			})(i);
		}
	}

	function updateFilling(timeline) {
		// update fillingLine scale value
		var dateStyle = window.getComputedStyle(timeline.selectedDate, null),
			left = dateStyle.getPropertyValue("left"),
			width = dateStyle.getPropertyValue("width");

		left = Number(left.replace("px", "")) + Number(width.replace("px", "")) / 2;
		timeline.fillingLine.style.transform =
			"scaleX(" + left / timeline.lineLength + ")";
	}

	function translateTimeline(timeline, direction) {
		// translate timeline (and date elements)
		var containerWidth = timeline.datesContainer.offsetWidth;
		if (direction) {
			timeline.translate =
				direction == "next"
					? timeline.translate - containerWidth + timeline.eventsMinDistance
					: timeline.translate + containerWidth - timeline.eventsMinDistance;
		}
		if (0 - timeline.translate > timeline.lineLength - containerWidth)
			timeline.translate = containerWidth - timeline.lineLength;
		if (timeline.translate > 0) timeline.translate = 0;

		timeline.line.style.transform = "translateX(" + timeline.translate + "px)";
		// update the navigation items status (toggle inactive class)
		timeline.translate == 0
			? Util.addClass(timeline.navigation[0], "h--timeline-navigation--inactive")
			: Util.removeClass(
					timeline.navigation[0],
					"h--timeline-navigation--inactive"
			  );
		timeline.translate == containerWidth - timeline.lineLength
			? Util.addClass(timeline.navigation[1], "h--timeline-navigation--inactive")
			: Util.removeClass(
					timeline.navigation[1],
					"h--timeline-navigation--inactive"
			  );
	}

	function deaktivateNavigationButtons(timeline) {
		var containerWidth = timeline.datesContainer.offsetWidth;
		// deaktivate next button if container bigger then timeline lineLength
		if (containerWidth >= timeline.lineLength) {
			Util.addClass(timeline.navigation[0], "h--timeline-navigation--inactive");
			Util.addClass(timeline.navigation[1], "h--timeline-navigation--inactive");
		}
	}

	function selectNewDate(timeline, target) {
		timeline.newDateIndex = Util.getIndexInArray(timeline.date, target);
		timeline.oldDateIndex = Util.getIndexInArray(timeline.date, timeline.selectedDate);

		if (timeline.selectedDate) {
			Util.removeClass(timeline.selectedDate, 'h--timeline-date--selected');
		}

		Util.addClass(timeline.date[timeline.newDateIndex], 'h--timeline-date--selected');
		timeline.selectedDate = timeline.date[timeline.newDateIndex];

		updateOlderEvents(timeline);
		updateVisibleContent(timeline);
		updateFilling(timeline);
	}


	function updateOlderEvents(timeline) {
		// update older events style
		for (var i = 0; i < timeline.date.length; i++) {
			i < timeline.newDateIndex
				? Util.addClass(timeline.date[i], "h--timeline-date--older-event")
				: Util.removeClass(timeline.date[i], "h--timeline-date--older-event");
		}
	}

	function updateVisibleContent(timeline) {
		var classEntering, classLeaving;
		if (timeline.newDateIndex > timeline.oldDateIndex) {
			classEntering = 'h--timeline-event--selected h--timeline-event--enter-right';
			classLeaving = 'h--timeline-event--leave-left';
		} else if (timeline.newDateIndex < timeline.oldDateIndex) {
			classEntering = 'h--timeline-event--selected h--timeline-event--enter-left';
			classLeaving = 'h--timeline-event--leave-right';
		} else {
			classEntering = 'h--timeline-event--selected';
			classLeaving = '';
		}

		if (timeline.content[timeline.newDateIndex]) {
			Util.addClass(timeline.content[timeline.newDateIndex], classEntering);
		} else {
			console.log('Content at new date index is undefined', timeline.newDateIndex);
		}

		if (timeline.newDateIndex != timeline.oldDateIndex && timeline.content[timeline.oldDateIndex]) {
			Util.removeClass(timeline.content[timeline.oldDateIndex], 'h--timeline-event--selected');
			Util.addClass(timeline.content[timeline.oldDateIndex], classLeaving);
		} else {
			console.log('Content at old date index is undefined or new date index is the same as old date index', timeline.oldDateIndex, timeline.newDateIndex);
		}
	}


	function resetAnimation(timeline) {
		if (timeline.content[timeline.newDateIndex]) {
			Util.removeClass(timeline.content[timeline.newDateIndex], 'h--timeline-event--enter-right h--timeline-event--enter-left');
		} else {
			console.log('Content at new date index is undefined in resetAnimation', timeline.newDateIndex);
		}

		if (timeline.content[timeline.oldDateIndex]) {
			Util.removeClass(timeline.content[timeline.oldDateIndex], 'h--timeline-event--leave-right h--timeline-event--leave-left');
		} else {
			console.log('Content at old date index is undefined in resetAnimation', timeline.oldDateIndex);
		}
	}


	function keyNavigateTimeline(timeline, direction) {
		// navigate the timeline using the keyboard
		var newIndex =
			direction == "next" ? timeline.newDateIndex + 1 : timeline.newDateIndex - 1;
		if (newIndex < 0 || newIndex >= timeline.date.length) return;
		selectNewDate(timeline, timeline.date[newIndex]);
		resetTimelinePosition(timeline, direction);
	}

	function resetTimelinePosition(timeline, direction) {
		//translate timeline according to new selected event position
		var eventStyle = window.getComputedStyle(timeline.selectedDate, null),
			eventLeft = Number(eventStyle.getPropertyValue("left").replace("px", "")),
			timelineWidth = timeline.datesContainer.offsetWidth;

		if (
			(direction == "next" && eventLeft >= timelineWidth - timeline.translate) ||
			(direction == "prev" && eventLeft <= -timeline.translate)
		) {
			timeline.translate = timelineWidth / 2 - eventLeft;
			translateTimeline(timeline, false);
		}
	}

	function parseDate(timeline) {
		// get timestamp value for each date
		var dateArrays = [];
		for (var i = 0; i < timeline.date.length; i++) {
			var singleDate = timeline.date[i].getAttribute("data-date"),
				dateComp = singleDate.split("T");

			if (dateComp.length > 1) {
				//both DD/MM/YEAR and time are provided
				var dayComp = dateComp[0].split("/"),
					timeComp = dateComp[1].split(":");
			} else if (dateComp[0].indexOf(":") >= 0) {
				//only time is provide
				var dayComp = ["2000", "0", "0"],
					timeComp = dateComp[0].split(":");
			} else {
				//only DD/MM/YEAR
				var dayComp = dateComp[0].split("/"),
					timeComp = ["0", "0"];
			}
			var newDate = new Date(
				dayComp[2],
				dayComp[1] - 1,
				dayComp[0],
				timeComp[0],
				timeComp[1]
			);
			dateArrays.push(newDate);
		}
		return dateArrays;
	}

	function calcMinLapse(timeline) {
		// determine the minimum distance among events
		var dateDistances = [];
		for (var i = 1; i < timeline.dateValues.length; i++) {
			var distance = daydiff(timeline.dateValues[i - 1], timeline.dateValues[i]);
			if (distance > 0) dateDistances.push(distance);
		}

		return dateDistances.length > 0
			? Math.min.apply(null, dateDistances)
			: 86400000;
	}

	function daydiff(first, second) {
		// time distance between events
		return Math.round(second - first);
	}

	window.HorizontalTimeline = HorizontalTimeline;

	var horizontalTimeline = document.getElementsByClassName("js-h--timeline"),
		horizontalTimelineTimelineArray = [];
	if (horizontalTimeline.length > 0) {
		for (var i = 0; i < horizontalTimeline.length; i++) {
			horizontalTimelineTimelineArray.push(
				new HorizontalTimeline(horizontalTimeline[i])
			);
		}
		// navigate the timeline when inside the viewport using the keyboard. You can use the left and right arrows
		document.addEventListener("keydown", function (event) {
			if (
				(event.keyCode && event.keyCode == 39) ||
				(event.key && event.key.toLowerCase() == "arrowright")
			) {
				updateHorizontalTimeline("next"); // move to next event
			} else if (
				(event.keyCode && event.keyCode == 37) ||
				(event.key && event.key.toLowerCase() == "arrowleft")
			) {
				updateHorizontalTimeline("prev"); // move to prev event
			}
		});
	}

	function updateHorizontalTimeline(direction) {
		for (var i = 0; i < horizontalTimelineTimelineArray.length; i++) {
			if (elementInViewport(horizontalTimeline[i]))
				keyNavigateTimeline(horizontalTimelineTimelineArray[i], direction);
		}
	}

	/*
		How to tell if a DOM element is visible in the current viewport?
		http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
	*/
	function elementInViewport(el) {
		var top = el.offsetTop;
		var left = el.offsetLeft;
		var width = el.offsetWidth;
		var height = el.offsetHeight;

		while (el.offsetParent) {
			el = el.offsetParent;
			top += el.offsetTop;
			left += el.offsetLeft;
		}

		return (
			top < window.pageYOffset + window.innerHeight &&
			left < window.pageXOffset + window.innerWidth &&
			top + height > window.pageYOffset &&
			left + width > window.pageXOffset
		);
	}
})();
