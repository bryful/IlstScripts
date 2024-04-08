(function (me){
	var pref = {};
	pref.copies = 3;
	pref.offset = 0;
	pref.xpos = 0;
	pref.ypos = 0;
	pref.unit = 0; // 0: mm 1:point 2: pixel
	pref.dpi = 300;
	var scriptName ="複製して移動配置";


 // 環境設定ファイルのFileオブジェクトを返す
    // 無かったらフォルダの作成も行う
    // "C:\Users\<ユーザー名>\AppData\Roaming\bry-ful\aep置き換え\aep置き換え.pref"
    var getPrefFile = function()
    {
        var ret = "noret";
        var pff = "none";
        var pff2 = "none2";

        try{
            pff = new Folder(Folder.userData.fullName+"/bry-ful");
            if(pff.exists==false)
            {
                pff.create();
            }
        }catch(e)
        {
            alert("pff:error!\r\n" + e.toString());
            return null;
        }
        try{
            pff2 = new Folder(pff.fullName+"/" + scriptName);
            if (pff2.exists==false)
            {
                pff2.create();
            }
        }catch(e)
        {
            alert("pff2:error!\r\n" + e.toString());
            return null;
        }
        try{
            ret = new File(pff2.fullName + "/" + scriptName + ".pref");
        }catch(e)
        {
            alert("ret:error!\r\n" + e.toString());
            return null;
        }
        if (ret == "noret") ret = null;
        return ret;

    }
	 var loadPref = function()
    {
        var prefFile = getPrefFile();
        if((prefFile!=null)&&(prefFile instanceof File)&&(prefFile.exists))
        {
            var s = "";
		    if (prefFile.open("r"))
            {
                try{
                    s = prefFile.read();
                    var obj = eval(s);
					v = obj.copies;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.copies = v; v=null;}
					v = obj.offset;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.offset = v; v=null;}
					v = obj.xpos;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.xpos = v; v=null;}
					v = obj.ypos;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.ypos = v; v=null;}
					v = obj.unit;
					if((v!=undefined)&&(typeof(v)=="number")){
						if (v<0){v=0;}else if (v>2){v=2;}
						pref.unit = v;
						v=null;
					}
					v = obj.dpi;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						if (v<72) {v=72;}
						pref.dpi = v;
						 v=null;
					}

                }catch(e){
                    savePref();
                }finally{
                    prefFile.close();
                }
    		}
        }
    }
    loadPref();
    //-------------------------------------------------------------------------
    var savePref = function()
    {
        var prefFile = getPrefFile();
        if ( (prefFile!=null)&&(prefFile instanceof File))
        {
            if (prefFile.open("w")){
                try{
                    prefFile.write(pref.toSource());
                    ret = true;
                }catch(e){
                    alert("savePref error\r\n" + e.toString());
                }finally{
                    prefFile.close();
                }
            }
        }else{
            alert("savePref : no prefFile!\r\n");
        }
    }
	//-------------------------------------------------------------------------
	Number.prototype.pointToMM = function()
	{
		try{
			return this/2.834645;
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
	//-------------------------------------------------------------------------
    var calcAngle = function (x, y) {
		return (Math.atan2(y, x) * 180) / Math.PI;
	}
	// ******************************************************************
	var getRotLen = function(obj,cx,cy)
	{
		var x = obj.left + obj.width/2;
		var y = obj.top - obj.height/2;
		var dx = x - cx;
		var dy = -(-y - (-cy));
		var ret = {};
		ret.len = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		ret.r = calcAngle(dx,dy)
		return ret
	}
	// ******************************************************************
	var moveObject = function(obj,c,o,x,y,)
	{
		if (o!=0)
		{
			obj.left = o * x + obj.left;
			obj.top  = o * -y + obj.top;
		}
		if(c>1)
		{
			for(var i=1; i<c;i++)
			{
				var no = obj.duplicate();
				no.name = obj.name+"_" + i;
				no.left = x * i + obj.left;
				no.top  = -y * i + obj.top;
			}
		}
	}
	// ******************************************************************
	var exec = function(c,o,x,y)
	{
		app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
		var ret = true;
		var selObj = app.activeDocument.selection
		if ( (selObj==null)||(selObj.length<=0) )
		{
			alert("選択してください");
			return ret;
		}
		if ((typeof(c)!="number")||(typeof(o)!="number")||(typeof(x)!="number")||(typeof(y)!="number"))
		{
			alert("パラメータが異常です");
			ret = false;
			return ret;
		}
		c = Math.floor(c);
		if (c<=0)
		{
			alert("copiesは1以上で");
			ret = false;
			return ret;
		}
		var xx = x;
		var yy = y;
		switch(pref.unit)
		{
			case 0:
				xx = x.mmToPoint();
				yy = y.mmToPoint();
				break;
			case 1:
				xx = x;
				yy = y;
				break;
			case 2:
				xx = x.pxToMM(pref.dpi).mmToPoint();
				yy = y.pxToMM(pref.dpi).mmToPoint();
				break;
		}

		for (var i=0; i < selObj.length; i++)
		{
			if (selObj[i].name=="")
			{
				selObj[i].name = selObj[i].typename +"i";
			}
			moveObject(selObj[i],c,o,xx,yy);
		}

		pref.copies = c;
		pref.offset = o;
		pref.xpos = x;
		pref.ypos = y;
		savePref();

		return ret;
	}
	// ******************************************************************

	// ******************************************************************
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
	// ******************************************************************
	var createUI=function()
	{
		var winObj = new Window("dialog",scriptName ,[0,0,320,150] );
		var stCopies = winObj.add("statictext",[12,12,12+55,12+20], "Copies" );
		var edCopies = winObj.add("edittext", [73,12,73+60,12+20], pref.copies +"");
		var stOffset = winObj.add("statictext",[146,12,146+55,12+20], "Offset" );
		var edOffset = winObj.add("edittext", [207,12,207+60,12+20], pref.offset );
		var stX = winObj.add("statictext",[12,38,12+55,38+20], "X" );
		var edX = winObj.add("edittext", [73,38,73+60,38+20], pref.xpos );
		var stY = winObj.add("statictext",[146,38,146+55,38+20], "Y" );
		var edY = winObj.add("edittext", [207,38,207+60,38+20], pref.ypos );
		var stUnit = winObj.add("statictext",[12,69,12+55,69+20], "単位" );
		var rbMM = winObj.add("radiobutton", [77,69,77+50,69+20], "mm");
		rbMM.value = true;
		var rbPoint = winObj.add("radiobutton", [130,69,130+50,69+20], "Point");
		rbPoint.value = false;
		var rbPixel = winObj.add("radiobutton", [186,69,186+50,69+20], "Pixel");
		rbPixel.value = false;
		var edDpi = winObj.add("edittext", [241,69,241+60,69+20], "300" );
		var btnApply = winObj.add("button", [92,98,92+130,98+36], "Apply");
		var btnUndo = winObj.add("button", [12,98,12+74,98+36], "Undo");
		var btnClose = winObj.add("button", [227,98,227+74,98+36], "Close");

		var rbs = [];
		rbs.push(rbMM);
		rbs.push(rbPoint);
		rbs.push(rbPixel);
		for (var i=0; i<rbs.length; i++)
		{
			rbs[i].cIndex=i;
			rbs[i].onClick = function()
			{
				pref.unit = this.cIndex;
				edDpi.enabled = (pref.unit ==2);
			}
		}
		rbs[pref.unit].value = true;

		function setEnabled(sw)
		{
			rbs[0].enabled = rbs[1].enabled = rbs[2].enabled = sw;
			if (sw==false)
			{
				edDpi.enabled = false;
			}else{
				edDpi.enabled = (pref.unit ==2);
			}
			btnApply.enabled = sw;
			btnUndo.enabled = !sw;

		}
		setEnabled(true);
		var undoCount =0;
		btnApply.onClick = function()
		{
			var c = getED(edCopies);
			if (c==null){alert("copies err"); return;}
			c = Math.floor(c);
			if(c<=0){
				alert("複製は１個以上で");
				return;
			}
			var o = getED(edOffset);
			if (o==null){alert("offset err"); return;}
			var x = getED(edX);
			if (x==null){alert("x err"); return;}
			var y = getED(edY);
			if (y==null){alert("y err"); return;}
			var dpi = getED(edDpi);
			if (dpi!=null)
			{
				pref.dpi = dpi;
			}else{
				alert("dpi err");
				return;
			}

			if (exec(c,o,x,y)==true)
			{
				undoCount+=1;
				setEnabled(false);
				app.redraw();
			}
		}
		btnUndo.onClick = function()
		{
			if (undoCount<=0) return;
			undoCount-=1;
			setEnabled(true);
			app.undo();
			app.redraw();
		}

		winObj.center();
		winObj.show();
	}

	if (app.activeDocument!=null)
	{
		if(app.activeDocument.selection.length!=1)
		{}
		createUI();
	}
})(this);
