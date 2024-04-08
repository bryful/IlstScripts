(function (me){
	var pref ={};
	pref.unitMode = 0;
	pref.dpi = 300;
	pref.left = 0;
	pref.top = 0;
	pref.width = 730;
	pref.height = 450;
	var scriptName = "パスデータ";
var getPrefFile = function()
    {
        var ret = "noret";
        var pff = "none";
        var pff2 = "none2";
		var scriptName ="アートワーク中心に回転";

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
					v = obj.unitMode;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.unitMode = v; v=null;}
					v = obj.dpi;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.dpi = v; v=null;}
					v = obj.rot;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.rot = v; v=null;}
					v = obj.left;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.left = v; v=null;}
					v = obj.top;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.top = v; v=null;}
					v = obj.width;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.width = v; v=null;}
					v = obj.height;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.height = v; v=null;}

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
	//**************************************************************************************
	var toValue=function(v)
	{
		var ret =[0,0];
		switch(pref.unitMode)
		{
			case 0:
				ret[0] = v[0].pointToMM();
				ret[1] = v[1].pointToMM();
				break;
			case 1:
				ret[0] = v[0];
				ret[1] = v[1];
				break;
			case 2:
				ret[0] = v[0].pointToMM().mmToPx(pref.dpi);
				ret[1] = v[1].pointToMM().mmToPx(pref.dpi);
				break;
		}
		return ret;
	}
	//**************************************************************************************
	var fromValue=function(v)
	{
		var ret =[0,0];
		switch(pref.unitMode)
		{
			case 0:
				ret[0] = v[0].mmToPoint();
				ret[1] = v[1].mmToPoint();
				break;
			case 1:
				ret[0] = v[0];
				ret[1] = v[1];
				break;
			case 2:
				ret[0] = v[0].pxToMM(pref.dpi).mmToPoint();
				ret[1] = v[1].pxToMM(pref.dpi).mmToPoint();
				break;
		}
		return ret;
	}
	var dispValue = function(v)
	{
		var ret = "";
		for(var i=0; i<v.length;i++)
		{
			var s = [0,0,0];
			s[0] = toValue(v[i][0]);
			s[1] = toValue(v[i][1]);
			s[2] = toValue(v[i][2]);
			ret += s.toSource()+",\r\n";
		}
		ret = "[\r\n" + ret +"]\r\n";

		return ret;

	}
	var valueFromDisp = function(str)
	{
		var ret = null;
		try{
			var obj = eval(str);
			if (obj.length>0)
			{
				ret = [];
				for(var i=0; i<obj.length;i++)
				{
					var s = [0,0,0];
					s[0] = fromValue(obj[i][0]);
					s[1] = fromValue(obj[i][1]);
					s[2] = fromValue(obj[i][2]);
					ret.push(s);
				}
			}

		}catch(e){
			ret =null;
		}
		return ret;
	}
	var getPathData = function(obj)
	{
		var ret = [];
		if ((obj instanceof PathItem)==false)
		{
			alert("パスを選択してください");
			return ret;
		}
		for(var i=0; i<obj.pathPoints.length;i++)
		{
			var p =[];
			var a = [];
			a.push(obj.pathPoints[i].anchor[0]);
			a.push(obj.pathPoints[i].anchor[1]);
			p.push(a);
			var l = [];
			l.push(obj.pathPoints[i].leftDirection[0]-obj.pathPoints[i].anchor[0]);
			l.push(obj.pathPoints[i].leftDirection[1]-obj.pathPoints[i].anchor[1]);
			p.push(l);
			var r = [];
			r.push(obj.pathPoints[i].rightDirection[0]-obj.pathPoints[i].anchor[0]);
			r.push(obj.pathPoints[i].rightDirection[1]-obj.pathPoints[i].anchor[1]);
			p.push(r);
			ret.push(p);
		}
		return ret;
	}
	var setPathData = function(obj,data)
	{
		var ret = false;
		function addP(a,b)
		{
			return [a[0]+b[0],a[1]+b[1]];
		}
		if ((obj instanceof PathItem)==false)
		{
			alert("パスを選択してください");
			return ret;
		}
		try{
			var cnt =obj.pathPoints.length;
			if (cnt>data.length) {cnt = data.length; }
			for(var i=0; i<cnt;i++)
			{
				obj.pathPoints[i].anchor = data[i][0];
				obj.pathPoints[i].leftDirection = addP(data[i][0],data[i][1]);
				obj.pathPoints[i].rightDirection = addP(data[i][0],data[i][2]);
			}
			ret = true;
		}catch(e){
			ret = false;
			alert(e.toString());
		}
		return ret;
	}
	//**************************************************************************************
	var createUI = function()
	{
		var pathdata=[];
		var backdata=[];

		var selObj = app.activeDocument.selection;
		if (selObj.length!=1)
		{
			alert("１個だけ選択してください");
			return;
		}
		if ((selObj[0] instanceof PathItem)==false)
		{
			alert("パスを選択してください");
			return;

		}
		var rct = [pref.left,pref.top,pref.left + pref.width,pref.top+ pref.height];
		var winObj = new Window("dialog",scriptName ,rct,{resizeable : true} );
		var a_group1 = winObj.add("group", [12,4,12+236,4+30]);
		var rbMM = a_group1.add("radiobutton", [3,3,3+44,3+24], "mm");
		var rbPoint = a_group1.add("radiobutton", [53,3,53+50,3+24], "Point");
		var rbPixel = a_group1.add("radiobutton", [108,3,108+50,3+24], "Pixel");
		var edDPI = a_group1.add("edittext", [158,3,158+50,4+24], pref.dpi );
		var rba = [rbMM,rbPoint,rbPixel];
		rba[pref.unitMode].value =true;
		edDPI.enabled = (pref.unitMode == 2);
		for(var i=0; i<rba.length;i++)
		{
			rba[i].cIndex =i;
			rba[i].onClick=function()
			{
				pref.unitMode = this.cIndex;
				edDPI.enabled = (pref.unitMode == 2);
				pref.dpi = eval(edDPI.text);
				ed.text = dispValue(pathdata);
				endExec();
			}
		}



		var cbEdit = winObj.add("checkbox", [254,3,254+98,3+24], "値を編集する");
		cbEdit.value = false;

		var ed = winObj.add("edittext", [12,35,12+695,35+360], "" ,{multiline:true,scrollable:true});
		ed.readonly = true;
		var btnUndo = winObj.add("button", [500,400,499+101,400+30], "Undo");
		var btnApply = winObj.add("button", [606,400,606+101,400+30], "Apply");

		function setEdit(b)
		{
			rba[0].enabled = !b;
			rba[1].enabled = !b;
			rba[2].enabled = !b;
			if (b==true)
			{
				edDPI.enabled = false;
			}else{
				edDPI.enabled = (pref.unitMode == 2);
			}
			ed.readonly = ! b;
			ed.enabled = true;
			btnApply.enabled = b;
			btnUndo.enabled = b;
		}
		setEdit(false);
		cbEdit.onClick=function()
		{
			setEdit(this.value);
		}



		function resize()
		{
			var b = winObj.bounds;
			var w = b[2] - b[0];
			var h = b[3] - b[1];
			var edb = ed.bounds;
			edb[2] = w-12;
			edb[3] = h-50;
			ed.bounds = edb;
			var edu = btnUndo.bounds;
			edu[0] = w-240;
			edu[1] = h-42;
			edu[2] = edu[0]+100;
			edu[3] = edu[1]+30;
			btnUndo.bounds = edu;
			var eda = btnApply.bounds;
			eda[0] = w-130;
			eda[1] = h-42;
			eda[2] = eda[0]+100;
			eda[3] = eda[1]+30;
			btnApply.bounds = eda;
		}
		resize();
		winObj.onResize = resize;
		function endExec()
		{
			var b =winObj.bounds;
			pref.left =b[0];
			pref.top =b[1];
			pref.width =b[2] - b[0];
			pref.height =b[3]- b[1];
			savePref();
		}
		winObj.onClose = endExec;

		pathdata = getPathData(selObj[0]);

		var undoCount =0;
		function setData()
		{
			var data = valueFromDisp(ed.text);
			if (data!=null)
			{
				if (setPathData(selObj[0],data))
				{
					backdata = pathdata;
					pathdata = data;
					app.redraw();
					undoCount++;
				}
			}

		}
		btnApply.onClick = setData;
		btnUndo.onClick = function()
		{
			if (undoCount>0)
			{
				pathdata = backdata;
				backdata = [];
				ed.text = dispValue(pathdata);
				setPathData(selObj[0],pathdata);
				app.redraw();
				undoCount--;
			}
		}

		ed.text = dispValue(pathdata);

		if ((pref.left==0)||(pref.top==0))
		{
			winObj.center();

		}
		winObj.show();
	}

	if (app.activeDocument!=null)
	{
		createUI();
	}
})(this);
