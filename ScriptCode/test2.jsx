#targetengine main
function f(s){
    alert(s);
}
var bt=new BridgeTalk;
alert(BridgeTalk.appSpecifier);
/*
bt.body="f("+"\"ふぐ\""+");"
bt.target="illustrator";
bt.send();
*/