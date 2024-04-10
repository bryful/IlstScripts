(function (){
	var pref = {};
	pref.index = 0;
	var createUI = function()
	{
		var createBG = function(cIndex)
		{
			app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
			var ad = app.activeDocument;
			var ab = ad.artboards[ad.artboards.getActiveArtboardIndex()];

			var rct = ab.artboardRect;

			var lyr = ad.layers.add();
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
		var winObj = new Window("dialog","アートボードで回転" ,[0,0,0+290,0+130] );
		var pCol = winObj.add("panel", [12,12,12+265,12+59]);
		var rbBlack = pCol.add("radiobutton", [20,21,20+58,21+24], "Black");
		var rbWhite = pCol.add("radiobutton", [94,21,94+58,21+24], "White");
		var rbNo = pCol.add("radiobutton", [168,21,168+67,21+24], "NoColor");
		var btnOK = winObj.add("button", [191,77,191+75,77+24], "OK");
		var btnCancel = winObj.add("button", [106,77,106+75,77+24], "Cancel");
		rbBlack.value = true;

		rbBlack.cIndex =0;
		rbWhite.cIndex =1;
		rbNo.cIndex    = 2;
		rbBlack.onClick =
		rbWhite.onClick =
		rbNo.onClick = function()
		{
			pref.index = this.cIndex;
		}



		btnCancel.onClick = function(){
			winObj.close();
		};
		btnOK.onClick = function(){
			createBG(pref.index);
			winObj.close();
		};

		winObj.center();

		winObj.show();
	}

	if(app.activeDocument!=null)
	{
		createUI();

	}else{
		alert("no document");
	}


})();