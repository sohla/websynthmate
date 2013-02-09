
var audioContext = null;
var oscNode = null;
var gainNode = null;

var effectChain = null;
var revNode = null;
var revGain = null;
var revBypassGain = null;

var synthOn = true;

var oscTypes = new Array("SINE","SQUARE","SAWTOOTH","TRIANGLE"); 
var scaleTypes = new Array("Major","Minor","Whole","Chromatic","MajorArp"); 
var kNumOfOctaves = 8;
var kRange = 8;

var Scale = function(){
	this.major = function(){
		return new Array(0,2,4,5,7,9,11);
	};	
	this.minor = function(){
		return new Array(0,2,3,5,7,8,11);
	};	
	this.whole = function(){
		return new Array(0,2,4,6,8,10);
	};	
	this.chromatic = function(){
		return new Array(0,1,2,3,4,5,6,7,8,9,10,11);
	};	
	this.majarp = function(){
		return new Array(0,4,7);
	};	
	
}

var SynthModel = function(){
	
	this.noteOn = false;
	this.frq = 110.0;

	this.volume = 55378008;
	this.pan = 666;
	this.source = "TRIANGLE";
	this.yAxis = "off";
	
	this.microTune = 20.0;
	this.portamento = 30.0;
	
	this.octave = "3";
	this.range = "2";
	
	this.scale = "Major";
	
	this.notes = new Scale().major();

}

var synthModel = new SynthModel();


function init() {

/* 	buildAudio(); */
	

	buildUI();
	bindUI();	
	drawCanvas();

	

}
function pageInit(){
	
	console.log("pageInit");
	
	console.log(audioContext);
/* 	if(audioContext == null) */
}
function buildUI(){
	

	canvas = window.document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.top = 0.0;
	
	// build sclae list
	var scaleGroup = $("#scalegroup");
	for(var i in scaleTypes){
		
		var type = scaleTypes[i];
		var e = "<div data-role=\"button\" class=\""+type+"Button\" id=\"scale\" value=\""+type+"\" >"+ type +"</div>"
		scaleGroup.append(e);
	}
	
	
	// build ocatve list
	var octaveGroup = $("#octavegroup");
	for(var i = 0; i<kNumOfOctaves; i++){
		var e = "<div data-role=\"button\" class=\"oct"+(i+1)+"Button\" id=\"octave\" value=\""+(i+1)+"\" >"+ (i+1) +"</div>"
		octaveGroup.append(e);
	}

	// build range list
	var rangeGroup = $("#rangegroup");
	for(var i = 0; i<kRange; i++){
		var e = "<div data-role=\"button\" class=\"rng"+(i+1)+"Button\" id=\"range\" value=\""+(i+1)+"\" >"+ (i+1) +"</div>"
		rangeGroup.append(e);
	}
	
	// build oscil type list
	var oscilTypeGroup = $("#osciltypegroup");
	for(var i in oscTypes){
		var type = oscTypes[i];
		var e = "<div data-role=\"button\" class=\""+type+"Button\" id=\"source\" value=\""+type+"\" >"+ type +"</div>"
		oscilTypeGroup.append(e);
	}

	$("#onbutton").click(function(){

		$("#onbuttonlabel")[0].innerText = ("Running");
		if(audioContext == null)
			buildAudio();
	});
	
	$( document ).bind("orientationchange", function(e){
	
			canvas = window.document.getElementById("canvas");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			
			
			drawCanvas();
	
	});

	$( document ).bind("pagehide", function(e,page) {
		
		if(page.nextPage[0].id == 'main'){
			
			// back to main window
			synthOn = true;
			
			// pass model to audio engine
			if(audioContext)
				oscNode.type = oscTypes.indexOf(synthModel.source);
			
			switch(synthModel.scale){
			
				case 'Major':
					synthModel.notes = new Scale().major();
				break;
				case 'Minor':
					synthModel.notes = new Scale().minor();
				break;
				case 'Chromatic':
					synthModel.notes = new Scale().chromatic();
				break;
				case 'Whole':
					synthModel.notes = new Scale().whole();
				break;
				case 'MajorArp':
					synthModel.notes = new Scale().majarp();
				break;
			
			}
			
			drawCanvas();
		}else{
			
			
		}
		if(page.nextPage[0].id == 'scope'){
	
			synthOn = false;
	
			refreshButtonGroup([
				".oct1Button",
				".oct2Button",
				".oct3Button",
				".oct4Button",
				".oct5Button",
				".oct6Button",
				".oct7Button",
				".oct8Button"
			],synthModel);

		
			refreshButtonGroup([
				".rng1Button",
				".rng2Button",
				".rng3Button",
				".rng4Button",
				".rng5Button",
				".rng6Button",
				".rng7Button",
				".rng8Button"
			],synthModel);

/*
			refreshSlider(".microTuneSlider",synthModel)
			refreshSlider(".portamentoSlider",synthModel)
*/
		}		

		if(page.nextPage[0].id == 'parameters'){

			synthOn = false;
			
			refreshButtonGroup([".SINEButton",".TRIANGLEButton",".SAWTOOTHButton",".SQUAREButton"],synthModel);

		}		
		if(page.nextPage[0].id == 'scale'){
			
			synthOn = false;
			
			refreshButtonGroup([".MajorButton",".MinorButton",".ChromaticButton",".WholeButton",".MajorArpButton"],synthModel);

		}

		if(page.nextPage[0].id == 'about'){
			
			synthOn = false;

		}

	});
	
	
}

function bindUI(){
	

/*
	bindSlider(".volumeSlider",synthModel);
	bindSlider(".panSlider",synthModel);
*/

/*
	bindSlider(".microTuneSlider",synthModel);
	bindSlider(".portamentoSlider",synthModel);
*/


	bindButtonGroup([".MajorButton",".MinorButton",".ChromaticButton",".WholeButton",".MajorArpButton"],synthModel);


	bindButtonGroup([".SINEButton",".TRIANGLEButton",".SAWTOOTHButton",".SQUAREButton"],synthModel);
/* 	bindButtonGroup([".offButton",".volButton"],synthModel); */


	bindButtonGroup([
		".oct1Button",
		".oct2Button",
		".oct3Button",
		".oct4Button",
		".oct5Button",
		".oct6Button",
		".oct7Button",
		".oct8Button"
	],synthModel);


	bindButtonGroup([
		".rng1Button",
		".rng2Button",
		".rng3Button",
		".rng4Button",
		".rng5Button",
		".rng6Button",
		".rng7Button",
		".rng8Button"
	],synthModel);



}


function refreshButtonGroup(group, model){
	
	$(group).each(function(index,button){

		console.log($(button).attr('value') +":"+model[$(button).attr('id')]);

 		if($(button).attr('value') == model[$(button).attr('id')]){
	 		
	 		$(button).addClass('ui-btn-active');
	 		
 		}else{
	 		
	 		$(button).removeClass('ui-btn-active');

 		}
	
	})
}

function refreshSlider(sliderClass,model){
	
	$(sliderClass)[0].value = model[$(sliderClass).attr('id')]
	$(sliderClass).slider('refresh');
/* 	console.log(model[$(sliderClass).attr('id')]); */
}
function bindButtonGroup(group,model){

	$(group).each(function(index,button){
		$(button).bind("tap", function(e){
			model[$(button).attr('id')] = $(button).attr('value');
			$(group).each(function(index,b){
				$(b).removeClass('ui-btn-active') 
			});
			$(button).addClass('ui-btn-active');
			drawCanvas();
			
/*
			for(var key in synthModel) {
			    console.log('key: ' + key + 'value: ' + synthModel[key]);
			}
			console.log("----------------------");
*/
		});
	});
}

function bindButton(buttonGroupClass,model){
	
	$(buttonGroupClass).bind("tap", function(e){
		model.oscilType = $(buttonGroupClass).attr('id');
		drawCanvas(); 
/* 		console.log($(buttonGroupClass).closest('div')); */
	});
	
}
function bindSlider(sliderClass,model){
	
	$(sliderClass).bind("change", function(e){
		model[e.target.id] = e.target.value;
		drawCanvas();
/* 		console.log(e.target.id + ":" + e.target.value / 100.0); */
	});
}

function impulseResponse( duration, decay ) {
	// code from : https://github.com/cwilso
    var sampleRate = audioContext.sampleRate;
    var length = sampleRate * duration;
    var impulse = audioContext.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay)
        decay = 2.0;
    for (var i = 0; i < length; i++){
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    return impulse;
}

function buildAudio(){

  	try {
    	audioContext = new webkitAudioContext();
  	}
  	catch(e) {
    	alert('Web Audio API is not supported in this browser.');
  	}

  	if (!audioContext.createOscillator)
    	alert('Oscillators not supported - you may need to run Chrome Canary.');

	// reverb code from : https://github.com/cwilso
	effectChain = audioContext.createGainNode();
	
	// convolver for a global reverb - just an example "global effect"
	revNode = audioContext.createConvolver();
	
	// gain for reverb
	revGain = audioContext.createGainNode();
	revGain.gain.value = 0.5;
	
	// gain for reverb bypass.  Balance between this and the previous = effect mix.
	revBypassGain = audioContext.createGainNode();
	
	// overall volume control node
	volNode = audioContext.createGainNode();
	volNode.gain.value = 0.8;
	
	effectChain.connect( revNode );
	effectChain.connect( revBypassGain );
	revNode.connect( revGain );
	revGain.connect( volNode );
	revBypassGain.connect( volNode );
	
	// hook it up to the "speakers"
	volNode.connect( audioContext.destination );
	
	revNode.buffer = impulseResponse( 1.6, 1.6 );
	

	oscNode = audioContext.createOscillator();
	oscNode.frequency.value = 110;
	oscNode.type = oscTypes.indexOf(synthModel.source);
	oscNode.noteOn(0);

	gainNode = audioContext.createGainNode();
	gainNode.gain.value = 0.0;
	oscNode.connect( gainNode );
	gainNode.connect( effectChain );
	
}


function drawCanvas(){
	
	
	var	canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	
	var octave = synthModel.octave;		
	var range = synthModel.range ;

	var pitchCount = synthModel.notes.length+1;

	if(pitchCount == 1)
		pitchCount = 0;

	var total = (range * pitchCount) - range+1;

	var dx=0,dy=0;
	
	var sw = window.innerWidth / total;
	
	for(i=0;i<total;i++){


		var colorRatio = i / total;
		var nRadians = (40 + (colorRatio * - 250) ) * (Math.PI / (180.0 * 8/range));
		nRadians -= ((250/8)*octave) * (Math.PI / 180.0);
		var lightness = 1.0;
		
		var index = i % synthModel.notes.length; 
		var pitchKey = synthModel.notes[index];

		switch (pitchKey) {
				
			case 0:		lightness = 1.0;	break;
			case 1:		lightness = 0.3;	break;
			case 2:		lightness = 0.35;	break;
			case 3:		lightness = 0.4;	break;
			case 4:		lightness = 0.45;	break;
			case 5:		lightness = 0.35;	break;
			case 6:		lightness = 0.25;	break;
			case 7:		lightness = 0.45;	break;
			case 8:		lightness = 0.4;	break;
			case 9:		lightness = 0.45;	break;
			case 10:	lightness = 0.4;	break;
			case 11:	lightness = 0.45;	break;
				
			default:	lightness = 0.5;	break;
		}
				
		var nR = 256 * (Math.cos(nRadians) * lightness);
		var nG = 256 * (Math.cos(nRadians + 2.0 * Math.PI / 3.0) * lightness);
		var nB = 256 * (Math.cos(nRadians + 3.0 * Math.PI / 3.0) * lightness);

		ctx.fillStyle="rgba("+Math.round(nR)+","+Math.round(nG)+","+Math.round(nB)+",255)";
		ctx.fillRect(sw*i,0,sw,window.innerHeight);
		
		ctx.strokeStyle = "#000000";
		ctx.strokeRect(sw*i,0,sw,window.innerHeight);
		
		
	}
	
}
function eventInRange(e){

	var result = false;
	
	var lx = (e.pageX-canvas.offsetLeft) / window.innerWidth;
	var ly = (e.pageY-canvas.offsetTop) / window.innerHeight;

	if(lx >= 0 && lx <= 1 && ly >= 0 && ly <= 1 && synthOn && audioContext != null)
		result = true;
	
	
		
	return result;
}

function eventToFreq(e){

	var normX = (e.pageX-canvas.offsetLeft) / window.innerWidth;
 	var pitchKey = normX * ((synthModel.notes.length * synthModel.range) + 1) ;

	var oct = Math.floor(pitchKey / synthModel.notes.length);
	var pch = Math.floor(pitchKey % synthModel.notes.length);

	var root = 1;
	var noteInScale = synthModel.notes[pch] + ( 12 * oct) + root;

	var pchfrq = Math.pow(2.0,noteInScale/12.0);
	var o = parseInt(synthModel.octave) + 5;
	var octfrq = Math.pow(2.0,o);
	

/*
	// basic formula	
	var index = Math.floor(normX * (synthModel.notes.length)) % synthModel.notes.length; 
	var noteInScale = synthModel.notes[index];
	var pitch = Math.pow(2.0,noteInScale/12.0);
	var octave = Math.pow(2.0,8);
*/
	//console.log(pchfrq * octfrq);


	return pchfrq * octfrq;

}

function eventToYAxis(e){

	normY = (e.pageY-canvas.offsetTop) / window.innerHeight;
	
	return 0.8;

}


window.document.onmousemove = function(e){
	if(eventInRange(e)){
		oscNode.frequency.setTargetValueAtTime(eventToFreq(e),0.0,0.01);
		
/*
		if(synthModel.noteOn){
			gainNode.gain.setTargetValueAtTime(eventToYAxis(e),0.0,0.01);
		}
*/
		
	}else{
		synthModel.noteOn = false;
		if(audioContext != null)
			gainNode.gain.setTargetValueAtTime(0.0,0.0,0.02);
	}
};
window.document.onmousedown = function(e){

	if(eventInRange(e)){
		synthModel.noteOn = true;

		oscNode.frequency.setTargetValueAtTime(eventToFreq(e),0.0,0.01);
		gainNode.gain.setTargetValueAtTime(0.8,0.0,0.01);
		
	}else{
		
		
	}
};
window.document.onmouseup = function(e){
	if(eventInRange(e)){
		synthModel.noteOn = false;
		gainNode.gain.setTargetValueAtTime(0.0,0.0,0.02);
	}
};

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

	 //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);
    
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0, null);

    first.target.dispatchEvent(simulatedEvent);
   // event.preventDefault();
}



window.document.addEventListener("touchstart", touchHandler, true);
window.document.addEventListener("touchmove", touchHandler, true);
window.document.addEventListener("touchend", touchHandler, true);
window.document.addEventListener("touchcancel", touchHandler, true); 


/*
$( '#main' ).live( 'pagecreate',function(event){

  pageInit();
});
*/
// create context only when main page is up?

/* $(document).bind('pageinit',pageInit);// why OH why */
$(document).bind('ready',init);// call ready for global init */ 
