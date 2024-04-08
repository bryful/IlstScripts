#targetengine main

var bry_AA_hor = {};

(function (){
	var pref = {};
	pref.unitMode = 0;
	pref.moveV = 10;
	pref.dpi = 300;
	pref.anchorMode= 1;

	var scriptName ="動的配置-水平";



	// ****************************************************************************************************************
	var selObjects = function()
	{
		var ret = [];
		try{
			ret = app.activeDocument.selection;
		}catch(e)
		{
			alert(e.toString());
		}
		return ret;
	}
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
	var sortX= function(objs)
	{
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
		ret.sort(sortXsub)
		return ret;
	}
	// ****************************************************************************************************************
	var getObjPos = function(obj)
	{
		var ret = 0;
		ret =  obj.left + obj.width/2;
		return ret;
	}
	var setObjPos = function(obj,v)
	{
		obj.left =  v - obj.width/2;
	}
	// ****************************************************************************************************************
	var moveObject = function(mv,mode)
	{
		var selObj =selObjects();
		if(selObj.length<=1) return;
		selObj = sortX(selObj);

		var minX=selObj[0].left + selObj[0].width/2;
		var maxX=selObj[selObj.length-1].left + selObj[selObj.length-1].width/2;

		var srcLen = maxX - minX;
		var cnt = selObj.length-1;

		switch(pref.anchorMode)
		{
			case 0:
				var len = 0;
				var start = minX;
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
				for(var i=0; i<selObj.length;i++)
				{
					setObjPos(selObj[i],start);
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
				start = (minX+maxX)/2 - newLen/2;
				len = newLen/cnt;
				for(var i=0; i<selObj.length;i++)
				{
					setObjPos(selObj[i],start);
					start += len;
				}
				break;
			case 2:
				var len = 0;
				var start = maxX;
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
				for(var i=selObj.length-1; i>=0;i--)
				{
					setObjPos(selObj[i],start);
					start -= len;
				}
				break;
		}
		app.redraw();
	}

	// ****************************************************************************************************************
	var createDialog = function()
	{
		if (app.activeDocument==null) return;
		if (app.activeDocument.selection.length<=1) return;
		function getMoveV()
		{
			var ret = null;
			var mv = pref.moveV;
			try{
				mv = eval(edValue.text);

				if (typeof(mv)=="number")
				{
					ret = mv;
					pref.moveV = mv;
				}
				if (mv==0)
				{
					ret = null;
					return ret;
				}
			}catch(e){
				alert("パラメータ異常\r\n"+e.toString());
				ret =null;
			}
			switch(pref.unitMode)
			{
				case 0:
					ret = ret.mmToPoint();
					break;
				case 1:
					break;
				case 2:
					try{
						dpi = eval(edDpi.text);
						if (typeof(dpi)!="number")
						{
							ret = null;
							return;
						}
						if (dpi<72)
						{
							dpi = 72;
							edDpi.text = dpi+"";
						}
						pref.dpi = dpi;
						ret = ret.pxToMM(pref.dpi).mmToPoint();
					}catch(e){
						alert("dpi異常\r\n"+e.toString());
						ret =null;
					}
					break;


			}
			return ret;
		}

		var winObj = new Window("dialog",scriptName ,[0,0,280,170]);
		x = 5;
		y = 5;
		var edValue = winObj.add("edittext",[x,y,x+270,y+25],pref.moveV+"");
		y += 30;
		var gunit = winObj.add("group",[x,y,x+270,y+30]);
		var cbs =[];
		var x0=0;
		var y0=0;
		cbs.push(gunit.add("radiobutton",[x0,y0,x0+55,y0+25],"mm"));
		x0 +=60;
		cbs.push(gunit.add("radiobutton",[x0,y0,x0+55,y0+25],"Point"));
		x0 +=60;
		cbs.push(gunit.add("radiobutton",[x0,y0,x0+55,y0+25],"Pixel"));
		x0 +=60;
		var stDpi = gunit.add("statictext",[x0,y0,x0+30,y0+25],"dpi");
		x0 += 30;
		var edDpi = gunit.add("edittext",[x0,y0,x0+50,y0+25],pref.dpi);

		cbs[pref.unitMode].value = true;
		edDpi.enabled = (pref.unitMode ==2);

		for(var i=0;i<cbs.length;i++)
		{
			cbs[i].cIndex=i;
			cbs[i].onClick = function()
			{
				pref.unitMode = this.cIndex;
				edDpi.enabled = (pref.unitMode ==2);
				savePref();
			}
		}
		x = 5;
		y += 25;
		var stAnchor = winObj.add("statictext",[x,y,x+270,y+30],"配置基準");
		y += 25;
		var ganchor = winObj.add("group",[x,y,x+270,y+30]);
		x0=0;
		y0=0;
		var cba =[];
		cba.push(ganchor.add("radiobutton",[x0,y0,x0+80,y0+25],"左合わせ"));
		x0 +=90;
		cba.push(ganchor.add("radiobutton",[x0,y0,x0+80,y0+25],"中央合わせ"));
		x0 +=90;
		cba.push(ganchor.add("radiobutton",[x0,y0,x0+80,y0+25],"右合わせ"));
		x0 +=90;
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
		y+=25;
		var btnAdd = winObj.add("button",[x,y,x+80,y+30],"間隔に加算");
		x+=85;
		var btnInc = winObj.add("button",[x,y,x+80,y+30],"間隔に減算");
		x+=95;
		var btnEql = winObj.add("button",[x,y,x+80,y+30],"間隔に設定");
		btnAdd.onClick = function()
		{
			var w = getMoveV();
			if(w==null) return;
			moveObject(w,0);
		}
		btnInc.onClick = function()
		{
			var w = getMoveV();
			if(w==null) return;
			moveObject(w,1);
		}
		btnEql.onClick = function()
		{
			var w = getMoveV();
			if(w==null) return;
			moveObject(w,2);
		}
		winObj.onClose = function()
		{
			savePref();
		}

		winObj.center();
		winObj.show();


	}
	createDialog();
	savePref();
})();