#targetengine main

var nankaKakkoiiNamae=
 (function (){
    var w1=new Window("palette");
    var b1=w1.add("button",undefined,"ボタン１");
    nankaKakkoiiNamae.ad = null;
    b1.onClick=function(){

        alert(app.name);
        try{
            alert(app.activeDocument.name);
        }catch(e){
            alert(e.toString());
        }
        try{

        }catch(e){
            alert(e.toString());

        }

        /*
        var bt=new BridgeTalk();
        bt.target = BridgeTalk.appSpecifier;
        bt.body = "nankaKakkoiiNamae.func1();",
        bt.send();
        */
    }
    var cb1=w1.add("checkbox",undefined, "チェック項目1");
    cb1.value=nankaKakkoiiNamae.check1=true;
    cb1.onClick=function(){
        nankaKakkoiiNamae.check1=cb1.value;
    }
    nankaKakkoiiNamae.func1=function(){
        alert(app.activeDocument.selection.length+"個のアイテムが選択されています");
        alert("チェック項目1は"+(this.check1?"ON":"OFF")+"です");
    }
    var ad = null;
    nankaKakkoiiNamae.func2=function(){
        alert(app.activeDocument.name);
        nankaKakkoiiNamae.ad = app.activeDocument;
        alert(nankaKakkoiiNamae.ad.name);
    }
    w1.show();
});
 var bt=new BridgeTalk();
bt.target = "illustrator";
bt.body =  uneval(nankaKakkoiiNamae) +"();";
bt.send();
