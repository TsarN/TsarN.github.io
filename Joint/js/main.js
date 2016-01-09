var shapes = 
// 0 - нет
// 1 - рыба
// 2 - медведь
// 3 - пусто
[
	[[2, 3], [3, 0]],
	[[3, 1], [2, 0]],
	[[1, 2], [3, 0]],
	[[3, 2], [1, 0]],
	[[1, 1], [0, 0]],
	[[1, 2], [0, 0]]
]


var colors = 
[
	"gray", "blue", "green", "gray"
]

function createShape(id)
{
	var shape = new createjs.Shape();
	var hit = new createjs.Shape();
	shape.graphics.setStrokeStyle(3);
	shape.rot = 0;
	if (shapes[id][1][0] == 0) // Line
	{
		shape.graphics
			.beginStroke(colors[shapes[id][0][0]]).drawCircle(0, 0, 30)
			.beginStroke("gray").moveTo(30, 0).lineTo(70, 0)
			.beginStroke(colors[shapes[id][0][1]]).drawCircle(100, 0, 30)

		hit.graphics.beginFill("#000").drawRect(-30, -30, 160, 60);
	}
	else // Triangle
	{
		shape.graphics
			.beginStroke(colors[shapes[id][0][0]]).drawCircle(0, 0, 30)
			.beginStroke("gray").moveTo(30, 0).lineTo(70, 0)
			.beginStroke(colors[shapes[id][0][1]]).drawCircle(100, 0, 30)
			.beginStroke("gray").moveTo(0, -30).lineTo(0, -70)
			.beginStroke(colors[shapes[id][1][0]]).drawCircle(0, -100, 30);
		hit.graphics.beginFill("#000").drawRect(-30, -30, 160, 60);
		hit.graphics.beginFill("#000").drawRect(-30, 30, 60, -160);
	}

	shape.hitArea = hit;
	shape.shapeId = id;

	return shape;
}


window.init = function()
{
	var stage = new createjs.Stage("game-canvas");

	var rawField = [
		[2, 2, 1, 2],
		[0, 1, 2, 0],
		[1, 2, 1, 1],
		[1, 1, 1, 2]
	]

	var field = Array();

	for (var i = 0; i < 4; ++i)
	{
		field.push(Array(4));
		for (var j = 0; j < 4; ++j)
		{
			var circle = new createjs.Shape();

			circle.graphics.beginFill(colors[rawField[j][i]]).drawCircle(0, 0, 20);
			circle.x = 50 + i * 100;
			circle.y = 50 + j * 100;

			stage.addChild(circle);
			field[i][j] = circle;
		}
	}

	var renderShapes = Array(shapes.length);
	var selectedShape = -1;
	var blockMove = false;
	for (var i = 0; i < shapes.length; ++i)
	{
	 	var x = createShape(i);
	 	x.x = (i % 2 + 1) * 200 + 250;
	 	x.y = (Math.floor(i / 2) * 200) + 150 - (100 * (i > 3));

	 	x.initialX = x.x;
	 	x.initialY = x.y;

	 	//x.shapeId = i;

	 	x.on("mousedown", function(evt) {
	 		if (evt.nativeEvent.button == 2)
	 		{
	 			if ((evt.target.x != evt.target.initialX) || (evt.target.y != evt.target.initialY))
	 			{
	 				evt.target.x = evt.target.initialX;
	 				evt.target.y = evt.target.initialY;
	 				blockMove = true;
	 				return;
	 			}
	 			evt.target.rot += 90;
	 			evt.target.rot = evt.target.rot % 360;
	 			if (shapes[evt.target.shapeId][1][0] == 0)
	 			{
	 				if (evt.target.rot == 180)
	 					evt.target.rot = 0;

	        		evt.target.setTransform(evt.target.x, evt.target.y,
	        		1, 1, evt.target.rot);
	        		blockMove = true;
	 				return;
	 			}

	 			if (evt.target.rot == 0)
	 			{
	 				evt.target.initialX -= 100;
	 			}

	 			if (evt.target.rot == 90)
	 			{
	 				evt.target.initialY -= 100;
	 			}

	 			if (evt.target.rot == 180)
	 			{
	 				evt.target.initialX += 100;
	 			}

	 			if (evt.target.rot == 270)
	 			{
	 				evt.target.initialY += 100;
	 			}


	        	evt.target.x = evt.target.initialX;
	        	evt.target.y = evt.target.initialY;

	        	evt.target.setTransform(evt.target.x, evt.target.y,
	        	1, 1, evt.target.rot);

	        	blockMove = true;
	 		}
	 	})

		x.on("pressmove", function(evt) {
			if (blockMove)
				return;
			evt.target.x = evt.stageX;
			evt.target.y = evt.stageY;
			selectedShape = evt.target.shapeId;
		});

		x.on("pressup", function(evt) {
			if (!((Math.round((evt.target.x - 50) / 100) < 0) || 
				(Math.round((evt.target.x - 50) / 100) > 3) ||
				(Math.round((evt.target.y - 50) / 100) < 0) ||
				(Math.round((evt.target.y - 50) / 100) > 3)))
			{
				evt.target.x = Math.round((evt.target.x - 50) / 100) * 100 + 50;
				evt.target.y = Math.round((evt.target.y - 50) / 100) * 100 + 50;
			}
			else
			{
				evt.target.x = evt.target.initialX;
				evt.target.y = evt.target.initialY;
			}
			selectedShape = -1;
			blockMove = false;
		})

		canvas = document.getElementsByTagName("canvas");

		stage.addChild(x);

		renderShapes[i] = x;

	}

	var background = new createjs.Shape();
	var elementBackground = new createjs.Shape();
	var backImg = new Image();
	backImg.src = "img/background.jpg";;

	backImg.onload = function()
	{
		background.graphics.beginBitmapFill(backImg).drawRect(0, 0, 800, 600);
		background.x = 0;
		background.y = 0;
		stage.addChild(background);
		stage.setChildIndex(background, 0);

		stage.update();
		setInterval(function () {
			stage.update();
		}, 1000/60);
	}

	$('canvas').bind('contextmenu', function(e){
    	return false;
	}); 
}
