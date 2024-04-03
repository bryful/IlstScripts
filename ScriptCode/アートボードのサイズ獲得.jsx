#target "illustrator"

(function (me){

	var winObj = null;
	var edResult =null;
	var oRect =[0,0,0,0];

	var ad = null;
	try{
		ad = app.activeDocument;
	}catch(e){
		ad = null;
	}
	//********************************************************************************************
	var createDialog = function()
	{
		var winObj =  new Window('dialog{text:"アクティブカンバスの大きさ",orientation : "column" , properties : {resizeable : true} }');
		var res1 =
		'Group{alignment: ["fill", "fill" ],orientation:"column",preferredSize:[300,100],\
		edResult:EditText{alignment:["fill","fill"],properties:{multiline:true}}\
		}';
		winObj.gr = winObj.add(res1);
		winObj.layout.layout();
		winObj.onResize = function()
		{
			winObj.layout.resize();
		}
		return winObj;

	}
	//winObj = createDialog();
	//edResult= winObj.gr.edResult;
	//********************************************************************************************
	Number.prototype.pointToMM = function()
	{
		try{
			return this/2.834645;
		}catch(e){
			alert(e.toString());
		}
	}
	var getSizeFromArtboard = function(ab)
	{
		//var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		//ab = app.activeDocument.artboards[idx];
		try{

			var p0 = app.activeDocument.pathItems[0].pathPoints[0];
			var p1 = app.activeDocument.pathItems[0].pathPoints[1];

			var rct = ab.artboardRect;
			var s = "";
			s += p0.anchor[0].pointToMM() +" ,";
			s += p0.anchor[1].pointToMM() +" \r\n";
			s += p1.anchor[0].pointToMM() +" ,";
			s += p1.anchor[1].pointToMM() +" \r\n";
			s +="***:\r\n"
			s += rct[0].pointToMM() +" ,";
			s += rct[1].pointToMM() +" \r\n";
			s += rct[2].pointToMM() +" ,";
			s += rct[3].pointToMM() +" \r\n";
			s +="***:\r\n"
			s += (rct[2] -rct[0]).pointToMM() +" ,";
			s += (rct[1] -rct[3]).pointToMM() +" \r\n";
			s +="***:\r\n"
			s += ((rct[2] +rct[0])/2).pointToMM() +" ,";
			s += ((rct[1] +rct[3])/2).pointToMM() +" \r\n";

			edResult.text = s;
			//oRect =ab.artboardRect;

			//var wmm = Math.abs((oRect[2] - oRect[0])/2.834645);
			//var hmm = Math.abs((oRect[3] - oRect[1])/2.834645);

		}catch(e){
			alert("aaa\r\n" + e.toString());
			return;
		}
	}
	//********************************************************************************************
	var createWBFrame = function()
	{
		if (app.activeDocument==null) return;
		var al = app.activeDocument.activeLayer;
		if (al==null) return;
		var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		var rct = app.activeDocument.artboards[idx].artboardRect;

		var cx = ((rct[0] + rct[2])/2);
		var cy = ((rct[1] + rct[3])/2);

		var w = 260*2.834645;
		var h = w * 9/16;

		var rect = al.pathItems.rectangle( cy +h/2, cx- w/2, w, h );
		rect.selected = true;
		var newRGBColor = new RGBColor();
		newRGBColor.red = 0;
		newRGBColor.green = 0;
		newRGBColor.blue = 0;
		rect.strokeColor = newRGBColor;
		rect.Width = 1;

	}
	//********************************************************************************************

	if (ad!=null){
		//var idx = ad.artboards.getActiveArtboardIndex();
		//ab = app.activeDocument.artboards[idx];
		//getSizeFromArtboard(ab);


		//var rect = app.activeDocument.activeLayer.pathItems.rectangle( 144, 144, 72, 216 );

		createWBFrame();
		//winObj.center();
		//winObj.show();
	}else{
		alert("no active document!");
	}


})(this);
