$(function() {
	//videoタグを取得
	var video = document.getElementById('camera');
	//カメラが起動できたかのフラグ
	var localMediaStream = null;
	//カメラ使えるかチェック
	var hasGetUserMedia = function() {
		return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	};

	//エラー
	var onFailSoHard = function(e) {
		console.log('エラー!', e);
	};

	if(!hasGetUserMedia()) {
		alert("未対応ブラウザです。");
	} else {
		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		navigator.getUserMedia({video: true}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			localMediaStream = stream;
		}, onFailSoHard);
	}
var ctx;

	$("#start").click(function() {
    var THRESHOLD = $("#threshold").val();
		if (localMediaStream) {
			var canvas = document.getElementById('canvas');
			//canvasの描画モードを2sに

      ctx = canvas.getContext('2d');
			var img = document.getElementById('img');

			//videoの縦幅横幅を取得
			var w = video.offsetWidth;
			var h = video.offsetHeight;

			//同じサイズをcanvasに指定
			canvas.setAttribute("width", w);
			canvas.setAttribute("height", h);

			//canvasにコピー
			ctx.drawImage(video, 0, 0, w, h);
			//imgにpng形式で書き出し
			img.src = canvas.toDataURL('image/png');

      var c1Canvas = document.getElementById("c1");
      c1Canvas.setAttribute("width", w);
      c1Canvas.setAttribute("height", h);
      var ctx = c1Canvas.getContext("2d");
      img.onload = function() {
          ctx.drawImage(img, 0, 0);
          var src = ctx.getImageData(0, 0, c1Canvas.width, c1Canvas.height);
          var dst = ctx.createImageData(c1Canvas.width, c1Canvas.height);

          // rgba
          for (var i = 0; i < src.data.length; i=i+4) {
              var y = ~~(0.299 * src.data[i] + 0.587 * src.data[i + 1] + 0.114 * src.data[i + 2]);
              var ret = (y > THRESHOLD) ? 255 : 0;
              dst.data[i] = dst.data[i+1] = dst.data[i+2] = ret;
              dst.data[i+3] = src.data[i+3];
          }
          ctx.putImageData(dst, 0, 0);
      };
		}
	});
});
