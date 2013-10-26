/*
 * Copyright (c) 2008, Aleph-Null, Inc. 
 * ipod(at)aleph-null.tv
 * http://aleph-null.tv
 */
var canv_x = 0;
var canv_y = 0;
var connectTheDots = true;
var noDots = false;
var canv = null;

var last_x = 0;
var last_y = 0;

var lineColor = 'navy';
var fillColor = 'navy';
//var fillColor = 'blue';
//var menuHiliteColor = '#4c566c';
var menuHiliteColor = '#c5ccd3';
var menuShadowColor = '#4c566c';

var dotRadius = 8;
var lineWidth = 2;

var slideSpeed = 'fast';

var LINE_THIN = 2;
var LINE_MEDIUM = 8;
var LINE_THINK = 12;

var DOT_SMALL = 4;
var DOT_MEDIUM = 8;
var DOT_BIG = 12;

	
$().ready(function() {
	// See http://www.whatwg.org/specs/web-apps/current-work/#the-canvas
	c = document.getElementById("MyCanvas");
	canv = c.getContext('2d');
	
	canv_x = c.offsetLeft;
	canv_y = c.offsetTop;

	var mouseDragging = false;
	var jqCanv = $('#MyCanvas');
	
	// Set some props:
	canv.strokeStyle = lineColor;
	canv.shadowOffsetX = 2;
	canv.shadowOffsetY = 2;
	canv.shadowColor = "#4c566c";
	canv.shadowBlur = 4;
	canv.lineJoin = 'round';
	canv.lineCap = 'round';
	canv.lineWidth = lineWidth;
	paintBackground();
	jqCanv.click(paintapoint);
	
	$('#bcolors').click(function(e){manageMenus('colors');});
	$('#blines').click(function(e){manageMenus('lines');});
	$('#bdots').click(function(e){manageMenus('dots');});
	$('#bcanvas').click(function(e){manageMenus('canvas');});
	
	$('#curcolor').css('background-color',fillColor);
});

function paintapoint(e) {
		x = e.pageX - canv_x;
		y = e.pageY - canv_y;
		radius = dotRadius;
		if(connectTheDots && last_x > 0 && last_y > 0) {
			canv.beginPath();
			canv.moveTo(last_x, last_y);
			canv.lineTo(x, y);
			canv.stroke();
			canv.closePath();
		}
		canv.beginPath();
		
		if(!noDots) {
			canv.fillStyle = fillColor;
			canv.arc(x, y, radius, 0, Math.PI * 2, false);		
			canv.fill();
		}
		if(canv.shadow)
			canv.setShadow();
			
		canv.closePath();	
		last_x = x; 
		last_y = y;
}

function setDotSize(intSize) {
	if(intSize == 0) { 
		noDots = true;
		last_x = last_y = 0;
	} else {
		if(noDots) {
			last_x = last_y = 0; // Clear last point.
			noDots = false;
		}
		noDots = false;
		dotRadius = intSize;
	}
	closeAllMenus();
	//$('#dotsmenu').find('a').css('border-bottom','inherit');
	//$('#dot' + intSize).css('border-bottom','3px solid '+menuHiliteColor);
	$('#dotsmenu').find('a').css('color','inherit').css('text-shadow','inherit');
	$('#dot' + intSize).css('color', menuHiliteColor).css('text-shadow',menuShadowColor);
}

function setColor(col) {
	fillColor = lineColor = col;
	canv.strokeStyle = canv.fileStyle = col;
	closeAllMenus();
	$('#curcolor').css('background-color',fillColor);
}

function clearCanvas() {
	canv.clearRect(0, 0, 320, 330);
	last_x = last_y = 0; // zero last point.
	paintBackground();
	closeAllMenus();
}

function paintBackground() {
	gr = canv.createLinearGradient(1,1, 320, 200);
	gr.addColorStop(1, "#ffffff");
	gr.addColorStop(0, "#dee5f4");
	canv.fillStyle = gr;
	canv.fillRect(0, 0, 320, 330);
}

//function toggleLines() {
//	last_x = last_y = 0; // zero last point.
//	connectTheDots = !connectTheDots;
//}
function endCurrentLine() {
	last_x = last_y = 0;
	closeAllMenus();
}

function setLineWidth(intWidth) {
	if(intWidth == 0) {
		connectTheDots = false;
	} else {
		if(!connectTheDots) {
			last_x = last_y = 0; // Clear last point.
			connectTheDots = true;
		}
		lineWidth = intWidth;
		canv.lineWidth = lineWidth;
	}
	closeAllMenus();
	$('#linesmenu').find('a').css('color','inherit').css('text-shadow','inherit');
	$('#line'+ intWidth).css('color', menuHiliteColor).css('text-shadow',menuShadowColor);
}


function manageMenus(target) {
	switch(target) {
		case 'colors':
			buttonId = 'bcolors';
			menuId = 'colorsmenu';
			break;
		case 'lines':
			buttonId = 'blines';
			menuId = 'linesmenu';
			break;
		case 'dots':
			buttonId = 'bdots';
			menuId = 'dotsmenu';
			break;
		case 'canvas':
			buttonId = 'bcanvas';
			menuId = 'canvasmenu';
			break;				
	}
	
	jqMenu = $('#'+menuId);
	if(jqMenu.get(0).isActiveMenu) {
		oMenu = jqMenu.get(0)
		oMenu.isActiveMenu = false;
		oMenu.activeButton = false;
		oMenu.activeMenuFrame = false;
		jqMenu.slideUp(slideSpeed);
		$('#'+buttonId).css('background-image','url(buttonbg.png)');
	} else {
		closeAllMenus();
		
		oMenu = jqMenu.get(0)
		oMenu.isActiveMenu = true;
		oMenu.activeButton = buttonId;
		oMenu.activeMenuFrame = menuId;
		
		$('#'+buttonId).css('background-image','url(buttonbg2.png)');
		jqMenu.slideDown(slideSpeed);
	}
}

function closeAllMenus() {
	$('div.menuframe').each(function() {
		if(this.isActiveMenu) {
			this.isActiveMenu = false;
			$(this).slideUp(slideSpeed);
			$('#'+this.activeButton).css('background-image','url(buttonbg.png)');
			this.activeButton = false;
			this.activeMenuFrame = false;
		}
	});	
}

