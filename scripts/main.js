var stage;
var heroe;
var oldX, oldY;
var angleLabel;
var line;

var KEYCODE_LEFT = 37, 
	KEYCODE_RIGHT = 39,
	KEYCODE_UP = 38, 
	KEYCODE_DOWN = 40,
	KEYCODE_SPACE = 32,
	STAGE_WIDTH = 600,
	STAGE_HEIGHT = 700,
	SPIN_SPEED = 60,
	HERO_SPEED = 30;
          
function init() {

	 stage = new createjs.Stage("demoCanvas");
	 stage.regX = -STAGE_WIDTH/2
	 stage.regY = -STAGE_HEIGHT/2

	 var circle = new createjs.Shape();
	 heroe = new createjs.Bitmap("assets/images/monkey.gif")

	 heroe.regX = 80;
	 heroe.regY = 81;

	 heroe.x = 0;
	 heroe.y = 0;

	 heroe.bananas = []

	 stage.addChild(heroe);
	 stage.update();

	 angleLabel = new createjs.Text("Hello World", "15px Arial", "#ccc");
	 angleLabel.x = - stage.canvas.width / 2 + 10;
	 angleLabel.y = stage.canvas.height / 2 - 10;
	 angleLabel.textBaseline = "alphabetic";
	 stage.addChild(angleLabel)

	 this.document.onkeydown = keyPressed;
	 this.document.onclick = onClick;

	 createjs.Ticker.addEventListener("tick", handleTick)

	 stage.on("stagemousemove", function(event){

		 if(oldX) {
			 var angle = findAngle(event.stageX - STAGE_WIDTH/2, event.stageY - STAGE_HEIGHT/2)
			 heroe.rotation = angle;
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

	var banana = new createjs.Bitmap("assets/images/banana.png")
	banana.x = heroe.x;
	banana.y = heroe.y;

	banana.regX = 130 / 2;
	banana.regY = 61 / 2;
	banana.direction = heroe.rotation;

	heroe.bananas.push(banana);

	stage.addChild(banana);

	var x = - Math.cos(Math.radians(banana.direction)) * 500
	var y = - Math.sin(Math.radians(banana.direction)) * 500
	console.log("x = " + x + " y = " + y);

	var tween = createjs.Tween.get(banana)
		.to({x:x, y:y}, 1000)
		.wait(300)
		.to({alpha:0,visible:false},1000)
		.call(function(data){
			var i = heroe.bananas.indexOf(data.target);
			
			if(i > -1){
				heroe.bananas.splice(i,1);
			}

			stage.removeChild(banana);
			stage.update();
		});

	stage.update()

}

function handleTick(event) {
	//heroe.x += 1;
	//stage.update();
	heroe.bananas.forEach(function(banana,idex){
		banana.rotation += SPIN_SPEED;
	})

	stage.update();
}

function keyPressed(event) {

    switch(event.keyCode) {
        case KEYCODE_LEFT:	
            heroe.x -= HERO_SPEED;
            heroe.rotation=0;
            break;
        case KEYCODE_RIGHT: 
            heroe.x += HERO_SPEED;
            heroe.rotation=180;
            break;
        case KEYCODE_UP: 
            heroe.y -= HERO_SPEED;
            heroe.rotation=90;
            break;
        case KEYCODE_DOWN: 
            heroe.y += HERO_SPEED;
            heroe.rotation=270;
            break;
        case KEYCODE_SPACE:
        	  fireBanana();
        	  break;
    }
    stage.update();

}

function findAngle(mouseX, mouseY){

	// angle in degrees
	var angle =  Math.atan2(heroe.y - mouseY, heroe.x - mouseX) * 180 / Math.PI;

	if(angle < 0)
		angle = 360 + angle;

	angleLabel.text = "hero.x:"+ heroe.x + " hero.y:" + heroe.y + " Angle:" + Number((angle).toFixed(2))
					+ " mouseX:" + mouseX + " mouseY:" + mouseY;

	stage.removeChild(line);
	line = new createjs.Shape();
	line.graphics.setStrokeStyle(3);
	stage.addChild(line);

	color = createjs.Graphics.getRGB(0xFFFFFF * Math.random(), 1);
	line.graphics.beginStroke(color);
	line.graphics.moveTo(heroe.x, heroe.y);
	line.graphics.lineTo(mouseX, mouseY);
	line.graphics.endStroke();

  	return angle;
}

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};
 
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};