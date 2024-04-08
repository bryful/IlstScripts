(function (me){
	var pref = {};
	pref.copies = 3;
	pref.offset = 0;
	pref.rot = 0;
	pref.rotFlag = true;


 // 環境設定ファイルのFileオブジェクトを返す
    // 無かったらフォルダの作成も行う
    // "C:\Users\<ユーザー名>\AppData\Roaming\bry-ful\aep置き換え\aep置き換え.pref"
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
					v = obj.copies;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.copies = v; v=null;}
					v = obj.offset;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.offset = v; v=null;}
					v = obj.rot;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.rot = v; v=null;}
					v = obj.rotFlag;
					if((v!=undefined)&&(typeof(v)=="boolean")){pref.rotFlag = v; v=null;}

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
	var rotObject = function(obj,r,cx,cy,rFlag)
	{
		var p = getRotLen(obj,cx,cy);
		var nx = p.len * Math.cos( (p.r + r)*Math.PI/180);
		var ny = p.len * Math.sin( (p.r + r)*Math.PI/180);
		obj.left = nx + cx - obj.width/2;
		obj.top  = ny + cy + obj.height/2;
		if (rFlag) obj.rotate(r);
		return p.len;
	}
	// ******************************************************************
	var exec = function(c,o,r,fFlag)
	{
		var execInfo ={};
		execInfo.objs =[];
		execInfo.radius =0;
		app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
		var ret = true;
		var selObj = app.activeDocument.selection
		if ( (selObj==null)||(selObj.length!=1) )
		{
			alert("１個だけ選択してください");
			return exec;
		}
		if ((typeof(c)!="number")||(typeof(o)!="number")||(typeof(r)!="number"))
		{
			alert("パラメータが異常です");
			return execInfo;
		}
		if (c<=0)
		{
			alert("copiesは1以上で");
			return execInfo;
		}
		// アートボードの中心
		// 中心を求める
		var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		var rct = app.activeDocument.artboards[idx].artboardRect;
		var cx = (rct[2]+rct[0])/2;
		var cy = (rct[3]+rct[1])/2;

		if (o!=0)
		{
			execInfo.radius = rotObject(selObj[0],r*o,cx,cy,fFlag);
		}
			execInfo.objs.push(selObj[0]);
		if (c>1)
		{
			for(var i=1; i<c;i++)
			{
				var no = selObj[0].duplicate();
				execInfo.radius = rotObject(no, r*i,cx,cy,fFlag);
				execInfo.objs.push(no);
			}
		}
		pref.copies = c;
		pref.offset = o;
		pref.rot = r;
		pref.rotFlag = fFlag;
		app.redraw();
		savePref();

		return execInfo;
	}
	// ******************************************************************
	var setRadius = function(objs,ar)
	{
		var ret =0;
		var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		var rct = app.activeDocument.artboards[idx].artboardRect;
		var cx = (rct[2]+rct[0])/2;
		var cy = (rct[3]+rct[1])/2;

		for (var i=0; i<objs.length;i++)
		{
			var o = objs[i];

			var p = getRotLen(o,cx,cy);
			ret = p.len+ar;
			if (ret <0) ret =0;
			var nx = (ret) * Math.cos( p.r*Math.PI/180);
			var ny = (ret) * Math.sin( p.r*Math.PI/180);
			o.left = nx + cx - o.width/2;
			o.top  = ny + cy + o.height/2;
		}

		return ret;
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
	// ******************************************************************

	var createUI = function()
	{
		var winObj = new Window("dialog","アートボードで回転" ,[785,429,785+349,429+150] );
		var stCopies = winObj.add("statictext",[12,10,12+55,10+20], "Copies" );
		var edCopies = winObj.add("edittext", [73,10,73+60,10+20], "72" );
		var stOffset = winObj.add("statictext",[146,10,146+55,10+20], "Offset" );
		var edOffset = winObj.add("edittext", [207,10,207+60,10+20], "0" );
		var stRot = winObj.add("statictext",[12,35,12+55,35+18], "Rotation" );
		var edRot = winObj.add("edittext", [73,35,73+60,35+21], "5" );
		var cbObjRot = winObj.add("checkbox", [146,35,146+191,35+20], "回転時、オブジェクトも回転");
		cbObjRot.value = true;
		var btnApply = winObj.add("button", [146,61,146+108,61+30], "Apply");
		var btnUndo = winObj.add("button", [12,62,12+81,62+30], "Undo");
		var btnAddRadius = winObj.add("button", [180,105,180+68,105+20], "半径足す");
		var btnIncRadius = winObj.add("button", [254,105,254+68,105+20], "半径引く");
		var edRadius = winObj.add("edittext", [99,105,99+75,105+20], "1" );
		var stRadius = winObj.add("statictext",[12,108,12+81,108+20], "---------------" );
		var btnClose = winObj.add("button", [273,62,273+49,62+30], "close");


		edCopies.text = pref.copies+"";
		edOffset.text = pref.offset+"";
		edRot.text = pref.rot;
		cbObjRot.value = pref.rotFlag;
		function SetEnabled(sw)
		{
			edCopies.enabled = sw;
			edOffset.enabled = sw;
			edRot.enabled = sw;
			cbObjRot.enabled = sw;
			btnApply.enabled = sw;
			btnUndo.enabled = ! sw;
			btnAddRadius.enabled = ! sw;
			btnIncRadius.enabled = ! sw;
			edRadius.enabled = ! sw;
		}
		SetEnabled(true);
		btnClose.onClick = function()
		{
			winObj.close();
		}
		var undoCount =0;
		var execInfo ={};
		execInfo.radius =0;
		execInfo.objs=[];
		function execSub()
		{
			var c = getED(edCopies);
			var o = getED(edOffset);
			var r = getED(edRot);
			var f = cbObjRot.value;
			if ((c==null)||(o==null)||(r==null))
			{
				alert("パラメータが異常");
				return;
			}
			execInfo = exec(c,o,r,f);
			stRadius.text = "";
			if (execInfo.objs.length>0)
			{
				undoCount+=1;
				SetEnabled(false);
				stRadius.text = execInfo.radius;
			}
		}
		btnApply.onClick = execSub;
		btnUndo.onClick=function()
		{
			app.undo();
			app.redraw();
			undoCount-=1;
			if (undoCount<=0)
			{
				SetEnabled(true);
				stRadius.text = "";
			}
		}
		function radiusExec (op)
		{
			if (execInfo.radius==0) return;
			var r = getED(edRadius);
			if(r!=null)
			{
				r *= op;
				var r2 = execInfo.radius + r;
				if (r2>0){
					var r3 = setRadius(execInfo.objs,r);
					stRadius.text = r3 +"";
					app.redraw();
					undoCount++;
				}
			}
		}
		btnAddRadius.onClick = function()
		{
			radiusExec(1);
		}
		btnIncRadius.onClick = function()
		{
			radiusExec(-1);
		}

		winObj.center();
		winObj.show();
	}
	if (app.activeDocument!=null)
	{
		if (app.activeDocument.selection.length!=1)
		{
			alert("１個だけ選択してください");
			return;
		}else{
			createUI();
		}
		//createDilaog();
	}
})(this);
