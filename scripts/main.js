var stage,
	world,
	hero,
	oldX, oldY,
	angleLabel,
	line,
	stageWidth,
	stageHeight,
	backgroundPath = "assets/images/background.jpg",
	heroPath = "assets/images/monkey.gif",
	bananaPath = "assets/images/banana.png",
	image,
	back;

var KEYCODE_LEFT = 37, 
	KEYCODE_RIGHT = 39,
	KEYCODE_UP = 38, 
	KEYCODE_DOWN = 40,
	KEYCODE_SPACE = 32,
	SPIN_SPEED = 60,
	HERO_SPEED = 30,
	WORLD_HEIGTH = 800,
	WORLD_WIDTH = 800;
          
function init() {

	stage = new createjs.Stage("demoCanvas");

	setupStage()

	window.addEventListener('resize', resize, false);

	hero = new createjs.Bitmap(heroPath)

	hero.regX = 80;
	hero.regY = 81;

	hero.x = 0;
	hero.y = 0;

	hero.bananas = []
	//world.addChild(hero)
	stage.addChild(hero);
	stage.update();

	/*****
	angleLabel = new createjs.Text("Hello World", "15px Arial", "#ccc");
	angleLabel.x = - stage.canvas.width / 2 + 10;
	angleLabel.y = stage.canvas.height / 2 - 10;
	angleLabel.textBaseline = "alphabetic";
	stage.addChild(angleLabel)
	***/

	this.document.onkeydown = keyPressed;
	this.document.onclick = onClick;

	createjs.Ticker.addEventListener("tick", handleTick)

	stage.on("stagemousemove", function(event){

		if(oldX) {
			var angle = findAngle(event.stageX - stageWidth/2, event.stageY - stageHeight/2)
			hero.rotation = angle;
			//console.log(angle)
		}

		oldX = event.stageX;
		oldY = event.stageY;
	})

}

function onClick(event){

	fireBanana()

}

function fireBanana(){

	var banana = new createjs.Bitmap(bananaPath)
	banana.x = hero.x;
	banana.y = hero.y;

	banana.regX = 130 / 2;
	banana.regY = 61 / 2;
	banana.direction = hero.rotation;

	hero.bananas.push(banana);

	stage.addChild(banana);

	var x = - Math.cos(Math.radians(banana.direction)) * 500
	var y = - Math.sin(Math.radians(banana.direction)) * 500
	console.log("x = " + x + " y = " + y);

	var tween = createjs.Tween.get(banana)
		.to({x:x, y:y}, 1000)
		.wait(300)
		.to({alpha:0,visible:false},1000)
		.call(function(data){
			var i = hero.bananas.indexOf(data.target);
			
			if(i > -1){
				hero.bananas.splice(i,1);
			}

			stage.removeChild(banana);
			stage.update();
		});

	stage.update()

}

function handleTick(event) {
	//hero.x += 1;
	//stage.update();
	hero.bananas.forEach(function(banana,idex){
		banana.rotation += SPIN_SPEED;
	})

	stage.update();
}

function keyPressed(event) {

    switch(event.keyCode) {
        case KEYCODE_LEFT:	
            stage.regX += HERO_SPEED;
            hero.x -= HERO_SPEED;
            hero.rotation=0;
            break;
        case KEYCODE_RIGHT: 
            stage.regX -= HERO_SPEED;
            hero.x += HERO_SPEED;
            hero.rotation=180;
            break;
        case KEYCODE_UP: 
            stage.regY += HERO_SPEED;
            hero.Y -= HERO_SPEED;
            hero.rotation=90;
            break;
        case KEYCODE_DOWN: 
            stage.regY -= HERO_SPEED;
            hero.Y += HERO_SPEED;
            hero.rotation=270;
            break;
        case KEYCODE_SPACE:
        	  fireBanana();
        	  break;
    }
    stage.update();

}

function findAngle(mouseX, mouseY){

	// angle in degrees
	var angle =  Math.atan2(hero.y - mouseY, hero.x - mouseX) * 180 / Math.PI;

	if(angle < 0)
		angle = 360 + angle;

	//angleLabel.text = "hero.x:"+ hero.x + " hero.y:" + hero.y + " Angle:" + Number((angle).toFixed(2))
	//				+ " mouseX:" + mouseX + " mouseY:" + mouseY;

	stage.removeChild(line);
	line = new createjs.Shape();
	line.graphics.setStrokeStyle(3);
	stage.addChild(line);

	color = createjs.Graphics.getRGB(0xFFFFFF * Math.random(), 1);
	line.graphics.beginStroke(color);
	line.graphics.moveTo(hero.x, hero.y);
	line.graphics.lineTo(mouseX, mouseY);
	line.graphics.endStroke();

  	return angle;
}

function resize() {

	stageWidth = stage.canvas.width = window.innerWidth;
	stageHeight = stage.canvas.height = window.innerHeight;
	stage.regX = - stageWidth / 2
	stage.regY = - stageHeight / 2

}


Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};
 
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};

function setupStage(){
	resize();

	world = new createjs.Container();
	world.x = - stageWidth / 2
	world.y = - stageHeight / 2
	world.width = WORLD_WIDTH;
	world.height = WORLD_HEIGTH;
	world.regX = - WORLD_HEIGTH / 2;
	world.regY = - WORLD_WIDTH / 2;

	stage.addChild(world)

	image = new Image();
	image.src = backgroundPath;
	image.onload = function() {

		back = new createjs.Shape();
		back.graphics.clear().beginBitmapFill(image,"repeat")
			.drawRect(0,0,WORLD_WIDTH,WORLD_WIDTH)

		back.x = 0;
		back.y = 0;

		world.addChild(back);
		//stage.update();
	}


	stage.update();

}