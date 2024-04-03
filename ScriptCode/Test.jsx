#target "illustrator"

(function (me){

	var winObj = null;
	var btnOK= null;
	var edWidth = null;
	var edHeight =null;
	var oRect =[0,0,0,0];

	var createDialog = function()
	{
		var winObj =  new Window('dialog{text:"アクティブカンバスの大きさ",orientation : "column" }');
		var res1 =
		'Group{alignment: ["fill", "fill" ],orientation:"column",preferredSize:[300,100],\
		gDPI:Group{alignment:["fill","top"],orientation:"row",\
		stDpi:StaticText{alignment:["fill","top"],maximumSize:[100,100],text:"DPI"},\
		edDpi:EditText{alignment:["fill","top"],text:"300"}},\
		gWidth:Group{alignment:["fill","top"],orientation:"row",\
		stWidth:StaticText{alignment:["fill","top"],maximumSize:[100,100],text:"Width(px)"},\
		edWidth:EditText{alignment:["fill","top"],text:""}},\
		gHeight:Group{alignment:["fill","top"],orientation:"row",\
		stHeight:StaticText{alignment:["fill","top"],maximumSize:[100,100],text:"Height(px)"},\
		edHeight:EditText{alignment:["fill","top"],text:""}},\
		gGet:Group{alignment:["fill","top"],characters:0,orientation:"row",\
		btnCancel:Button{alignment:["fill","top"],text:"Cancel"},\
		btnOK:Button{alignment:["fill","top"],text:"OK"}}\
		}';
		winObj.gr = winObj.add(res1 );
		winObj.layout.layout();
		winObj.onResize = function()
		{
			winObj.layout.resize();
		}
		return winObj;

	}
	var ad = null;
	try{
		ad = app.activeDocument;
	}catch(e){
		ad = null;
	}
	winObj = createDialog();
	btnOK= winObj.gr.gGet.btnOK;
	edDpi =winObj.gr.gDPI.edDpi;
	edWidth =winObj.gr.gWidth.edWidth;
	edHeight =winObj.gr.gHeight.edHeight;


	// ************************************
	var getPxSize = function()
	{
		try{
			var dpi = parseFloat(edDpi.text);
			if (isNaN(dpi)==false)
			{
				if (dpi<=0) {
					edDpi.text ="300";
					return;
				}
				var wmm = Math.abs((oRect[2] - oRect[0])/2.834645);
				var wpx = Math.floor( wmm * dpi  / 25.4 +0.5);
				edWidth.text = wpx + ""
				var hmm = Math.abs((oRect[3] - oRect[1])/2.834645);
				var hpx = Math.floor( hmm * dpi / 25.4 +0.5);
				edHeight.text = hpx + ""
			}else{
				edDpi.text ="300";
				return;
			}
		}catch(e){
			alert(e.toString());
			edDpi.text ="300";
			return;
		}
	}
	// ************************************
	edDpi.onChange = function()
	{
		if (this.text!=""){
			getPxSize();
		}
	}
	// ************************************
	var setPxSize = function()
	{
		try{
			var dpi = parseFloat(edDpi.text);
			var wpx = parseFloat(edWidth.text);
			var hpx = parseFloat(edHeight.text);

			if ((isNaN(dpi)==false)&&(isNaN(wpx)==false)&&(isNaN(hpx)==false) )
			{
				if ( (dpi<=0)||(wpx<=0)||(hpx<=0)) {
					return;
				}
				var wpt = 2.834645 * wpx *25.4/dpi;
				var hpt = 2.834645 * hpx *25.4/dpi;

				if (oRect[0] < oRect[2]){
					oRect[2] = oRect[0] + wpt;
				}else{
					oRect[2] = oRect[0] - wpt;
				}
				if (oRect[1] < oRect[3]){
					oRect[3] = oRect[1] + hpt;
				}else{
					oRect[3] = oRect[1] - hpt;
				}

				var idx = app.activeDocument.artboards.getActiveArtboardIndex();
				ab = app.activeDocument.artboards[idx];

				ab.artboardRect = oRect;
				oRect =ab.artboardRect;
			alert(5);

			}else{
			alert(6);
				return;
			}
		}catch(e){
			alert(e.toString());
			return;
		}
			alert(7);
	}
	// ************************************

	btnOK.onClick = function()
	{
		setPxSize();
		winObj.close();
	};

	if ( ad!=null){
		//アクティブなアートボードを獲得
		var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		var ab = ad.artboards[idx];
		oRect =ab.artboardRect;
		alert(oRect);
		getPxSize();
		winObj.center();
		winObj.show();
	}else{
		alert("no documents!");
	}


})(this);
