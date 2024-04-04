#target "illustrator"
/*
	26ｃｍの16x9のフレームを描画します。
	WB版フレームやMRのフレームで使えます。
*/
(function (me){
//********************************************************************************************
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
	createWBFrame();
})(this);
