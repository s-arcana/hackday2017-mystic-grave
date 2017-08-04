var address = 'http://54.199.165.221';

// 現在のブロック情報保管用
var blocks;

var socket = io(address);
socket.on('controller', function(data){
    if(data.operation == 'forward'){
        forward();
    }else if(data.operation == 'jump'){
        if(!isJumped) {
            jump();
        }
    }
});

socket.on('maze_update', function(data){
    var inputData = [];
    for (var i = 0; i < data.length; i++) {
        var raw = [];
        for (var j = 0; j < data[i].length; j++) {
            raw.push(data[j][i]);
        }
        inputData.push(raw);
    }
    blocks = inputData;

    clearBoxes(scene, stage);
    genBoxes(scene, stage, inputData);
});

var animate = function(){
    requestAnimationFrame(animate);
    TWEEN.update();
};
animate();
var tw, tw2;
var isJumped = false;

function jump() {
    isJumped = true;
    var cam = document.getElementById('myCamera');
    var position = cam.getAttribute('position');

    var pos = { y : 0.5 };

    tw = new TWEEN.Tween(pos)
        .to({ y: 13 }, 1500)
        .easing(TWEEN.Easing.Circular.Out)
        .onUpdate(function() {
            position.y = this.y;
            cam.setAttribute('position', position);
        })
        .onComplete(function(){
            isJumped = false;
        });

    tw2 = new TWEEN.Tween(pos)
        .to({ y: 0.5 }, 1500)
        .easing(TWEEN.Easing.Circular.In)
        .onUpdate(function() {
            position.y = this.y;
            cam.setAttribute('position', position);
        })
        .onComplete(function(){
            isJumped = false;
        });

    tw.chain(tw2);
    tw.start();
}

function sendPosition() {
    var socket = io(address);

    var cam = document.getElementById('myCamera');
    var position = cam.getAttribute('position');
    var rotation = cam.getAttribute('rotation');

    socket.emit('user_position', {
        x: position.x,
        y: position.y,
        z: position.z,
        rotate: rotation.y
    });
}

function forward(){
    var cam = document.getElementById('myCamera');

    var speed = 0.3;
    var position = cam.getAttribute('position');
    var rotation = cam.getAttribute('rotation');

    var nx = 8 + Math.floor(position.x + -Math.cos((rotation.y - 90) * Math.PI / 180) * speed );
    var ny = 8 + Math.floor(position.z + Math.sin((rotation.y - 90) * Math.PI / 180) * speed );
    if(blocks[nx] == undefined || blocks[nx][ny] == undefined || blocks[nx][ny] == '1'){

    }else{
        position.x += -Math.cos((rotation.y - 90) * Math.PI / 180) * speed;
        position.z += Math.sin((rotation.y - 90) * Math.PI / 180) * speed;

        cam.setAttribute('position', position);


        sendPosition();
    }
}

function clearBoxes(scene, stage){
    var n = scene.children.length;
    var removeList = [];
    for(var i = 0; i < n; i++){
        if(scene.children[i].getAttribute('boxid')){
            removeList.push(scene.children[i]);
        }else{

        }
    }

    for(var i in removeList){
        scene.removeChild(removeList[i]);
    }
}

function genBoxes(scene, stage, arr){

    var stageWidth = stage.getAttribute('width');
    var stageHeight = stage.getAttribute('height');
    var boxW = stageWidth/arr.length;
    var boxH = stageWidth/arr[0].length;
    for(var x = 0; x < 16; x++){
        var outStr = '';
        for(var z = 0; z < 16; z++) {
            outStr += arr[x][z] + ',';
            if(arr[x][z] == '1') {
                var p = ((x + boxW/2) - stageWidth/2.0) + ' ' + boxW/2.0 + ' ' + ((z + boxW/2) - stageHeight/2.0);
                var r = '0 0 0';
                var s = boxW + ' 1 ' + boxH;
                var c = '#323232';
                var boxNode = genBoxNode(p, r, s, c);
                boxNode.setAttribute('boxid', stage.getAttribute('id') + '_box' + x + '_' + z)
                scene.appendChild(boxNode);
            }
        }
    }
}

function genBoxNode(p, r, s, c) {
    var boxNode = document.createElement('a-box');
    boxNode.setAttribute('position', p);
    boxNode.setAttribute('rotation', r);
    var size = s.split(' ');
    boxNode.setAttribute('width', size[0]);
    boxNode.setAttribute('height', size[1]);
    boxNode.setAttribute('depth', size[2]);
    boxNode.setAttribute('color', c);

    return boxNode;
}

function genObakeNode(p, r, s, v_speed) {
    var modelNode = document.createElement('a-entity');
    var src = "src: url(./model/obake/obake3d.obj);mtl: url(./model/obake/obake3d.mtl);";
    modelNode.setAttribute('id', 'obake');
    modelNode.setAttribute('obj-loader', src);
    modelNode.setAttribute('position', p);
    modelNode.setAttribute('rotation', r);
    modelNode.setAttribute('scale', s);

    var animNode = document.createElement('a-animation');
    animNode.setAttribute('dur', v_speed);
    animNode.setAttribute('attribute', 'position');
    animNode.setAttribute('frome', '0 0.25 0.0');
    animNode.setAttribute('to', '0 0.35 0.0');
    animNode.setAttribute('direction', 'alternate-reverse');
    animNode.setAttribute('repeat', 'indefinite');
    animNode.setAttribute('easing', 'ease-out');

    modelNode.appendChild(animNode);
    return modelNode;
}

window.addEventListener("keydown", handleKeydown);
function handleKeydown(evt){
    if(evt.key == "m"){
        // forward();
        if(!isJumped) {
            jump();
        }
    }
}