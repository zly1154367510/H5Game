
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

	//请求的优惠券json
	var couponJson = {}

	
	//获奖权重 优惠券信息 
	function luckDraw(prizeProportion,couponJson){
		//console.log(prizeProportion)
		//总比重 既是中奖概率是十分之一
		var totalProportion = prizeProportion * 10
		//随机数抽奖
		var roundNum = Math.round(Math.random()*totalProportion+0+1)
		
		for (var i = couponJson.length - 1; i >= 1; i--) {
			//console.log(roundNum)
			if(roundNum < parseInt(couponJson[i].proportion) && roundNum > parseInt(couponJson[i-1].proportion)){
				//console.log(couponJson[i])
				return couponJson[i]
			}else if(roundNum<parseInt(couponJson[i-1].proportion)){
				return couponJson[i-1]
			}
		}
	}

	//结束后执行的方法
	function gamdEnd(coupon){
		console.log(coupon)
		var token = localStorage.getItem("token");
		var username = localStorage.getItem("username")
		//把优惠卷信息保存在localstorage
		var couponLocalStorage = ""
		for (var i = coupon.length - 1; i >= 0; i--) {
			couponLocalStorage += coupon[i].id+"|"
		}
		console.log(couponLocalStorage)
		console.log(token)
		console.log(username)
		if(token == undefined || username == undefined){
			localStorage.setItem("coupon",couponLocalStorage)
			alert("您还没有登陆,优惠卷只能暂时保存,请前往登陆")
			return;
		}

		$.ajax({
			url:"http://localhost:8082/mi/saveCoupon",
			data:JSON.stringify(coupon),
			dataType:"json",
			type:"get",
			success:(res)=>{
				console.log(res)
			}
		})


	}
	
	//开始渲染
	function startGame(){
		
		//获奖比重指数
		var prizeProportion = 0

		//获取到的优惠券
		var coupon = new Array()

		


		//同步获取优惠券信息
		$.ajax({
			url:"http://localhost:8082/getCoupon",
			dataType:"json",
			type:"GET",
			async:false, 
			success:(res)=>{
				if(res.status==200){
					couponJson = res.data
					console.log(res)
				}else{
					alert("初始化失败，请重试")
					return;
				}
			}
		})
		for (var i = couponJson.length - 1; i >= 0; i--) {
			prizeProportion += parseInt(couponJson[i].proportion)
		}
		
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
				gamdEnd(coupon)
			
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
					var luckDrwaRes = luckDraw(prizeProportion,couponJson)
					//console.log(luckDrwaRes)
					if(luckDrwaRes != undefined){
						coupon.push(luckDrwaRes)
					}
					redArr.splice(i,1)
					score += 1
					//console.log(coupon)
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
			console.log(startGame())
		})

	})


