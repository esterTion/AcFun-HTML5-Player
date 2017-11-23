(function(){
var toStandardArc=function(r){
	return r-.5*Math.PI;
},
toCartCoord=function(centerX,centerY,radius,angle){
	/*var x=centerX,y=centerY;
	x+=Math.cos(angle)*radius
	y+=Math.sin(angle)*radius
	return [x,y];*/
	return [centerX+Math.cos(angle)*radius,centerY+Math.sin(angle)*radius]
},
transitionColor=function(startColor,endColor,pos){
	var startColor=parseInt(startColor,16),endColor=parseInt(endColor,16),
	startR=startColor>>>16,startG=startColor>>8&0xff,startB=startColor&0xff,
	endR=endColor>>>16,endG=endColor>>8&0xff,endB=endColor&0xff,
	doneR=startR+(endR-startR)*pos|0,doneG=startG+(endG-startG)*pos|0,doneB=startB+(endB-startB)*pos|0,
	done=doneR*0x010000+doneG*0x0100+doneB
	done=done.toString(16);
	while(done.length<6){
		done='0'+done;
	}
	return done;
},
r,thick,spinningSpeed,currentColor,nextColor,startRad,nextStartRad,loopCount,startTime,
sin=Math.sin,PI=Math.PI;
'use strict';
window.dots={
	running:!1,
	ticking:!1,
	config:{color:['FFFFFF','FFFFFF'],r:20,thick:2,spinningSpeed:700},
	currentColor:'',
	canvas:null,
	context:null,
init:function(config){
	for(var i in config){
		this.config[i]=config[i];
	}
},
mainLoop:function(){
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	if(!this.running){
		return;
	}
	//this.context.fillStyle='#'+this.config.color;
	var now=Date.now(),offset=(now-startTime)%1400,i=0,devicePixelRatio=window.devicePixelRatio,
	centerX=this.canvas.width/2,centerY=this.canvas.height/2,
	calcLoopCount=((now-startTime)/1400)|0,currentStartRad,currentEndRad,context=this.context;
	if(calcLoopCount!=loopCount){
		startRad=nextStartRad;
		nextStartRad=(startRad+1400/spinningSpeed-.1+5/3)%2;
		loopCount=calcLoopCount;
		currentColor=this.config.color[this.config.color.indexOf(currentColor)+1]
		nextColor=this.config.color[this.config.color.indexOf(currentColor)+1]
		this.currentColor=currentColor
	}
	context.fillStyle='#'+currentColor;
	/*
	0-600 0.2rad->5/3rad
	600-700 5/3rad
	700-1300 5/3rad->0.2rad
	1300-1400 0 0.2rad
	*/
	currentStartRad=startRad+(offset)/spinningSpeed
	//currentStartRad=startRad
	/*
	if(offset<600){
		currentEndRad=currentStartRad+.05+( (5/3-.05)* (sqrt( (offset-300)/300 )*300+300) /600 )
	}else if(offset<700){
		currentEndRad=currentStartRad+5/3
	}else if(offset<1300){
		currentEndRad=currentStartRad+5/3
		currentStartRad=currentEndRad-.05-( (5/3-.05)*(1-(sqrt( (offset-1000)/300 )*300+300)/600) )
	}else{
		currentEndRad=currentStartRad+5/3
		currentStartRad=currentEndRad-.05
	}*/
	if(offset<700){
		currentEndRad=currentStartRad+.1+( (5/3-.1)* (sin( (offset-350)/700*PI )*1+1) /2 )
	}else{
		currentEndRad=currentStartRad+5/3
		currentStartRad=currentEndRad-.1-( (5/3-.1)*(1-(sin( (offset-1050)/700*PI )*1+1) /2) )
	}
	if(offset>1200){
		context.fillStyle='#'+transitionColor(currentColor,nextColor,(offset-1200)/200)
	}
	currentStartRad=toStandardArc(currentStartRad*PI);
	currentEndRad=toStandardArc(currentEndRad*PI);
	
	var startPoint=toCartCoord(centerX,centerY,r*devicePixelRatio,currentStartRad),
	outerPoint=toCartCoord(centerX,centerY,(r+thick)*devicePixelRatio,currentEndRad)
	context.beginPath();
	context.moveTo(startPoint[0],startPoint[1])
	context.arc(centerX,centerY,r*devicePixelRatio,currentStartRad,currentEndRad);
	context.lineTo(outerPoint[0],outerPoint[1]);
	context.arc(centerX,centerY,(r+thick)*devicePixelRatio,currentEndRad,currentStartRad,true);
	context.lineTo(startPoint[0],startPoint[1])
	context.fill();
	
	if(!this.ticking){
		requestAnimationFrame(this.mainLoopCaller);
		this.ticking=!0;
	}
},
mainLoopCaller:function(){
	dots.ticking=!1;
	dots.mainLoop();
},
runTimer:function(){
	var container=dots.config.container;
	if(container==null || this.running)
		return;
	var canvas=container.querySelector('canvas');
	if(canvas==null){
		canvas=document.createElement('canvas');
		canvas.style.width=this.config.width||'';
		canvas.style.height=this.config.height||'';
		container.appendChild(canvas);
		this.canvas=canvas;
		canvas.width=canvas.offsetWidth*devicePixelRatio;
		canvas.height=canvas.offsetHeight*devicePixelRatio;
		this.context=canvas.getContext('2d');
	}
	this.running=!0;
	startTime=Date.now();
	loopCount=-1;
	nextStartRad=0;
	currentColor=this.config.color[this.config.color.length-2];
	thick=this.config.thick
	r=this.config.r
	spinningSpeed=this.config.spinningSpeed
	
	if(!this.ticking){
		requestAnimationFrame(this.mainLoopCaller);
		this.ticking=!0;
	}
},
stopTimer:function(){
	this.running=!1;
}
}
window.addEventListener('resize',function(){
	if(dots.canvas!=null){
		var devicePixelRatio=window.devicePixelRatio
		dots.canvas.width=dots.canvas.offsetWidth*devicePixelRatio;
		dots.canvas.height=dots.canvas.offsetHeight*devicePixelRatio;
	}
});
})()