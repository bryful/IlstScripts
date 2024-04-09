(function(){
	var pref={};
	pref.unitMode = 0;
	pref.dpi = 300;
	Number.prototype.pointToMM = function()
	{
		try{
			return this*1/2.834645;
		}catch(e){
			alert(e.toString());
		}
	}
	Number.prototype.mmToPoint = function()
	{
		try{
			return this*2.834645;
		}catch(e){
			alert(e.toString());
		}
	}
	Number.prototype.mmToPx = function(dpi)
	{
		try{
			return this*dpi/25.4;
		}catch(e){
			alert(e.toString());
		}
	}
	Number.prototype.pxToMM = function(dpi)
	{
		try{
			return this*25.4/dpi;
		}catch(e){
			alert(e.toString());
		}
	}

	//**************************************************************************************
	var toValue=function(v)
	{
		var ret =[0,0,0,0];
		switch(pref.unitMode)
		{
			case 0:
				ret[0] = v[0].pointToMM();
				ret[1] = v[1].pointToMM();
				ret[2] = v[2].pointToMM();
				ret[3] = v[3].pointToMM();
				break;
			case 1:
				ret[0] = v[0];
				ret[1] = v[1];
				ret[2] = v[2];
				ret[3] = v[3];
				break;
			case 2:
				ret[0] = v[0].pointToMM().mmToPx(pref.dpi);
				ret[1] = v[1].pointToMM().mmToPx(pref.dpi);
				ret[2] = v[2].pointToMM().mmToPx(pref.dpi);
				ret[3] = v[3].pointToMM().mmToPx(pref.dpi);
				break;
		}
		return ret;
	}
	var getED = function(ed)
	{
		var ret = null;
		try{
			var o = eval(ed.text);
			if (typeof(o)=="number")
			{
				ret = o;
			}
		}catch(e){
			alert(e.toString());
		}
		return ret;
	}
	var getDocumentSize = function()
	{
		var ad = app.activeDocument;
		var ab = ad.artboards[ad.artboards.getActiveArtboardIndex()];
		var r = ab.artboardRect;
		var ret = [];
		ret[0] = r[0];
		ret[1] = r[1];
		ret[2] = r[2] - r[0];
		ret[3] = -r[3] - (-r[1]);

		return ret;
	}
	var createUI = function()
	{
		var absPoint = [];

		var w = 450;
		var winObj = new Window("dialog","アートボードのサイズ" ,[0,0,w,237] );
		var x =20;
		var y =6;

		var btnGet = winObj.add("button", [x,y,w-x*2,y+30], "現在のアートボードのサイズを獲得");
		y += 35;
		var pUnit = winObj.add("panel", [x,y,w-x*2,y+50], "Unit");
		var by = y+60;
		y = 12;
		x = 12;
		var rbMM = pUnit.add("radiobutton", [x,y,x+50,y+20], "mm");
		x += 50;
		var rbPoint = pUnit.add("radiobutton", [x,y,x+65,y+20], "Point");
		x += 65;
		var rbPixel = pUnit.add("radiobutton", [x,y,x+55,y+20], "Pixel");
		x+=55;
		var edDpi = pUnit.add("edittext", [x,y,x+40,y+20], pref.dpi+"" );
		x += 40;
		var stDpi = pUnit.add("statictext",[x,y,x+26,y+20], "dpi" );
		y = by;
		x = 20;
		var pSize = winObj.add("panel", [x,y,w - x*2,y+80], "Size");

		x = 16; y = 12;
		var stLeft = pSize.add("statictext",[x,y,x+50,y+20], "left" );
		x +=50;
		var edLeft = pSize.add("edittext", [x,y,x+130,y+20], "" );
		x +=130;
		var stTop = pSize.add("statictext",[x,y,x+50,y+20], "top" );
		x +=50;
		var edTop = pSize.add("edittext", [x,y,x+130,y+20], "" );
		x = 16;
		y += 24;
		var stWidth = pSize.add("statictext",[x,y,x+50,y+20], "width" );
		x +=50;
		var edWidth = pSize.add("edittext", [x,y,x+130,y+20], "" );
		x +=130;
		var stHeight = pSize.add("statictext",[x,y,x+50,y+20], "height" );
		x +=50;
		var edHeight = pSize.add("edittext", [x,y,x+130,y+20], "" );

		var btnUndo = winObj.add("button", [25,195,25+84,195+32], "Undo");
		var btnApply = winObj.add("button", [138,195,w-30,195+32], "Apply");
		var rbU =[rbMM,rbPoint,rbPixel];
		rbU[0].cIndex=0;rbU[1].cIndex=1;rbU[2].cIndex=2;
		rbU[pref.unitMode].value = true;
		edDpi.enabled = (pref.unitMode == 2);

		function toDisp()
		{
			var dd = toValue(absPoint);
			edLeft.text   = dd[0];
			edTop.text    = dd[1];
			edWidth.text  = dd[2];
			edHeight.text = dd[3];
		}
		absPoint = getDocumentSize();
		rbMM.onClick=rbPoint.onClick = rbPixel.onClick = function()
		{
			pref.unitMode = this.cIndex;
			edDpi.enabled = (pref.unitMode == 2);
			var d = getED(edDpi);
			if (d!=null) pref.dpi = d;
			toDisp();
		}

		toDisp();

		winObj.center();
		winObj.show();
	}
	if (app.activeDocument !=null){
		createUI();
	}else{
		alert("no document!");
	}
})();
