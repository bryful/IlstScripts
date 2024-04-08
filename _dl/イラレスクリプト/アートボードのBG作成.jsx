#target "illustrator"
/*

*/
(function (me){
	var createBG = function(cIndex)
	{
		app.coordinateSystem =
		 CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
		var ad = null;
		try{
			ad = app.activeDocument;
			if(ad==null)
			{
				alert("no actived Document");
				return;
			}
		}catch(e){
			alert(e.toString());
			return;
		}
		var ab = ad.artboards[ad.artboards.getActiveArtboardIndex()];
		var rct = ab.artboardRect;

		var lyr = app.activeDocument.layers.add();
		lyr.name = "Background";
		try{
			lyr.move(ad.layers[ad.layers.length-1],ElementPlacement.PLACEAFTER);
		}catch(e)
		{
			alert(e.toString());
		}
		var rect = lyr.pathItems.rectangle( rct[1] ,rct[0], rct[2]-rct[1], -rct[3] - (-rct[1]) );
		var col= new RGBColor();
		switch (cIndex)
		{
			case 0:
				rect.name = "black";
				col.red =
				col.green =
				col.blue = 0;
				break;
			case 1:
				rect.name = "white";
				col.red =
				col.green =
				col.blue = 255;
				break;
			case 2:
				rect.name = "noColor";
				col = new NoColor();
				break;
		}
		rect.fillColor = col;
		rect.strokeColor = new NoColor();

	}
	var showDialog = function()
	{
		var winObj = new Window('dialog{text:"BG作成",orientation : "column", properties : {resizeable : true} }');
		var res1 =
'Group{alignment: ["fill", "fill" ],orientation:"column",preferredSize:[300,100],\
gCol:Panel{alignment:["fill","top"],orientation:"row",text:"Background Color",\
rbBlack:RadioButton{alignment:["fill","top"],text:"Black",value:true},\
rbWhite:RadioButton{alignment:["fill","top"],text:"White"},\
rbNo:RadioButton{alignment:["fill","top"],text:"NoColor"}},\
gExec:Group{alignment:["fill","top"],orientation:"row",\
btnCancel:Button{alignment:["fill","top"],text:"Cancel"},\
btnOK:Button{alignment:["fill","top"],text:"OK"}}\
}';
		winObj.gr = winObj.add(res1);
		winObj.cIndex = 0;
		winObj.layout.layout();
		winObj.onResize = function()
		{
			winObj.layout.resize();
		}
		winObj.gr.gCol.rbBlack.cIndex =0;
		winObj.gr.gCol.rbWhite.cIndex =1;
		winObj.gr.gCol.rbNo.cIndex =2;
		winObj.gr.gCol.rbBlack.value = true;

		winObj.gr.gCol.rbBlack.onClick =
		winObj.gr.gCol.rbWhite.onClick =
		winObj.gr.gCol.rbNo.onClick= function(){
			winObj.cIndex = this.cIndex;
		}
		winObj.gr.gExec.btnCancel.onClick = function(){winObj.cIndex =
			winObj.close();
		};
		winObj.gr.gExec.btnOK.onClick = function(){
			createBG(winObj.cIndex);
			winObj.close();
		};

		winObj.center();
		winObj.show();
	}

	showDialog();


})(this);