
#targetengine "main"
(function (me){
	var pref = {};
	pref.unitMode = 0;
	pref.moveV = 10;
	pref.dpi = 300;
	pref.anchorMode= 4;
	pref.scale = 100;
	pref.isScaleXY = false;
	pref.scaleX =100;
	pref.scaleY =100;
	pref.left=0;
	pref.top=0;
	var scriptName ="拡大縮小";
	var undoCount = 0;
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
					v = obj.moveV;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.moveV = v; v=null;}
					v = obj.unitMode;
					if((v!=undefined)&&(typeof(v)=="number")){
						if (v<0){v=0;}else if (v>2){v=2;}
						pref.unitMode = v;
						v=null;
					}
					v = obj.dpi;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						if (v<72) {v=72;}
						pref.dpi = v;
						 v=null;
					}
					v = obj.anchorMode;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						pref.anchorMode = v;
						 v=null;
					}
					v = obj.scale;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						pref.scale = v;
						 v=null;
					}
					v = obj.scaleX;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						pref.scaleX = v;
						 v=null;
					}
					v = obj.scaleY;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						pref.scaleY = v;
						 v=null;
					}
					v = obj.isScaleXY;
					if((v!=undefined)&&(typeof(v)=="boolean"))
					{
						pref.isScaleXY = v;
						 v=null;
					}
					v = obj.left;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						pref.left = v;
						 v=null;
					}
					v = obj.top;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						pref.top = v;
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
	// ****************************************************************************************************************
	var getObjPos = function(obj,anc)
	{
		var ret = [0,0];
		switch(anc)
		{
			case 0:
				ret[0] =  obj.left;
				ret[1] =  obj.top;
				break;
			case 1:
				ret[0] =  obj.left + obj.width/2;
				ret[1] =  obj.top;
				break;
			case 2:
				ret[0] =  obj.left + obj.width;
				ret[1] =  obj.top;
				break;
			case 3:
				ret[0] =  obj.left;
				ret[1] =  obj.top -obj.height/2;
				break;
			case 4:
				ret[0] =  obj.left + obj.width/2;
				ret[1] =  obj.top -obj.height/2;
				break;
			case 5:
				ret[0] =  obj.left + obj.width;
				ret[1] =  obj.top -obj.height/2;
				break;
			case 6:
				ret[0] =  obj.left;
				ret[1] =  obj.top -obj.height;
				break;
			case 7:
				ret[0] =  obj.left + obj.width/2;
				ret[1] =  obj.top -obj.height;
				break;
			case 8:
				ret[0] =  obj.left + obj.width;
				ret[1] =  obj.top - obj.height;
				break;
		}
		return ret;
	}
	var setObjPos = function(obj,v,anc)
	{
		switch(anc)
		{
			case 0:
				obj.left = v[0];
				obj.top = v[1];
				break;
			case 1:
				obj.left = v[0] -obj.width/2;
				obj.top = v[1];
				break;
			case 2:
				obj.left = v[0] -obj.width;
				obj.top = v[1];
				break;
			case 3:
				obj.left = v[0];
				obj.top = v[1] + obj.height/2;
				break;
			case 4:
				obj.left = v[0] -obj.width/2;
				obj.top = v[1] + obj.height/2;
				break;
			case 5:
				obj.left = v[0] -obj.width;
				obj.top = v[1] + obj.height/2;
				break;
			case 6:
				obj.left = v[0];
				obj.top = v[1] + obj.height;
				break;
			case 7:
				obj.left = v[0] -obj.width/2;
				obj.top = v[1] + obj.height/2;
				break;
			case 8:
				obj.left = v[0] -obj.width;
				obj.top = v[1] + obj.height/2;
				break;
		}
	}
	// ****************************************************************************************************************
	var moveObject = function(mv,mode)
	{
		var selObj = app.activeDocument.selection;

		app.redraw();
	}
	// ****************************************************************************************************************
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
	var createDialog = function()
	{
		if (app.activeDocument==null) return;
		if (app.activeDocument.selection.length!=1)
		{
			alert("１個オブジェクトを選択してください")
			return;
		}
		var selObj = app.activeDocument.selection[0];
		x = 5;
		y = 8;
		var winObj = new Window("dialog",scriptName ,[0,0,240,250]);
		var stScale = winObj.add("statictext",[x,y,x+40,y+25],"scale");
		x += 25;
		var edScale = winObj.add("edittext",[x,y,x+100,y+25],pref.scale +"");
		edScale.enabled = ! pref.isScaleXY;
		y += 25;
		x = 5;
		var cbIsScaleXY = winObj.add("checkbox",[x,y,x+200,y+25],"XY個別に指定");
		cbIsScaleXY.value = pref.isScaleXY;
		cbIsScaleXY.onClick=function()
		{
			pref.isScaleXY = cbIsScaleXY.value;
			edScale.enabled = ! pref.isScaleXY;
			edScaleX.enabled = edScaleY.enabled = pref.isScaleXY;
		}
		y += 25;
		var stScaleX = winObj.add("statictext",[x,y,x+40,y+25],"scaleX");
		x += 40;
		var edScaleX = winObj.add("edittext",[x,y,x+100,y+25],pref.scaleX +"");
		x = 5;
		y += 25;
		var stScaleY = winObj.add("statictext",[x,y,x+40,y+25],"scaleY");
		x += 40;
		var edScaleY = winObj.add("edittext",[x,y,x+100,y+25],pref.scaleY +"");
		edScaleX.enabled = edScaleY.enabled = pref.isScaleXY;
		x = 5;
		y += 30;
		var cbPositions = winObj.add("checkbox",[x,y,x+150,y+25],"Positions");
		cbPositions.value=true;
		cbPositions.enabled = false;
		y += 25;
		var cbFillPatterns = winObj.add("checkbox",[x,y,x+150,y+25],"FillPatterns");
		cbFillPatterns.value=true;
		cbFillPatterns.enabled = false;
		y += 25;
		var cbFillGradients = winObj.add("checkbox",[x,y,x+150,y+25],"FillGradients");
		cbFillGradients.value=true;
		cbFillGradients.enabled = false;
		y += 25;
		var cbStrokePattern = winObj.add("checkbox",[x,y,x+150,y+25],"StrokePattern");
		cbStrokePattern.value=true;
		cbStrokePattern.enabled = false;
		y += 25;
		var stLineWidths = winObj.add("statictext",[x,y,x+40,y+25],"LineWidths");
		x += 25;
		var edLineWidths = winObj.add("edittext",[x,y,x+100,y+25],"100");
		edLineWidths.enabled = false;
		x = 160;
		y = 5
		var stAnchor = winObj.add("statictext",[x,y,x+90,y+25],"基点");
		y+= 25;
		var gAnchor = winObj.add("group",[x,y,x+60,y+60],"XY個別に指定");
		x=0;y=0;
		rbAnchor = [];
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x+=20;
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x+=20;
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x=0;y+=20;
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x+=20;
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x+=20;
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x=0;y+=20;
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x+=20;
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x+=20;
		rbAnchor.push(gAnchor.add("radiobutton",[x,y,x+20,y+20],"")); x=0;y+=25;
		rbAnchor[pref.anchorMode].value = true;

		for(var i=0; i<rbAnchor.length;i++)
		{
			rbAnchor[i].cIndex = i;
			rbAnchor[i].onClick=function()
			{
				pref.anchorMode = this.cIndex;
			}
		}
		x += 160;
		y += 80;
		var btnApply = winObj.add("button",[x,y,x+60,y+25],"Apply");
		y += 30;
		var btnUndo = winObj.add("button",[x,y,x+60,y+25],"Undo");
		btnUndo.enabled = false;
		btnUndo.onClick = function()
		{
			if (undoCount>0){
				app.undo();
				app.redraw();
				undoCount-=1;
				if (undoCount<=0){
					btnUndo.enabled = false;
					return;
				}
			}
		}

		btnApply.onClick = function()
		{
			var sl = getED(edScale);
			var sx = getED(edScaleX);
			var sy = getED(edScaleY);

			//var pos = getObjPos(selObj,pref.anchorMode);
			if (pref.isScaleXY==false)
			{
				if(sl==null)
				{
					alert("パラメータ異常");
					return;
				}
				pref.scale = sl;
				sx = sl;
				sy = sl;
			}else{
				if ((sx==null)||(sy==null))
				{
					alert("パラメータ異常");
					return;
				}
				pref.scaleX = sx;
				pref.scaleY = sy;
			}
			var tf = Transformation.CENTER;
			switch(pref.anchorMode)
			{
				case 0:
					tf = Transformation.TOPLEFT;break;
				case 1:
					tf = Transformation.TOP;break;
				case 2:
					tf = Transformation.TOPRIGHT;break;
				case 3:
					tf = Transformation.LEFT;break;
				case 4:
					tf = Transformation.CENTER;break;
				case 5:
					tf = Transformation.RIGHT;break;
				case 6:
					tf = Transformation.BOTTOMLEFT;break;
				case 7:
					tf = Transformation.BOTTOM;break;
				case 8:
					tf = Transformation.BOTTOMRIGHT;break;

			}
			selObj.resize(
				sx,
				sy,
				true,
				true,
				true,
				true,
				100,
				tf
				);
			//setObjPos(selObj,pos,pref.anchorMode);
			undoCount+=1;
			btnUndo.enabled = (undoCount>0);
			app.redraw();
			endExec();
		}


		if ((pref.left==0)&&(pref.top==0))
		{
			winObj.center();
		}else{
			var b = winObj.bounds;
			var w = b[2] -b[0];
			var h = b[3] -b[1];
			b[0] = pref.left;
			b[1] = pref.top;
			b[2] = b[0] + w;
			b[3] = b[1] + h;
			winObj.bounds = b;
		}
		var endExec = function()
		{
			var b = winObj.bounds;
			pref.left = b[0];
			pref.top = b[1];
			savePref();
		}
		winObj.onClose = endExec;
		winObj.show();
	}
	createDialog();

})(this);