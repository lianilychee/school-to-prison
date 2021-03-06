introText = {
	stage1:{
		text:"<span style='color:#BE1E2D;font-size:32px;font-weight:bold'>A disabled student is </span><span style='color:#03273D;font-size:32px;font-weight:bold'>twice as likely </span><span style='color:black;font-size:18px'>to be suspended than a non-disabled student.<br></span>",
		button:"next"
	},
	stage2:{
		text:"<span style='color:#BE1E2D;font-size:32px;font-weight:bold'>Suspension leads to </span><span style='color:#03273D;font-size:32px;font-weight:bold'>incarceration. </span><span style='color:black;font-size:18px'>A suspended student is 3 times more likely to drop out, and 80% of inmates do not have a diploma.<br></span>",
		button:"next"
	},
	stage3:{
		text:"<span style='color:#BE1E2D;font-size:32px;font-weight:bold'>Disability </span><span style='color:#03273D;font-size:32px;font-weight:bold'>& race </span><span style='color:black;font-size:18px'>are compounding factors in the school to prison pipeline.<br></span>",
		button:"explore"
	}
}

function introSequence(){
	stage1();
	$("#intro-next").hover(
		function(){
			$(this).css("background-color","grey");
		},
		function(){
			$(this).css("background-color","#1E88BE");
		}
	);
}

function stage1(){
	LAYEREDPIE.forceState(0,"WD","default");
	$("#intro-text").html(introText.stage1.text);
	$("#intro-next").html(introText.stage1.button)
	.on("click",stage2);
}
function stage2(){
	LAYEREDPIE.forceState(0,"","default");
	$("#intro-text").html(introText.stage2.text)
	$("#intro-next").html(introText.stage2.button).
	on("click",stage3);
}
function stage3(){
	LAYEREDPIE.forceState(0,"B","WD");
	$("#intro-text").html(introText.stage3.text)
	$("#intro-next").html(introText.stage3.button)
	.on("click",finishIntro);
}

function finishIntro(){
	LAYEREDPIE.forceState(0,"","default");
	LAYEREDPIE.update(0);
	$("#intro-div").css("display", "none");
	$("#post-intro").css("display","block");
}