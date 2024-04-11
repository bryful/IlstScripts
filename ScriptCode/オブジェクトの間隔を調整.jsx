(function (me){
	var pref = {};
	pref.unitMode = 1;
	pref.moveV = 10;
	pref.dpi = 72;
	pref.anchorMode= 1;
	pref.mode =0;

	var scriptName ="オブジェクトの間隔を調整";

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
					v = obj.mode;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.mode = v; v=null;}
					v = obj.moveV;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.moveV = v; v=null;}
					v = obj.unitMode;
					if((v!=undefined)&&(typeof(v)=="number")){
						if (v<0){v=0;}else if (v>2){v=2;}
						pref.unitMode = v;
						v=null;
					}
					v = obj.anchorMode;
					if((v!=undefined)&&(typeof(v)=="number"))
					{
						pref.anchorMode = v;
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
	// ****************************************************************************************************************
	var sortObj= function(objs)
	{
		function sortYsub(a,b)
		{
			var ay = -a.top + a.height/2;
			var by = -b.top + b.height/2;
			if (ay == by)
			{
				return 0;
			}
			else if (ay>by)
			{
				return 1;
			}else{
				return -1;
			}
		}
		function sortXsub(a,b)
		{
			var ax = a.left + a.width/2;
			var bx = b.left + b.width/2;
			if (ax == bx)
			{
				return 0;
			}
			else if (ax>bx)
			{
				return 1;
			}else{
				return -1;
			}
		}
		var ret = objs;
		if (pref.mode==0)
		{
			ret = ret.sort(sortXsub)
		}else{
			ret = ret.sort(sortYsub)
		}
		return ret;
	}
	// ****************************************************************************************************************
	var getObjPos = function(obj)
	{
		var ret = 0;
		if(pref.mode==0)
		{
			ret =  obj.left + obj.width/2;
		}else{
			ret =  obj.top - obj.height/2;
		}
		return ret;
	}
	var setObjPos = function(obj,v)
	{
		if(pref.mode==0)
		{
			obj.left =  v - obj.width/2;
		}else{
			obj.top  =  v + obj.height/2;
		}
	}
	// ****************************************************************************************************************
	var moveObject = function(mv,mode)
	{
		var selObj = app.activeDocument.selection;
		if(selObj.length<=1) return;
		selObj = sortObj(selObj);

		var s = "";
		for (var i=0; i<selObj.length;i++)
		{
			s += "l:" + selObj[i].left + "t:" + selObj[i].top +"r\n";
		}
		//alert(s);
		var minV=0;
		var maxV=0;
		if (pref.mode==0)
		{
			minV= selObj[0].left + selObj[0].width/2;
			maxV= selObj[selObj.length-1].left + selObj[selObj.length-1].width/2;

		}else{
			minV= -selObj[0].top + selObj[0].height/2;
			maxV= -selObj[selObj.length-1].top + selObj[selObj.length-1].height/2;

		}

		var srcLen = maxV - minV;
		var cnt = selObj.length-1;

		switch(pref.anchorMode)
		{
			case 0:
				var len = 0;
				var start = minV;
				switch(mode)
				{
					case 0:
						len = srcLen/cnt + mv;
						break;
					case 1:
						len = srcLen/cnt - mv;
						break;
					case 2:
						len = mv;
						break;
				}
				var op=1;
				if (pref.unitMode==1) op=-1;
				for(var i=0; i<selObj.length;i++)
				{
					setObjPos(selObj[i],start*op);
					start += len;
				}
				break;
			case 1:
				var newLen = 0;
				switch(mode)
				{
					case 0:
						newLen = srcLen + mv*cnt;
						break;
					case 1:
						newLen = srcLen - mv*cnt;
						break;
					case 2:
						newLen = mv*cnt;
						break;
				}
				start = (minV+maxV)/2 - newLen/2;
				len = newLen/cnt;
				for(var i=0; i<selObj.length;i++)
				{
				var op=1;
				if (pref.unitMode==1) op=-1;
					setObjPos(selObj[i],start*op);
					start += len;
				}
				break;
			case 2:
				var len = 0;
				var start = maxV;
				switch(mode)
				{
					case 0:
						len = srcLen/cnt + mv;
						break;
					case 1:
						len = srcLen/cnt - mv;
						break;
					case 2:
						len = mv;
						break;
				}
				var op=1;
				if (pref.unitMode==1) op=-1;
				for(var i=selObj.length-1; i>=0;i--)
				{
					setObjPos(selObj[i],start*op);
					start -= len;
				}
				break;
		}
		app.redraw();
	}
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
	// ****************************************************************************************************************
	var createUI = function()
	{
		function getValue()
		{
			var ret = null;
			var mv = pref.moveV;
			ret = getED(edValue);
			if ((ret == null)||(ret <=0))
			{
				ret = null;
				alert("value reeor!");
				return ret;
			}
			if (pref.unitMode==0) ret.mmToPoint();
			return ret;
		}
		var w = 300;
		var winObj = new Window("dialog",scriptName ,[0,0,w,180]);
		x = 5;
		y = 5;
		var gunit = winObj.add("group",[x,y,x+270,y+30]);
		var cbm =[];
		var x0=0;
		var y0=0;
		cbm.push(gunit.add("radiobutton",[x0,y0,x0+70,y0+25],"水平方向"));
		x0 +=70;
		cbm.push(gunit.add("radiobutton",[x0,y0,x0+70,y0+25],"垂直方向"));
		x0 +=70;
		y += 30;
		var edValue = winObj.add("edittext",[x,y,x+270,y+25],pref.moveV+"");
		y += 30;
		var gunit = winObj.add("group",[x,y,x+270,y+30]);
		var cbs =[];
		x0=0;
		y0=0;
		cbs.push(gunit.add("radiobutton",[x0,y0,x0+55,y0+25],"mm"));
		x0 +=60;
		cbs.push(gunit.add("radiobutton",[x0,y0,x0+55,y0+25],"Pixel"));
		x0 +=60;


		x = 5;
		y += 25;
		var stAnchor = winObj.add("statictext",[x,y,x+270,y+30],"配置基準");
		y += 25;
		var ganchor = winObj.add("group",[x,y,x+270,y+30]);
		x0=0;
		y0=0;
		var cba =[];
		cba.push(ganchor.add("radiobutton",[x0,y0,x0+90,y0+25],"上合わせ"));
		x0 +=90;
		cba.push(ganchor.add("radiobutton",[x0,y0,x0+90,y0+25],"中央合わせ"));
		x0 +=90;
		cba.push(ganchor.add("radiobutton",[x0,y0,x0+90,y0+25],"下合わせ"));
		x0 +=90;
		y+=25;
		var btnAdd = winObj.add("button",[x,y,x+80,y+30],"間隔に加算");
		x+=85;
		var btnInc = winObj.add("button",[x,y,x+80,y+30],"間隔に減算");
		x+=95;
		var btnEql = winObj.add("button",[x,y,x+80,y+30],"間隔に設定");

		function setMode()
		{
			switch(pref.mode)
			{
				case 0:
					cba[0].text = "左合わせ"
					cba[1].text = "中央合わせ"
					cba[2].text = "右合わせ"
					break;
				case 1:
					cba[0].text = "上合わせ"
					cba[1].text = "中央合わせ"
					cba[2].text = "下合わせ"
					break;
			}
		}
		for(var i=0;i<cbm.length;i++)
		{
			cbm[i].cIndex=i;
			cbm[i].onClick = function()
			{
				pref.mode = this.cIndex;
				setMode();
				savePref();
			}
		}
		cbm[pref.mode].value = true;
		setMode();
		for(var i=0;i<cbs.length;i++)
		{
			cbs[i].cIndex=i;
			cbs[i].onClick = function()
			{
				pref.unitMode = this.cIndex;
				savePref();
			}
		}
		cba[pref.anchorMode].value = true;
		for(var i=0;i<cba.length;i++)
		{
			cba[i].cIndex=i;
			cba[i].onClick = function()
			{
				pref.anchorMode = this.cIndex;
				savePref();
			}
		}
		cbs[pref.unitMode].value = true;


		btnAdd.onClick = function()
		{
			var w = getValue();
			if(w==null) return;
			moveObject(w,0);
		}
		btnInc.onClick = function()
		{
			var w = getValue();
			if(w==null) return;
			moveObject(w,1);
		}
		btnEql.onClick = function()
		{
			var w = getValue();
			if(w==null) return;
			moveObject(w,2);
		}


		winObj.center();
		winObj.show();

	}
	if (app.activeDocument!=null)
	{
		if (app.activeDocument.selection.length>1)
		{
			createUI();
		}else{
			alert("オブジェクトを２個以上選択してください");
		}

	}else{
		alert("no document");
	}
})(this);