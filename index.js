
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
	c.height = 900
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
			this.width = 150;
			this.height = 180;
			this.img = new Image()
			this.img.src = src
		}
	}

	class RedImg extends DrawImgSuper{

		constructor(src){
			super(src)
		}

		update(){
			var dy = Math.round(Math.random()*15+0.1+1)
			this.y += dy
		}
	}
	//----------------------------------------公共方法-------------------------------------------------------------//
	//绘制鼠标特效
	function draw(ball){
		ctx.beginPath();
		ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
		ctx.strokeStyle = ball.color
		ctx.stroke();
	}

	//绘制红包实体
	function draw1(img) {
		ctx.drawImage(img.img,img.x,img.y,300,350);	
	}

	//绘制分数 事件
	function draw2(score,time){
		ctx.font="30px Verdana";
		// 创建渐变
		var gradient=ctx.createLinearGradient(0,0,c.width,0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		// 用渐变填色
		ctx.fillStyle=gradient;
		
		ctx.fillText("剩余时间"+time+"秒",10,80);
	}
	//鼠标与物体碰撞判断
	function colliderComponent(flyingObject,mouseX,mouseY){
		if(
			mouseX>flyingObject.x-(flyingObject.width) && 
			mouseX<flyingObject.x+(flyingObject.width*2) &&
			mouseY>flyingObject.y-(flyingObject.height/2) && 
			mouseY<flyingObject.y+(flyingObject.height/2)
			){
			return true;
		}else{
			return false;
		}
	}

	//开始渲染
	function startGame(){
		//请求的优惠券json
		var couponJson = {}
			//获取到的优惠券
		var coupon = {}

		$.ajax({
			url:"http://localhost:8082/getCoupon",
			dataType:"json",
			type:"GET",
			success:(res)=>{
				if(res.status==200){
					console.log(res)
					couponJson = res.data
					console.log(couponJson)
				}
			}
		})
		
		let ballArr = []
		let redArr = []
		let colorArr = ["blue","red","yellow","pink","orange"]
		var x 
		var y
		var score = 0;
		var time = 30;
		$("#index").mousemove(function(e){
			x = e.pageX
			y = e.pageY
			ballArr.push(new MoveBall(e.pageX,e.pageY  ,colorArr[Math.round(Math.random()*4+0+1)]))
		})

		//生成红包定时器
		var inteval1 = setInterval(function(){	
			var redNumWeightedNum = Math.round(Math.random()*10+0+1)
			if(time>10&&time<25){
				//console.log("-------")
				for(let i=0;i<redNumWeightedNum/4;i++){
					var redImg = new RedImg("1.jpg")
					redArr.push(redImg)
				}
			}else if(time<=10&&time>0){
				for(let i=0;i<redNumWeightedNum;i++){
					var redImg = new RedImg("1.jpg")
					redArr.push(redImg)
				}
			}else if(time<=0){
				//释放资源
				redArr.length = 0
				//清空画布
				ctx.clearRect(0,0,1000,900)
				window.clearInterval(inteval1)
				window.clearInterval(inteval2)
				alert("游戏结束")
			}
			else{
				var redImg = new RedImg("1.jpg")
				redArr.push(redImg)
			}
			time -= 1 
			//console.log("#######")
			//console.log(redArr.length)
		},1000)

		var inteval2 = setInterval(function(){
			ctx.clearRect(0,0,1000,900)
			for(let i = 0;i<redArr.length-1;i++){
				if(colliderComponent(redArr[i],x,y)){
					redArr.splice(i,1)
					score += 1
					//console.log(score)
				}
				draw1(redArr[i])
				redArr[i].update()
			}
			draw2(score,time)
			for(let i = 0;i<ballArr.length-1;i++){
				if (ballArr[i].r<=0) {
					ballArr.splice(i,1)
				}
				draw(ballArr[i])
				ballArr[i].update()
			}
			
		},10)
	}

	//----------------------------------------主方法-------------------------------------------------------------//
	$(document).ready(function(){
			
	
		$("#startBtn").click(function(){
			$("#startDiv").hide(1000)
			$("#maskDiv").hide(1000)
			startGame()
		})

	})


