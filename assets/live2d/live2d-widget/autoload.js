// live2d_path 参数建议使用绝对路径
const live2d_path = "/assets/live2d/live2d-widget/";
//const live2d_path = "/live2d-widget/";

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
	return new Promise((resolve, reject) => {
		let tag;

		if (type === "css") {
			tag = document.createElement("link");
			tag.rel = "stylesheet";
			tag.href = url;
		}
		else if (type === "js") {
			tag = document.createElement("script");
			tag.src = url;
		}
		if (tag) {
			tag.onload = () => resolve(url);
			tag.onerror = () => reject(url);
			document.head.appendChild(tag);
		}
	});
}

function initLive2d () {
	if(initWidget){
		initWidget({
			display:{
				width: 150,
				height: 300,
				position: 'right',
				hOffset: 50
			},
			model:{
				jsonPath: "/assets/live2d/model/hijiki/hijiki.model.json"
			},
			mobile:{
				show:false
			},
			cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/"
		});
	}else {
		setTimeout(initLive2d,1000)
	}
}


// 加载 waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 768) {
	Promise.all([
		loadExternalResource(live2d_path + "waifu.css", "css"),
		loadExternalResource(live2d_path + "live2d.min.js", "js"),
		loadExternalResource(live2d_path + "waifu-tips.js", "js")
	]).then(() => {
		// 配置选项的具体用法见 README.md
		initLive2d()
	});
}