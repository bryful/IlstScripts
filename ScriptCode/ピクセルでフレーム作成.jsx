#target "illustrator"
/*
	26ｃｍの16x9のフレームを描画します。
	WB版フレームやMRのフレームで使えます。
*/
(function (me){
//********************************************************************************************
	var pref ={};
	pref.width = 0;
	pref.height = 0;
	pref.dpiMode = 0;
	pref.custumDpi = 160;

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
	var createFrame = function(xp,yp,dpi,crossFlag,paintFLag)
	{
		function drawFrame(w,h,cx,cy)
		{
			var rect = al.pathItems.rectangle( cy +h/2, cx- w/2, w, h );
			rect.name = "100%";
			//rect.guides = true;
			var col = new RGBColor();
			col.red = 0;
			col.green = 0;
			col.blue = 200;
			rect.strokeColor = col;
			rect.Width = 4;

			var w2 = 260*2.834645*1.1;
			var h2 = w2 * 9/16;

			if (paintFLag){
				var rect2 = al.pathItems.rectangle( cy +h2/2, cx- w2/2, w2, h2 );
				rect2.name = "paint";
				//rect2.guides = true;
				var col2 = new RGBColor();
				col2.red = 50;
				col2.green = 50;
				col2.blue = 200;
				rect2.strokeColor = col2;
				rect2.Width = 2;
			}

			if (crossFlag)
			{
				var line = al.pathItems.add();
				line.setEntirePath([[cx- w2/2,cy],[cx+ w2/2,cy]]);
				line.guides = true;
				line.strokeColor = col2;
				line.Width = 2;
				line.name = "cross1"
				var line2 = al.pathItems.add();
				line2.setEntirePath([[cx,cy+h2/2],[cx,cy-h2/2]]);
				line2.guides = true;
				line2.strokeColor = col2;
				line2.name = "cross2"
				line2.Width = 2;
			}
			var gp = app.activeDocument.groupItems.add();
			rect.move(gp,ElementPlacement.PLACEATEND);
			rect2.move(gp,ElementPlacement.PLACEATEND);
			line.move(gp,ElementPlacement.PLACEATEND);
			line2.move(gp,ElementPlacement.PLACEATEND);
			gp.selected = true;
			gp.name = "Frame"

		}

		if (app.activeDocument==null) return;
		var al = app.activeDocument.activeLayer;
		if (al==null) return;
		app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

		var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		var rct = app.activeDocument.artboards[idx].artboardRect;

		var cx = ((rct[0] + rct[2])/2);
		var cy = ((rct[1] + rct[3])/2);

		var ppx = xp.pxToMM(dpi).mmToPoint();
		var ppy = yp.pxToMM(dpi).mmToPoint();

		app.redraw();
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
		}
		return ret;
	}
	var createUI = function()
	{
		var winObj = new Window("dialog","フレームの作成" ,[0,0,0+405,0+210] );
		var pSize = winObj.add("panel", [28,13,28+361,13+54], "Size(Pixel)");
		var stWidth = pSize.add("statictext",[14,19,14+48,19+20], "Width" );
		var edWidth = pSize.add("edittext", [68,18,68+100,18+23], "1536" );
		var stHeight = pSize.add("statictext",[173,19,173+48,19+20], "Height" );
		var edHeight = pSize.add("edittext", [227,18,227+100,18+23], "864" );
		var Dpi = winObj.add("panel", [28,73,28+361,73+54], "Dpi");
		var rb072 = Dpi.add("radiobutton", [6,20,6+55,20+20], "72dpi");
		var rb150 = Dpi.add("radiobutton", [68,20,68+65,20+20], "150dpi");
		var rb300 = Dpi.add("radiobutton", [140,20,140+64,20+20], "300dpi");
		var rbCustum = Dpi.add("radiobutton", [210,19,210+69,19+20], "Custum");
		var edDpi = Dpi.add("edittext", [285,20,285+42,20+20], "160" );
		var cbCross = winObj.add("checkbox", [48,139,48+104,139+24], "十字線を描く");
		cbCross.value = false;
		var cbPaint = winObj.add("checkbox", [158,139,158+130,139+24], "彩色フレームも描く");
		cbPaint.value = false;
		var btnUndo = winObj.add("button", [28,169,28+84,169+32], "Undo");
		var btnApply = winObj.add("button", [201,169,201+187,169+32], "Apply");

		var rbD = [rb072,rb150,rb300,rbCustum];
		rbD[pref.dpiMode].value = true;
		rbD[0].cIndex =0; rbD[1].cIndex =1;rbD[2].cIndex =2;rbD[3].cIndex =3;
		rbD[0].onClick = rbD[1].onClick = rbD[2].onClick =rbD[3].onClick =function()
		{
			pref.dpiMode = this.cIndex;
			edDpi.enabled = (pref.dpiMode==3);
		}
		edDpi.enabled = (pref.dpiMode==3);

		btnApply.onClick = function()
		{
			var xp = getED(edWidth);
			if (xp==null)
			{
				
			}
			var yp = getED(edHeight);
			var dpi = 72;
			switch(pref.dpiMode)
			{
				case 0:
					dpi = 72;
					break;
				case 1:
					dpi = 150;
					break;
				case 2:
					dpi = 300;
					break;
				case 3:
					dpi = getED(edDpi);
					break;

			}


		}


		winObj.center();
		winObj.show();

	}

	var createWBFrame = function()
	{
		if (app.activeDocument==null) return;
		var al = app.activeDocument.activeLayer;
		if (al==null) return;
		app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

		var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		var rct = app.activeDocument.artboards[idx].artboardRect;

		var cx = ((rct[0] + rct[2])/2);
		var cy = ((rct[1] + rct[3])/2);

		var w = 260*2.834645;
		var h = w * 9/16;

		var rect = al.pathItems.rectangle( cy +h/2, cx- w/2, w, h );
		rect.name = "100%";
		rect.guides = true;
		var col = new RGBColor();
		col.red = 0;
		col.green = 0;
		col.blue = 200;
		rect.strokeColor = col;
		rect.Width = 4;

		var w2 = 260*2.834645*1.1;
		var h2 = w2 * 9/16;

		var rect2 = al.pathItems.rectangle( cy +h2/2, cx- w2/2, w2, h2 );
		rect2.name = "paint";
		rect2.guides = true;
		var col2 = new RGBColor();
		col2.red = 50;
		col2.green = 50;
		col2.blue = 200;
		rect2.strokeColor = col2;
		rect2.Width = 2;

		var line = al.pathItems.add();
		line.setEntirePath([[cx- w2/2,cy],[cx+ w2/2,cy]]);
		line.guides = true;
		line.strokeColor = col2;
		line.Width = 2;
		line.name = "cross1"
		var line2 = al.pathItems.add();
		line2.setEntirePath([[cx,cy+h2/2],[cx,cy-h2/2]]);
		line2.guides = true;
		line2.strokeColor = col2;
		line2.name = "cross2"
		line2.Width = 2;

		var gp = app.activeDocument.groupItems.add();
		rect.move(gp,ElementPlacement.PLACEATEND);
		rect2.move(gp,ElementPlacement.PLACEATEND);
		line.move(gp,ElementPlacement.PLACEATEND);
		line2.move(gp,ElementPlacement.PLACEATEND);
		gp.selected = true;
		gp.name = "WB(26cm)Frame"

	}
	//createWBFrame();
	createUI();
})(this);
