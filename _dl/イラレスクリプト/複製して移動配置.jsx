(function (me){
	var pref = {};
	pref.copies = 3;
	pref.offset = 0;
	pref.xpos = 0;
	pref.ypos = 0;
	pref.unit = 0; // 0: mm 1:point 2: pixel
	pref.dpi = 300;


 // 環境設定ファイルのFileオブジェクトを返す
    // 無かったらフォルダの作成も行う
    // "C:\Users\<ユーザー名>\AppData\Roaming\bry-ful\aep置き換え\aep置き換え.pref"
    var getPrefFile = function()
    {
        var ret = "noret";
        var pff = "none";
        var pff2 = "none2";
		var scriptName ="複製して移動配置";

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
	var createDilaog = function()
	{
		var winObj = new Window('dialog{text:"配置",orientation : "column", properties : {resizeable : true} }');
		var res1 =
		'Group{alignment: ["fill", "fill" ],orientation:"column",preferredSize:[300,100],\
		gCopies:Group{alignment:["fill","top"],orientation:"row",\
		stCopies:StaticText{alignment:["fill","top"],maximumSize:[40,25],text:"Copies"},\
		edCopies:EditText{alignment:["fill","top"],text:"3"},\
		stOffset:StaticText{alignment:["fill","top"],maximumSize:[40,25],text:"Offset"},\
		edOffset:EditText{alignment:["fill","top"],text:"0"}},\
		gPos:Group{alignment:["fill","top"],orientation:"row",\
		stX:StaticText{alignment:["fill","top"],maximumSize:[40,25],text:"X"},\
		edX:EditText{alignment:["fill","top"],text:"0"},\
		stY:StaticText{alignment:["fill","top"],maximumSize:[40,25],text:"Y"},\
		edY:EditText{alignment:["fill","top"],text:"0"}},\
		gUnit:Group{alignment:["fill","top"],orientation:"row",\
		stUnit:StaticText{alignment:["left","top"],text:"指定単位"},\
		rbMM:RadioButton{alignment:["left","top"],text:"mm",value:true},\
		rbPoint:RadioButton{alignment:["left","top"],text:"Point",value:false},\
		rbPixel:RadioButton{alignment:["left","top"],text:"Pixel",value:false},\
		edDpi:EditText{alignment:["fill","top"],enabled:false,text:"300"}},\
		gExec:Group{alignment:["fill","top"],orientation:"row",\
		btnCancel:Button{alignment:["fill","top"],text:"Cancel"},\
		btnOK:Button{alignment:["fill","top"],text:"OK"}}\
		}';
		winObj.gr = winObj.add(res1);
		winObj.gr.gCopies.edCopies.text = pref.copies+"";
		winObj.gr.gCopies.edOffset.text = pref.offset+"";
		winObj.gr.gPos.edX.text = pref.xpos +"";
		winObj.gr.gPos.edY.text = pref.ypos +"";
		switch (pref.unit)
		{
			case 0:
				winObj.gr.gUnit.rbMM.value=true;
				break;
			case 1:
				winObj.gr.gUnit.rbPoint.value=true;
				break;
			case 2:
				winObj.gr.gUnit.rbPixel.value=true;
				winObj.gr.gUnit.edDpi.enabled = true;
			break;
		}
		winObj.gr.gUnit.rbMM.onClick=onClick= function()
		{
			pref.unit =0;
			winObj.gr.gUnit.edDpi.enabled = false;
		}
		winObj.gr.gUnit.rbPoint.onClick=onClick= function()
		{
			pref.unit =1;
			winObj.gr.gUnit.edDpi.enabled = false;
		}
		winObj.gr.gUnit.rbPixel.onClick= function()
		{
			pref.unit =2;
			winObj.gr.gUnit.edDpi.enabled = true;
		}
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
			var x = 0;
			var y = 0;
			var dpi = 300;
			try{
				c = eval(winObj.gr.gCopies.edCopies.text);
				o = eval(winObj.gr.gCopies.edOffset.text);
				x = eval(winObj.gr.gPos.edX.text);
				y = eval(winObj.gr.gPos.edY.text);
				try{
				dpi = eval(winObj.gr.gUnit.edDpi.text);
				if (dpi<72) dpi =72;
				}catch(e){
					dpi=300;
					winObj.gr.stUnit.edDpi.text=dpi+"";
					return;
				}

			}catch(e){
				alert(e.toString());
				return;
			}
			pref.dpi = dpi;

			if (exec(c,o,x,y)==true)
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
