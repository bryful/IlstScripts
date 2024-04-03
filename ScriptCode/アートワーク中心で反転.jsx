#target "illustrator"
/*

*/
(function (me){
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}
	//文字列の前後の空白・改行コードを取り除く
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}

	var flipH = function(obj,cx,cy)
	{
		var x = obj.left + obj.width/2 - cx;
		var no = obj.duplicate();
		no.resize(-100,100);
		no.left =  cx - x - obj.width/2;
		return no;
	}
	var flipV = function(obj,cx,cy)
	{
		var y = obj.top - obj.height/2 - cy;
		var no = obj.duplicate();
		no.resize(100,-100);
		no.top =  cy - y + obj.height/2;
		return no;
	}
	var flipHV = function(obj,cx,cy)
	{
		var x = obj.left + obj.width/2 - cx;
		var y = obj.top - obj.height/2 - cy;
		var no = obj.duplicate();
		no.resize(-100,-100);
		no.top =  cy - y + obj.height/2;
		no.left =  cx - x - obj.width/2;
		return no;
	}


	var flip = function(sw)
	{
		if (app.activeDocument==null) return;
		app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
		// 中心を求める
		var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		var rct = app.activeDocument.artboards[idx].artboardRect;

		var cx = ((rct[0] + rct[2])/2);
		var cy = ((rct[1] + rct[3])/2);

		var selObj = app.activeDocument.selection

		for ( var i=0; i<selObj.length;i++)
		{
			var nm = selObj[i].name;
			if ((nm=="")||(nm==null)||(nm.length<=0))
			{
				nm =selObj[i].typename+i;
				selObj[i].name = nm;
			}
			if (sw==1)
			{
				var n3 = flipV(selObj[i],cx,cy);
				n3.name = nm + "_v";
			}
			else if (sw==2)
			{
				var n1 = flipH(selObj[i],cx,cy);
				n1.name = nm + "_h";
				var n2 = flipHV(selObj[i],cx,cy);
				n2.name = nm + "_hv";
				var n3 = flipV(selObj[i],cx,cy);
				n3.name = nm + "_v";
			}else{
				var n1 = flipH(selObj[i],cx,cy);
				n1.name = nm + "_h";
			}
		}

	}

	// ********************************************************************************
	var modeDialog = function()
	{
		var winObj = new Window('dialog{text:"反転",orientation : "column", properties : {resizeable : true} }');
		var res1 =
'Group{alignment: ["fill", "fill" ],orientation:"column",preferredSize:[300,100],\
btnH:Button{alignment:["fill","top"],text:"左右反転"},\
btnV:Button{alignment:["fill","top"],text:"上下反転"},\
btnHV:Button{alignment:["fill","top"],text:"上下左右"}\
}';
		winObj.gr = winObj.add(res1 );
		winObj.layout.layout();
		winObj.onResize = function()
		{
			winObj.layout.resize();
		}
		winObj.gr.btnH.onClick = function(){ flip(0); winObj.close();};
		winObj.gr.btnV.onClick = function(){ flip(1); winObj.close();};
		winObj.gr.btnHV.onClick = function(){ flip(2); winObj.close();};

		winObj.center();
		winObj.show();
	}
	modeDialog();
})(this);
