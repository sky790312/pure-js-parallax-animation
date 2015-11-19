!function() {

	/* settings */
	var pagesObj = [],
			active, prev,
			animateStop,
			animateId = 0,
			perspective = 6,
			timeStep = 0.05,
			pointer = {
				x: 0,
				y: 0
			},
			screen = {
				w: 0,
				h: 0
			},
			position = {
				x: 0,
				y: 0
			},
			target = {
				x: 0,
				y: 0
			},
			parallax = {
				x: 0,
				y: 0
			};


	/* funtions */

	// run the parallax animation
	function run()
	{
		animateId = requestAnimationFrame(run);
    animateStop = false;
		parallax.x += (pointer.x - parallax.x) * (timeStep * 0.5);
		parallax.y += (pointer.y - parallax.y) * (timeStep * 0.5);
		position.x += (target.x - position.x) * timeStep;
		position.y += (target.y - position.y) * timeStep;
		for (var i = 0, n = pagesObj.length; i < n; i++)
		{
			var eachPage = pagesObj[i];
			if (eachPage.visible)
			{
				for (var j = 0, m = eachPage.nodes.length; j < m; j++)
				{
					var eachPageElem = eachPage.nodes[j];
					var transform = 'matrix(1, 0, 0, 1,' + ((eachPage.x - parallax.x * 0.5 - position.x) * eachPageElem.animateValue) + ',' +
																							((eachPage.y - parallax.y * 0.5 - position.y) * eachPageElem.animateValue) + ')';
					eachPageElem.css.transform = eachPageElem.css.webkitTransform = transform;
				}
			}
		}
	}

	// stop the parallax animation
	function stop()
	{
		if (animateId) {
      window.cancelAnimationFrame(animateId);
	    animateStop = true;
    }
	}

	// go to next page
	function goto (hashId)
	{
		for (var i = 0, n = pagesObj.length; i < n; i++)
		{
			if (pagesObj[i].id == hashId)
			{
				prev = active;
				active = pagesObj[i];
				target.x = active.x;
				target.y = active.y;
				if (prev) {
					setTimeout(function()
					{
						prev.elem.style.visibility = "hidden";
						prev.visible = false;
					}, 800);
				}
				active.elem.style.visibility = "visible";
				active.visible = true;
				return;
			}
		}
	}

	// init this animaion setting
	function init() {
		var pages = document.querySelectorAll('.page');

		for (var i = 0, n = pages.length; i < n; i++)
		{
			var eachPage = pages[i];
			var eachPageObj = {
				elem: eachPage,
				id: eachPage.id,
				x: eachPage.offsetLeft,
				y: eachPage.offsetTop,
				visible: false,
				nodes: []
			};
			pagesObj.push(eachPageObj);
			eachPage.style.position = 'static';

			//get all elements inside pages to parallax animation
			var elems = eachPage.getElementsByTagName('*');

			for (var j = 0, m = elems.length; j < m; j++)
			{
				var eachElem = elems[j];
				if (eachElem.className.indexOf('prx') >= 0)
				{
					eachPageObj.nodes.push(
					{
						css: eachElem.style,
						animateValue: Math.min(perspective, perspective / (perspective + 1)),
					});
				}
			}
		}
	}

	// get about current window
	function resize()
	{
		screen.w = document.body.offsetWidth;
		screen.h = document.body.offsetHeight;
	}


	/* event listeners */

	// mousemove event
	window.addEventListener("mousemove", function(e)
	{
		e.preventDefault();
		pointer.x = e.clientX - screen.w * 0.5;
		pointer.y = e.clientY - screen.h * 0.5;
	}, false);

	// window resize event
	window.addEventListener("resize", resize, false);

	// hash change event
	window.addEventListener("hashchange", function()
	{
		goto(location.hash);
		return false;
	}, false);

	// trigger start animation
	document.getElementById("start").addEventListener("click", run);

	// trigger stop animation
	document.getElementById("stop").addEventListener("click", stop);


	/* start all of this parallax animation */
	resize();
	init();
	run();

	if (location.hash !== '' && location.hash !== "#")
		goto(location.hash);
	else
		window.location.hash = "#main-page";
}();
