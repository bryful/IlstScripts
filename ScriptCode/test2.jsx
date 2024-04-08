#targetengine main
function f(s){
    alert(s);
}
var bt=new BridgeTalk;
bt.body="f("+"\"ふぐ\""+");"
bt.target="illustrator";
bt.send();