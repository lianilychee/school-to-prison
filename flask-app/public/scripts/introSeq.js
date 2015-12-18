introText = {
	stage1:{
		text:"<span style='color:white;font-size:32px;font-weight:bold'>A disabled student is <br></span><span style='color:black;font-size:32px;font-weight:bold'>twice as likely <br></span><span style='color:black;font-size:18px'>to be suspended than the average student.<br></span>",
		button:"<br><span style='color:white;border-style:solid;border-color:white;font-size:18px;padding:5px'>next<span>"
	},
	stage2:{
		text:"<span style='color:white;font-size:32px;font-weight:bold'>Suspension leads to <br></span><span style='color:black;font-size:32px;font-weight:bold'>incarceration. <br></span><span style='color:black;font-size:18px'>A suspended student is 3 times more likely to drop our, and 80% of inmates do not have a diploma.<br></span>",
		button:"<br><span style='color:white;border-style:solid;border-color:white;font-size:18px;padding:5px'>next<span>"
	},
	stage3:{
		text:"<span style='color:white;font-size:32px;font-weight:bold'>Disability <br></span><span style='color:black;font-size:32px;font-weight:bold'>& race <br></span><span style='color:black;font-size:18px'>are compounding factors in the school to prison pipeline.<br></span>",
		button:"<br><span style='color:white;border-style:solid;border-color:white;font-size:18px;padding:5px'>explore<span>"
	}
}

function introSequence(){
	stage1();
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