#targetengine main

var bry_launchar =
(function (){
    var pref = {};
	pref.targetFolder = "/c/Users/bryfu/Source/Repos/IlstScripts/scriptCode";
	pref.left = 30;
	pref.top = 30;
	pref.width = 300;
	pref.height = 300;


    var scriptName = "ランチャー";
    var targetFolder = new Folder(pref.targetFolder);
    var targetList = [];

    // 各種プロトタイプ設定。
    String.prototype.getParent = function() {
        var r = this;
        var i = this.lastIndexOf("/");
        if (i >= 0) r = this.substring(0, i);
        return r;
    }
    //ファイル名のみ取り出す（拡張子付き）
    String.prototype.getName = function() {
        var r = this;
        var i = this.lastIndexOf("/");
        if (i >= 0) r = this.substring(i + 1);
        return r;
    }
    String.prototype.changeExt = function(s) {
        var i = this.lastIndexOf(".");
        if (i >= 0) {
            return this.substring(0, i) + s;
        } else {
            return this + s;
        }
    }
    //拡張子のみを取り出す。
    String.prototype.getExt = function() {
        var r = "";
        var i = this.lastIndexOf(".");
        if (i >= 0) r = this.substring(i);
        return r;
    }
    //----------------------------------
    // ショートカットのリンク先を得る
    Folder.prototype.shortcutAs =
        File.prototype.shortcutAs = function() {
            var ret = this.resolve();
            if (ret == null) {
                ret = this;
            }
            return ret;
        }

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
					v = obj.targetFolder;
					if((v!=undefined)&&(typeof(v)=="string"))
                    {
                         pref.targetFolder = v;
                         targetFolder = new Folder(pref.targetFolder);
                         if (targetFolder.exists==false)
                         {
                            pref.targetFolder = "";
                            targetFolder = new Folder("");
                         }
                         v=null;
                    }
					v = obj.left;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.left = v; v=null;}
					v = obj.top;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.top = v; v=null;}
					v = obj.width;
					if((v!=undefined)&&(typeof(v)=="number")){ pref.width = v; v=null;}
					v = obj.height;
					if((v!=undefined)&&(typeof(v)=="number")){pref.height = v; v=null;}

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
    var chkTargetFolder = function()
    {
        if ( (targetFolder==null)||((targetFolder instanceof Folder)==false)||(targetFolder.exists==false))
        {
            var f =  new File($.fileName);
            targetFolder = f.parent;
            var n = targetFolder.selectDlg("スクリプトフォルダー");
            if(n!=null)
            {
                targetFolder = n;
                pref.targetFolder = File.decode(targetFolder.fullName);
            }
        }

    }
    chkTargetFolder();

    var createUI = function()
    {
        var lstFile = null;
        var listup = function()
        {
            var lst = targetFolder.getFiles();
            var p = targetFolder.parent;
            lstFile.removeAll();
            targetList = [];
            if ( (lst!=null)&&(lst.length>0))
            {
                pref.targetFolder = File.decode(targetFolder.fullName);
                var dl = [];
                var fl = [];
                for(var i=0; i<lst.length;i++)
                {
                    var t = lst[i].shortcutAs();

                    if (t instanceof Folder)
                    {
                        dl.push(t);
                    }else if (lst[i] instanceof File)
                    {
                        fl.push(t);
                    }
                }
                if (p!=null)
                {
                    lstFile.add("item","< parent >");

                    targetList.push(p);
                }
                if (dl.length>0){
                    for(var i=0; i<dl.length;i++)
                    {
                        lstFile.add("item","< " + File.decode(dl[i].name)+" >");
                        targetList.push(dl[i]);
                    }
                }
                if (fl.length>0)
                {
                    for(var i=0; i<fl.length;i++)
                    {
                        var nm = File.decode(fl[i].name);
                        var e = nm.getExt().toLowerCase();
                        if (e==".jsx")
                        {
                            lstFile.add("item",nm);
                            targetList.push(fl[i]);

                        }
                    }
                }
            }

        }
        var winObj = new Window("palette",scriptName ,[pref.left,pref.top,pref.left+pref.width,pref.top+pref.height],{resizeable : true} );
        var btnExec = winObj.add("button", [7,9,7 + 270,9 + 23], "exec");
        var btnFld = winObj.add("button", [280,9,280 + 30,9 + 23], "..");
	    lstFile = winObj.add("listbox", [7,30,7+286,30 + 170], [] ,{selected:true});

        function resize()
        {
            var b = winObj.bounds;
            var w = b[2] - b[0];
            var h = b[3] - b[1];
            var be = btnExec.bounds;
            be[0] = 7;
            be[1] = 7;
            be[2] = w-35;
            be[3] = 30;
            btnExec.bounds = be;
            var bf = btnFld.bounds;
            bf[0] = w-30;
            bf[1] = 7;
            bf[2] = w -7;
            bf[3] = 30;
            btnFld.bounds = bf;
            var bl = lstFile.bounds;
            bl[0] = 7;
            bl[1] = 32;
            bl[2] = w-7;
            bl[3] = h-7;
            btnFld.bounds = bf;
        }
        resize();
        winObj.onResize = resize;

        listup();
        function exec()
        {
            var t = lstFile.selection;
            if(t==null) return;
            var tt = targetList[t.index];
            if (tt instanceof Folder)
            {
                targetFolder = tt;
                listup();
            }else if (tt instanceof File)
            {
                 if (tt.open("r")) {
                    try {
                        var s = tt.read();
                        tt.close();
                        var bt=new BridgeTalk;
                        bt.target = BridgeTalk.appSpecifier;
                        bt.body = s,
                        bt.send(100);
                    } catch (e) {
                        alert("なんかスクリプト実行でエラー！\r\n" + File.decode(tt.fullName) + "\r\n" + e.toString());
                    }
                }
            }

        }
        lstFile.onDoubleClick = exec;
        btnExec.onClick = exec;
        btnFld.onClick = function()
        {
            var n = targetFolder.selectDlg("スクリプトフォルダー");
            if(n!=null)
            {
                targetFolder = n;
                pref.targetFolder = File.decode(targetFolder.fullName);
                listup();
                endExec();
            }
        }
        function endExec()
        {
            var b = winObj.bounds;
            pref.left = b[0];
            pref.top = b[1];
            pref.width = b[2] - b[0];
            pref.height = b[3] - b[1];
            pref.targetFolder = File.decode(targetFolder.fullName);
            savePref();
        }
        winObj.onClose  = endExec;
        if ((pref.left<=30)&&(pref.top<=30))
        {
            winObj.center();
        }
        winObj.show();
    }
    createUI();

})();
