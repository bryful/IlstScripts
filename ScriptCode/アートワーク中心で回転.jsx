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
	}
	// ******************************************************************
	var exec = function(c,o,r,fFlag)
	{
		app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
		var ret = true;
		var selObj = app.activeDocument.selection
		if ( (selObj==null)||(selObj.length!=1) )
		{
			alert("１個だけ選択してください");
			return ret;
		}
		if ((typeof(c)!="number")||(typeof(o)!="number")||(typeof(r)!="number"))
		{
			alert("パラメータが異常です");
			ret = false;
			return ret;
		}
		if (c<=0)
		{
			alert("copiesは1以上で");
			ret = false;
			return ret;
		}
		// アートボードの中心
		// 中心を求める
		var idx = app.activeDocument.artboards.getActiveArtboardIndex();
		var rct = app.activeDocument.artboards[idx].artboardRect;
		var cx = (rct[2]+rct[0])/2;
		var cy = (rct[3]+rct[1])/2;

		if (o!=0)
		{
			rotObject(selObj[0],r*o,cx,cy,fFlag);
		}
		if (c>1)
		{
			for(var i=1; i<c;i++)
			{
				var no = selObj[0].duplicate();
				rotObject(no, r*i,cx,cy,fFlag);
			}
		}
		pref.copies = c;
		pref.offset = o;
		pref.rot = r;
		pref.rotFlag = fFlag;
		savePref();

		return ret;
	}
	// ******************************************************************
	var createDilaog = function()
	{
		var winObj = new Window('dialog{text:"回転",orientation : "column", properties : {resizeable : true} }');
		var res1 =
		'Group{alignment: ["fill", "fill" ],orientation:"column",preferredSize:[300,100],\
		gCopies:Group{alignment:["fill","top"],orientation:"row",\
		stCopies:StaticText{alignment:["fill","top"],maximumSize:[40,25],text:"Copies"},\
		edCopies:EditText{alignment:["fill","top"],text:"3"},\
		stOffset:StaticText{alignment:["fill","top"],maximumSize:[40,25],text:"Offset"},\
		edOffset:EditText{alignment:["fill","top"],text:"0"}},\
		gRot:Group{alignment:["fill","top"],orientation:"row",\
		stRot:StaticText{alignment:["fill","top"],maximumSize:[50,25],text:"Rotation"},\
		edRot:EditText{alignment:["fill","top"],text:"0"}},\
		gMode:Group{alignment:["fill","top"],orientation:"row",\
		cbRot:Checkbox{alignment:["fill","top"],text:"回転する時、オブジェクトも回転する",value:true}},\
		gExec:Group{alignment:["fill","top"],orientation:"row",\
		btnCancel:Button{alignment:["fill","top"],text:"Cancel"},\
		btnOK:Button{alignment:["fill","top"],text:"OK"}}\
		}';
		winObj.gr = winObj.add(res1);
		winObj.gr.gCopies.edCopies.text = pref.copies+"";
		winObj.gr.gCopies.edOffset.text = pref.offset+"";
		winObj.gr.gRot.edRot.text = pref.rot;
		winObj.gr.gMode.cbRot.value = pref.rotFlag
		winObj.layout.layout();
		winObj.onResize = function()
		{
			winObj.layout.resize();
		}
		winObj.gr.gExec.btnCancel.onClick=function(){winObj.close();}
		winObj.gr.gExec.btnOK.onClick=function()
		{
			var c = 0;
			var o = 0;
			var r = 0;
			var f = true;
			try{
				c = eval(winObj.gr.gCopies.edCopies.text);
				o = eval(winObj.gr.gCopies.edOffset.text);
				r = eval(winObj.gr.gRot.edRot.text);
				f = winObj.gr.gMode.cbRot.value;

			}catch(e){
				alert(e.toString());
				return;
			}

			if (exec(c,o,r,f)==true)
			{
				winObj.close();
			}
		}

		winObj.center();
		winObj.show();

	}
	if (app.activeDocument!=null)
	{
		createDilaog();
	}
})(this);
