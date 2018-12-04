/* 
	Goals for new level creator:
	Allow painting (holding down mouse to change multiple tiles)
	Have a pallate to switch block types
	
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
worldstring = "Normal",
selectedType = 1,
boxes = [],
lvl = [[ // 14h x 24w
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]
];
makeLevel(0);
unlockedstages = document.cookie.slice(6);
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
function update() {
	if (keys[38] || keys[32]) { //Up
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
	if (keys[39]) { //Right
		if (player.velX < player.speed) {player.velX++;}
	}
	if (keys[37]) { //Left
		if (player.velX > -player.speed) {player.velX--;}
	}
	player.velX *= friction;
	player.velY += gravity;
	if (world != 5)
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
				if (world == 2) {
					player.y = 0;
					player.x = width-50;
					}else{
					player.y = height-30;
					player.x = width-50;
				}
				if (world == 5)
				ctx.clearRect(0, 0, width, height);
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
				makeLevel(0);
				player.velY = 0;
				if (world == 2) {
					player.y = 0;
					player.x = width-50;
					}else{
					player.y = height-30;
					player.x = width-50;
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
var isMouseDown = 0;
function mousedown(event) {
	isMouseDown = 1;
}
function mouseup(event) {
	isMouseDown = 0;
}
document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
function paletteSelect(choice)
{
	document.getElementsByClassName("choice" + selectedType)[0].style.backgroundColor = "#DDDDDD";
	document.getElementsByClassName("choice" + choice)[0].style.backgroundColor = "#AAAAAA";
	selectedType = choice;
}
function makeLevel(level) {
	switch (world) {
		case 1:
		gravity = 0.3;
		friction = 0.8;
		canvas.style.backgroundColor = "#cce6ff";
		break;
		
		case 2:
		gravity = -0.3;
		friction = 0.8;
		canvas.style.backgroundColor = "#ffb3ff";
		break;
		
		case 3:
		gravity = 0.3;
		friction = 1;
		canvas.style.backgroundColor = "#e6ffff";
		break;
		
		case 4:
		gravity = 0.2;
		friction = 0.8;
		canvas.style.backgroundColor = "#000099";
		break;
		
		case 5:
		gravity = 0.3;
		friction = 0.8;
		canvas.style.backgroundColor = "#4d4d4d";
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
function incWorld(wld) {
	if (wld != undefined) {
		world = wld;
		}else{
		if (world == 5) {
			world = 1;
			}else{
			world++;
		}
	}
	makeLevel(0);
	switch (world) {
		case 1:
		worldstring = "Normal";
		break;
		
		case 2:
		worldstring = "Anti-Gravity";
		break;
		
		case 3:
		worldstring = "Ice";
		break;
		
		case 4:
		worldstring = "Water";
		break;
		
		case 5:
		worldstring = "Shadow";
	}
	document.getElementById("worldbutton").innerHTML = worldstring;
}
function getCellId(celly, cellx) {
	var cx0, cy0 = false;
	if (celly.toString().length == 1) {
		cy0 = true;
	}
	if (cellx.toString().length == 1) {
		cx0 = true;
	}
	if (!cy0 && !cx0) {
		return celly.toString() + cellx.toString();
	}
	if (cy0 && !cx0) {
		lvl[0][cellx][celly] = selectedType;
		return "0" + celly.toString() + cellx.toString();
	}
	if (!cy0 && cx0) {
		return celly.toString() + "0" + cellx.toString();
	}
	if (cy0 && cx0) {
		return "0" + celly.toString() + "0" + cellx.toString();
	}
}
function edit(celly, cellx) {
	if (isMouseDown == 1 || arguments[2])
	{
		var cx0, cy0 = false;
		if (celly.toString().length == 1) {
			cy0 = true;
		}
		if (cellx.toString().length == 1) {
			cx0 = true;
		}
		if (!cy0 && !cx0) {
			lvl[0][cellx][celly] = selectedType;
			document.getElementById(celly.toString() + cellx.toString()).className = "c"+lvl[0][cellx][celly];
		}
		if (cy0 && !cx0) {
			lvl[0][cellx][celly] = selectedType;
			document.getElementById("0" + celly.toString() + cellx.toString()).className = "c"+lvl[0][cellx][celly];
		}
		if (!cy0 && cx0) {
			lvl[0][cellx][celly] = selectedType;
			document.getElementById(celly.toString() + "0" + cellx.toString()).className = "c"+lvl[0][cellx][celly];
		}
		if (cy0 && cx0) {
			lvl[0][cellx][celly] = selectedType;
			document.getElementById("0" + celly.toString() + "0" + cellx.toString()).className = "c"+lvl[0][cellx][celly];
		}
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
		makeLevel(0);
		player.velY = 0;
		if (world == 2) {
			player.y = 0;
			player.x = width-50;
			}else{
			player.y = height-30;
			player.x = width-50;
		}
	}
}
function updateEditor() {
	for (celly = 0; celly < 24; celly++) {
		for (cellx = 0; cellx < 14; cellx++) {
			var cx0 = false;
			var cy0 = false;
			if (celly.toString().length == 1) {
				cy0 = true;
			}
			if (cellx.toString().length == 1) {
				cx0 = true;
			}
			if (!cy0 && !cx0) {
				document.getElementById(celly.toString() + cellx.toString()).className = "c"+lvl[0][cellx][celly];
			}
			if (cy0 && !cx0) {
				document.getElementById("0" + celly.toString() + cellx.toString()).className = "c"+lvl[0][cellx][celly];
			}
			if (!cy0 && cx0) {
				document.getElementById(celly.toString() + "0" + cellx.toString()).className = "c"+lvl[0][cellx][celly];
			}
			if (cy0 && cx0) {
				document.getElementById("0" + celly.toString() + "0" + cellx.toString()).className = "c"+lvl[0][cellx][celly];
			}
		}
	}
}
function unload() {
    return "Your level will NOT be saved if you exit.";
}
function clearLvl(bypass) {
	if (bypass)
	var clrconf = true;
	else
	var clrconf = confirm("Are you sure you want to clear your current level?");
	if(clrconf) {
		for (var i = 0; i < lvl[0].length; i++) {
			for (var j = 0; j < lvl[0][i].length; j++) {
				lvl[0][i][j] = 0;
			}
			}
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
		player.velY = 0;
		if (world == 2) {
		player.y = 0;
		player.x = width-50;
		}else{
		player.y = height-30;
		player.x = width-50;
		}
		}
		updateEditor();
		}
		function save() {
		document.getElementById("slbox").value = world.toString() + "," + lvl[0].toString();
		window.scrollTo(0, 800);
		}
		function load() {
		var clrldconf = confirm("Are you sure you want to clear your current level?");
		if (clrldconf) {
		safeLoad = true;
		var loadstr = document.getElementById("slbox").value;
		for (lstrn = 0; lstrn < 673; lstrn += 2) {
		if (isNaN(Number(loadstr[lstrn])) || Number(loadstr[lstrn]) > 5)
		safeLoad = false;
		}
		if (loadstr[0] == 0)
		safeLoad = false;
		for (lstrn = 1; lstrn < 673; lstrn += 2) {
		if (loadstr[lstrn] != ",")
		safeLoad = false;
		}
		if (safeLoad) {
		incWorld(Number(loadstr[0]));
		loadstr = loadstr.slice(2);
		lvl[0][0] = loadstr.slice(0,47).split(",");
		lvl[0][1] = loadstr.slice(48,95).split(",");
		lvl[0][2] = loadstr.slice(96,143).split(",");
		lvl[0][3] = loadstr.slice(144,191).split(",");
		lvl[0][4] = loadstr.slice(192,239).split(",");
		lvl[0][5] = loadstr.slice(240,287).split(",");
		lvl[0][6] = loadstr.slice(288,335).split(",");
		lvl[0][7] = loadstr.slice(336,383).split(",");
		lvl[0][8] = loadstr.slice(384,431).split(",");
		lvl[0][9] = loadstr.slice(432,479).split(",");
		lvl[0][10] = loadstr.slice(480,527).split(",");
		lvl[0][11] = loadstr.slice(528,575).split(",");
		lvl[0][12] = loadstr.slice(576,623).split(",");
		lvl[0][13] = loadstr.slice(624,671).split(",");
		ctx.clearRect(0, 0, width, height);
		makeLevel(0);
		player.velY = 0;
		if (world == 2) {
		player.y = 0;
		player.x = width-50;
		}else{
		player.y = height-30;
		player.x = width-50;
		}
		updateEditor();
		window.scrollTo(0, 0);
		}
		if (!safeLoad) {
		alert("Incorrect level formatting.");
		clearLvl(true);
		world = 1;
		}
		}
		}
				
