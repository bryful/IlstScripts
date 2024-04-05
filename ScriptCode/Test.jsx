//#targetengine "main"
var nankaKakkoiiNamae={};
(function (){
    function aaa()
    {
        alert(1);
    }
    var w1=new Window("palette");
    var b1=w1.add("button",undefined,"ボタン１");
    b1.onClick=function(){
        //alert(1);
        aaa();
        //nankaKakkoiiNamae.func1();
        /*
        var bt=new BridgeTalk;
        bt.target = BridgeTalk.appSpecifier;
        bt.body = "nankaKakkoiiNamae.func1();",
        bt.send();
        alert(2);
        */
    }
    var cb1=w1.add("checkbox",undefined, "チェック項目1");
    cb1.value=nankaKakkoiiNamae.check1=false;
    cb1.onClick=function(){
        nankaKakkoiiNamae.check1=cb1.value;
    }
    nankaKakkoiiNamae.func1=function(){
        alert("チェック項目1は"+(nankaKakkoiiNamae.check1?"ON":"OFF")+"です");
    }
    w1.show();
})();