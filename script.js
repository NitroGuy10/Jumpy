/* 
	Key Codes:
	13 - Enter
	27 - Escape
	32 - Space
	37 - Left Arrow
	38 - Up Arrow
	39 - Right Arrow
	40 - Down Arrow
	Worlds:
	1 - Normal
	2 - Anti-gravity
	3 - Ice (Slippery ground)
	4 - Water (Low gravity)
	5 - Shadow (Does not delete character sprite after moving)
*/
(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();
var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
width = 480,
height = 280, 
player = {
	x: width-50,
	y: height-30,
	width: 30,
	height : 30,
	speed: 5,
	velX: 0,
	velY: 0,
	jumping: false,
	grounded: false
},
keys = [],
friction = 0.8,
gravity = 0.3,
stage = 0,
unlockedstages = 0,
world = 1,
boxes = [],
lvl = [
	[ //level 1
		[3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],[ //level 2
		[3,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[3,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,1,1,1,2,0,0,0,0,0,2,0,0,0,0,0,0,1,1],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0]
		],[ //level 3
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,3],
		[2,2,2,1,1,1,1,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0],
		[0,0,0,0,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,0,0],
		[0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,2,0,0,0,0,2,2,2],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0]
		],[ //level 4
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
		[2,0,0,0,2,3,3,3,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
		[2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,0,0,0,0,2,0,0,4,4,4,4,4,4,0,1,0,0,0,0,0]
		],[ //level 5
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,3],
		[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,4,4,0,0,4,4,4,4,4,0,0,0,4,4,0,0,0,0,0],
		[4,4,1,1,1,4,4,1,1,4,4,4,4,4,1,1,1,4,4,1,0,0,0,0]
		],[ //level 6
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,4,0,0,4,0],
		[4,4,0,0,0,0,0,0,1,0,0,0,1,0,4,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
		[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],[ //level 7
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,1,1,1,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
		[0,0,0,0,0,0,4,4,1,0,0,0,1,1,1,0,0,2,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
		[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,4],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
		[0,0,0,0,0,4,0,0,0,0,4,0,0,3,3,3,3,2,0,0,0,0,0,0],
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0]
		],[ //level 8
		[0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[5,5,5,5,5,5,2,2,2,2,0,0,0,0,0,0,0,4,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[4,4,4,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4]
		],[ //level 9
		[3,0,0,0,3,1,0,0,0,0,0,4,0,0,0,1,0,0,0,0,4,0,0,0],
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
		[1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,1,0,0,0,0,0,2,0,0,0,1,0,0,0,0,2,0,0,0],
		[0,0,0,0,0,1,0,0,0,0,5,5,5,5,5,1,0,0,0,1,5,5,5,5],
		[1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,1,0,0,0,0,1,0,0,0,2,1,0,0,0,1,0,0,0,0],
		[1,0,0,0,1,1,0,0,0,0,1,5,5,5,5,1,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,2,2],
		[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,5,5,5,5],
		[1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,1,2,2,0,0,0,0,0,0,1,0,0,0,0]
		],[ //level 10
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1,1,5,5,5],
		[0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,1,5,5,5],
		[0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,1,5,5,5],
		[5,5,5,5,1,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,1,5,5,5],
		[3,3,2,2,1,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,1,5,5,5],
		[0,0,0,2,1,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,1,5,5,5],
		[0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,1,5,5,5],
		[0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,1,5,5,5],
		[0,0,0,0,1,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1,5,5,5],
		[2,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1,5,5,5],
		[2,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1,5,5,5]
		],[ //level 11
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[3,3,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,2,2,2,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
		[0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[4,1,1,1,2,2,0,0,2,2,4,1,1,1,2,2,2,2,2,2,0,0,0,0]
		],[ //level 12
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],[ //level 13
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],[ //level 14
		[2,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,2,1,0,0,0,0,1],
		[2,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,2,1,0,0,0,0,0],
		[2,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,2,1,0,0,0,0,0],
		[2,0,0,1,2,0,0,0,0,0,0,0,0,0,2,0,0,2,1,2,0,0,0,0],
		[2,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,2,1,1,0,0,0,0],
		[2,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,2,1,0,0,0,0,0],
		[2,1,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,2,1,0,0,0,0,2],
		[2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,1,0,0,0,0,1],
		[2,0,0,0,1,1,1,1,1,1,1,1,1,1,2,0,0,0,1,0,0,0,0,0],
		[2,0,0,0,0,0,0,0,2,0,0,0,0,3,2,0,0,0,1,2,0,0,0,0],
		[2,0,0,0,0,0,0,0,0,0,0,0,0,3,2,0,0,0,1,1,0,0,0,0],
		[2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0],
		[2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0],
		[2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0]
		],[ //level 15
		[1,1,2,2,2,1,1,1,1,1,2,2,2,1,1,1,1,1,2,2,2,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
		[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],[ //level 16
		[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,0,0,1,1,1,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,0],
		[0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0],
		[0,1,1,0,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,0,0,1,0,0],
		[0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,0],
		[0,1,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],[ //level 17
		[0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,2,2,2,2,2,2,2,2,0,0,0,5,5,5,5,5,5,5,5,5,5,5],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[5,5,5,5,5,5,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,0,2,0,0,0,5,5,5,5,5,5,5,5,5,5,5],
		[0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
		[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
		],[ //level 18
		[3,3,3,3,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
		[0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
		[0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0],
		[0,0,0,0,2,1,0,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
		[0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
		[0,0,0,2,2,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
		[0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,2,1,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
		[0,0,2,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,2,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],[ //level 19
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,5,5,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],[ //level 20
		[0,0,0,0,0,3,3,3,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0],
		[2,2,2,2,0,0,0,0,0,2,2,2,2,2,0,0,0,2,0,0,2,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,2,0,0,2,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,2,2,2,2,2,2,2],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
		],[ //level !
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[5,5,2,1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,2],
		[0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,2],
		[0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,2],
		[0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2],
		[0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2],
		[0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
		[4,1,1,1,1,1,1,1,1,1,1,2,2,2,2,0,0,0,0,0,2,0,0,0]
		],[ //level :)
		[0,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0,1,0,0],
		[0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,0],
		[0,0,0,1,0,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0],
		[0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0],
		[0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0],
		[0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0],
		[0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0],
		[0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,1,1,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	]
];
makeLevel(0);
load();
lvlbuttons = document.getElementsByClassName("lvl");
if (location.hash == "#night")
document.body.style.backgroundColor = "#111111"; // For late night programming :)
boxes.push ({
	x: -10,
	y: 0,
	width: 10,
	height: height,
	color: "black"
});
boxes.push ({
	x: 0,
	y: height,
	width: width,
	height: 50,
	color: "black"
});
boxes.push ({
	x: width,
	y: 0,
	width: 50,
	height: height,
	color: "black"
});
boxes.push ({
	x: 0,
	y: -10,
	width: width,
	height: 10,
	color: "black"
});
canvas.width = width;
canvas.height = height;
function save() {
	var tempSavefile = JSON.stringify(unlockedstages);
	window.localStorage.setItem("savefile", tempSavefile);
}
function load() {
	if (window.localStorage.getItem("savefile")) {
		var tempSavefile = window.localStorage.getItem("savefile");		
		unlockedstages = JSON.parse(tempSavefile);		
	}
}
function deleteSave() {
	if (window.localStorage.getItem("savefile")) {
		window.localStorage.removeItem("savefile");	
	}
}
if (location.hash == "#unlockallthelevelsplzthx")
{
unlockedstages = 99;
gotoLevel(0);
}
else
{
gotoLevel(unlockedstages);
}
function update() {
	for (var i = 0; i < lvlbuttons.length; i++) {
		if (i > unlockedstages) {
			lvlbuttons[i].id = "locked";
			}else{
			lvlbuttons[i].id = "unlocked";
		}
	}
	if (keys[38] || keys[32] || keys[87]) { //Up
		if (!player.jumping && player.grounded) {
			player.jumping = true;
			player.grounded = false;
			if (world != 2) {
				player.velY = -player.speed*1.5;
				}else{
				player.velY = player.speed*1.5;
			}
		}
	}
	if (keys[39] || keys[68]) { //Right
		if (player.velX < player.speed) {player.velX++;}
	}
	if (keys[37] || keys[65]) { //Left
		if (player.velX > -player.speed) {player.velX--;}
	}
	player.velX *= friction;
	player.velY += gravity;
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	player.grounded = false;
	for (var i = 0; i < boxes.length; i++) {
		ctx.fillStyle = boxes[i].color;
		ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
		var dir = colCheck(player, boxes[i]);
		if (boxes[i].color == "black") {
			if (dir === "l" || dir === "r") {
				player.velX = 0;
				player.jumping = false;
				} else if (world != 2) {
				if (dir === "b") {
					player.grounded = true;
					player.jumping = false;
					} else if (dir === "t") {
					player.velY *= -1;
				}
				}else{
				if (dir === "t") {
					player.grounded = true;
					player.jumping = false;
					} else if (dir === "b") {
					player.velY *= -1;
				}
			}
		}
		if (boxes[i].color == "red") {
			if (dir) {
				player.velY = 0;
				switch (world) {
					case 1:
					player.y = height-30;
					player.x = width-50;
					break;
					case 2:
					player.y = 0;
					player.x = width-50;
					break;
					case 3:
					player.y = height-30;
					player.x = 20;
				}
			}
		}
		if (boxes[i].color == "purple") {
			if (dir) {
				player.jumping = true;
				player.grounded = false;
				player.velY = -player.speed*2;
			}
		}
		if (boxes[i].color == "gray") {
			if (dir === "t") {
				player.y = boxes[i].y-21;
				}else if (dir === "b") {
				player.grounded = true;
				player.jumping = false;
			}
		}
		if (boxes[i].color == "green") {
			if (dir) {
				boxes = [];
				boxes.push ({
					x: -10,
					y: 0,
					width: 10,
					height: height,
					color: "black"
				});
				boxes.push ({
					x: 0,
					y: height,
					width: width,
					height: 50,
					color: "black"
				});
				boxes.push ({
					x: width,
					y: 0,
					width: 50,
					height: height,
					color: "black"
				});
				boxes.push ({
					x: 0,
					y: -10,
					width: width,
					height: 10,
					color: "black"
				});
				stage++;
				makeLevel(stage);
				player.velY = 0;
				switch (world) {
					case 1:
					player.y = height-30;
					player.x = width-50;
					break;
					case 2:
					player.y = 0;
					player.x = width-50;
					break;
					case 3:
					player.y = height-30;
					player.x = 20;
				}
				if (unlockedstages < stage) {
					unlockedstages++;
					save();
				}
			}
		}
	}
	if (player.grounded) {
		player.velY = 0;
	}
	player.x += player.velX;
	player.y += player.velY;
	ctx.fill();
	ctx.fillStyle = "blue";
	ctx.fillRect(player.x, player.y, player.width, player.height);
	requestAnimationFrame(update);
}
function colCheck(shapeA, shapeB) {
	var vX = (shapeA.x + (shapeA.width/2)) - (shapeB.x + (shapeB.width/2)),
	vY = (shapeA.y + (shapeA.height/2)) - (shapeB.y + (shapeB.height/2)),
	hWidths = (shapeA.width/2) + (shapeB.width/2),
	hHeights = (shapeA.height/2) + (shapeB.height/2),
	colDir = null;
	if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
		var oX = hWidths - Math.abs(vX),
		oY = hHeights - Math.abs(vY);
		if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
				} else {
                colDir = "b";
                shapeA.y -= oY;
			}
			} else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
				} else {
                colDir = "r";
                shapeA.x -= oX;
			}
		}
	}
    return colDir;
}
document.body.addEventListener("keydown", function(e) {
	if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		e.preventDefault();
	}
	keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
});
window.addEventListener("load", function() {
	update();
});
function makeLevel(level) {
	if (level > 11 && level < 20) {
		world = 2;
		gravity = -0.3;
		friction = 0.8;
		canvas.style.backgroundColor = "#ffb3ff";
		}else if (level > 23 && level < 36) {
		world = 3;
		gravity = 0.3;
		friction = 1;
		canvas.style.backgroundColor = "#e6ffff";
		}else if (level == 20) {
		world = 1;
		gravity = 0.3;
		friction = 0.8;
		canvas.style.backgroundColor = "#bb0000";
		}else if (level == 21) {
		world = 1;
		gravity = 0.3;
		friction = 0.8;
		canvas.style.backgroundColor = "#88ff4d";
		}else{
		world = 1;
		gravity = 0.3;
		friction = 0.8;
		canvas.style.backgroundColor = "#cce6ff";
	}
	for (var i = 0; i < lvl[level].length; i++) {
		for (var j = 0; j < lvl[level][i].length; j++) {
			if (lvl[level][i][j] == 1) {
				boxes.push ({
					x: (j*20),
					y: (i*20),
					width: 20,
					height: 20,
					color: "black"
				});
			}
			if (lvl[level][i][j] == 2) {
				boxes.push ({
					x: (j*20),
					y: (i*20),
					width: 20,
					height: 20,
					color: "red"
				});
			}
			if (lvl[level][i][j] == 3) {
				boxes.push ({
					x: (j*20),
					y: (i*20),
					width: 20,
					height: 20,
					color: "green"
				});
			}
			if (lvl[level][i][j] == 4) {
				boxes.push ({
					x: (j*20),
					y: (i*20),
					width: 20,
					height: 20,
					color: "purple"
				});
			}
			if (lvl[level][i][j] == 5) {
				boxes.push ({
					x: (j*20),
					y: (i*20),
					width: 20,
					height: 20,
					color: "gray"
				});
			}
		}
	}
}
function gotoLevel(level) {
	if (level <= unlockedstages) {
		boxes = [];
		boxes.push ({
			x: -10,
			y: 0,
			width: 10,
			height: height,
			color: "black"
		});
		boxes.push ({
			x: 0,
			y: height,
			width: width,
			height: 50,
			color: "black"
		});
		boxes.push ({
			x: width,
			y: 0,
			width: 50,
			height: height,
			color: "black"
		});
		boxes.push ({
			x: 0,
			y: -10,
			width: width,
			height: 10,
			color: "black"
		});
		stage = level;
		makeLevel(stage);
		player.velY = 0;
		switch (world) {
			case 1:
			player.y = height-30;
			player.x = width-50;
			break;
			case 2:
			player.y = 0;
			player.x = width-50;
			break;
			case 3:
			player.y = height-30;
			player.x = 20;
		}
		window.scrollTo(0,0);
	}
}
