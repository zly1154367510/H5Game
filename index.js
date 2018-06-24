
//鼠标示意类
//在canvas上绘制鼠标的坐标
//是一个呆坐标和半径的圆


// function draw(mouse,bubble,ctx){
// 	ctx.save();
// 	ctx.clearRect(0,0,1000,900)
//    	ctx.beginPath();
//     ctx.strokeStyle = 'red';
//     ctx.arc(mouse.x,mouse.y,mouse.r,0,2*Math.PI,false)
 
//    	ctx.fill();
//    	ctx.restore();
// }

//Math.round(Math.random()*w+n+1) 产生随机数
	//n 随机数下限
	//w 随机数上限和n的差值


	//1.规范画布
	var c=document.getElementById("index");
	var ctx=c.getContext("2d");
	c.width = 1000
	c.height = 600
	c.style.backgroundColor = "#000"

	
	
	//----------------------------------------鼠标特效类方法-------------------------------------------------------------//
	//2.创建小球基类
	class Ball{

		constructor(x,y,color){
			this.x = x
			this.y = y
			this.color = color
			this.r = 40
		}

		draw(){
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
			ctx.strokeStyle = this.color
			ctx.stroke();

		}
	}	
	

	// let ball = new Ball(50,50,"red")
	// ball.draw()

	//3.创建移动小球类
	class MoveBall extends Ball{
		constructor(x,y,color){
			super(x,y,color)
			this.dx = Math.round(Math.random()*10+(-5)+1)
			this.dy = Math.round(Math.random()*10+(-5)+1)
			this.dr = Math.round(Math.random()*3+1+1)
		}

		update(){
			this.x += this.dx
			this.y += this.dy
			this.r -= this.dr
			if(this.r<0){
				this.r = 0
			}
		}
	}

	//----------------------------------------红包类-------------------------------------------------------------//
	class DrawImgSuper{

		constructor(src){
			this.x = Math.round(Math.random()*990+1+1)
			this.y = 0
			this.width = 38;
			this.height = 50;
			this.img = new Image()
			this.img.src = src
		}
	}

	class RedImg extends DrawImgSuper{

		constructor(src){
			super(src)
		}

		update(){
			var dy = Math.round(Math.random()*5+1+1)
			this.y += dy
		}
	}
	//----------------------------------------公共方法-------------------------------------------------------------//
	function draw(ball){
		ctx.beginPath();
		ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
		ctx.strokeStyle = ball.color
		ctx.stroke();
	}

	function draw1(img) {
		ctx.drawImage(img.img,img.x,img.y,img.width,img.height);	
	}

	function colliderComponent(flyingObject,mouseX,mouseY){
		if(
			mouseX>flyingObject.x-(flyingObject.width/2) && 
			mouseX<flyingObject.x+(flyingObject.width) &&
			mouseY>flyingObject.y-(flyingObject.height/2) && 
			mouseY<flyingObject.y+(flyingObject.height/2)
			){
			return true;
		}else{
			return false;
		}
	}

	//----------------------------------------主方法-------------------------------------------------------------//

	let ballArr = []
	let redArr = []
	let colorArr = ["blue","red","yellow","pink","orange"]
	var x 
	var y
	var  score = 0;
	$("#index").mousemove(function(e){
		x = e.pageX
		y = e.pageY
		ballArr.push(new MoveBall(e.pageX,e.pageY  ,colorArr[Math.round(Math.random()*4+0+1)]))
	})
	setInterval(function(){	
		var redImg = new RedImg("1.jpg")
		redArr.push(redImg)
	},1500)

	setInterval(function(){
		ctx.clearRect(0,0,1000,600)
		for(let i = 0;i<redArr.length-1;i++){
			if(colliderComponent(redArr[i],x,y)){
				redArr.splice(i,1)
				score += 1
				console.log(score)
			}
			draw1(redArr[i])
			redArr[i].update()
		}
		for(let i = 0;i<ballArr.length-1;i++){
			if (ballArr[i].r<=0) {
				ballArr.splice(i,1)
			}
			draw(ballArr[i])
			ballArr[i].update()
		}
		
	},10)


