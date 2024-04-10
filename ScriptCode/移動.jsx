(function (me){
	var pref = {};
	pref.unitMode = 1;
	pref.moveV = 10;
	pref.dpi = 72;


 // 環境設定ファイルのFileオブジェクトを返す
    // 無かったらフォルダの作成も行う
    // "C:\Users\<ユーザー名>\AppData\Roaming\bry-ful\aep置き換え\aep置き換え.pref"
    var getPrefFile = function()
    {
        var ret = "noret";
        var pff = "none";
        var pff2 = "none2";
		var scriptName ="移動";

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
						if (v<0){v=0;}else if (v>1){v=1;}
						pref.unitMode = v;
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
	var moveObject = function(index,mv)
	{
		var selObj = app.activeDocument.selection;

		for(var i=0; i<selObj.length; i++)
		{
			var x =0;
			var y =0;
			switch(index)
			{
				case 0:
					x = -mv;
					y = mv;
					break;
				case 1:
					y = mv;
					break;
				case 2:
					x = mv;
					y = mv;
					break;
				case 3:
					x = -mv;
					break;
				case 4:
					break;
				case 5:
					x = mv;
					break;
				case 6:
					x = -mv;
					y = -mv;
					break;
				case 7:
					y = -mv;
					break;
				case 8:
					x = mv;
					y = -mv;
					break;

			}
			if (x!=0)
				selObj[i].left = selObj[i].left +x;
			if (y!=0)
				selObj[i].top = selObj[i].top +y;
			app.redraw();
		}
	}
	// ****************************************************************************************************************
	var createDialog = function()
	{
		if (app.activeDocument==null) return;
		if (app.activeDocument.selection.length<=0) return;
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
			}
			return ret;
		}

		var winObj = new Window("dialog","移動" ,[0,0,200,170]);

		var edValue = winObj.add("edittext",[5,5,5+190,5+25],pref.moveV+"");
		var arrows = [];
		var xs = 5;
		var ys = 60;
		var x =xs;
		var y =ys;
		var bw = 30;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"┌"));
		x  += bw+2;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"↑"));
		x  += bw+2;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"┐"));
		x = xs;
		y += bw+2;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"←"));
		x += bw+2;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"　"));
		x += bw+2;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"→"));
		x = xs;
		y += bw+2;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"└"));
		x += bw+2;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"↓"));
		x += bw+2;
		arrows.push(winObj.add("button",[x,y,x+bw,y+bw],"┘"));

		for (var i=0; i<arrows.length;i++)
		{
			arrows[i].cIndex = i;
			arrows[i].onClick = function()
			{
				var mv = getMoveV();
				if(mv!=null)
				{
					moveObject(this.cIndex,mv);
				}
			}
		}


		x = 5;
		y = 35;
		var cbs =[];
		cbs.push(winObj.add("radiobutton",[x,y,x+55,y+25],"mm"));
		x +=60;
		cbs.push(winObj.add("radiobutton",[x,y,x+55,y+25],"Pixel"));


		y += 26;
		x -= 10;
		cbs[pref.unitMode].value = true;

		for(var i=0;i<cbs.length;i++)
		{
			cbs[i].cIndex=i;
			cbs[i].onClick = function()
			{
				pref.unitMode = this.cIndex;
				savePref();
			}
		}



		winObj.center();
		winObj.show();

	}
	createDialog();
	savePref();
})(this);