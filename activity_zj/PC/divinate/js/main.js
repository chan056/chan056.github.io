(function() {
	window.boxes = $('.box');
	window.fbId = undefined;

	//box-1
	(function() { //loadFirstScreenImg
		window.imgs = {
			1: wenzi,
			2: wenzi,
			3: wenzi,
			4: yuanbao,
			5: null,
			11: null,
			12: null,
			13: null,
			14: null
		};

		imgs.l = (function() {
			var n = 0;
			for (var i in imgs) {
				n++;
			}
			return n;
		})(); // 需要加载的图片数量总和
		imgs.z = 0; // 已经加载的图片数量

		var baseUrl = 'img/';
		var imgDOM = '';
		for (var i in imgs) {
			if (!isNaN(i)) {
				var url = baseUrl + '/1/' + i + '.png';
				var id = '1_' + i;
				var fn = imgs[i];

				imgDOM += '<img data-id=' + id + ' class="first-screen-img" src="' + url + '" alt="" onload="imgload(this)"/>';
			}
		}

		$('body').append(imgDOM); //fragment

		// 每张图片加载完成后执行的动画
		window.imgload = function() {
			var _this = arguments[0];
			var sequence = $(_this).attr('data-id').split('_')[1];

			//标记
			imgs.z++;

			//修改 进度条
			var per = imgs.z / imgs.l;
			$('#progress').text(Math.floor(per * 100) + '%');

			var fn = imgs[sequence];
			replaceSrc(_this);
			fn && fn(_this);
			
			if (imgs.z == imgs.l) {//第一波加载完成
				loadOtherImg(); //加载剩余资源
				$('.first-screen-img').remove();
				//检测文字动画是否完成
				var p = setInterval(function() {
					if (wenzi.complete) {
						setTimeout(function(){
							boxes.eq(0).hide();
							box2();
						},1000)
						clearInterval(p);
					}
				}, 300)
			}
		}
	})();

	//box-2
	function box2() {// console.log('box2()')
		var box2 = boxes.eq(1).fadeIn(1500);
		var nameInput = $('#name');

		yuanbao(null, box2);
		box2.find('[data-id=1_14]').addClass('moved');

		//开始求签
		box2.find('#starer').on('click', function() {
			var name = $.trim(nameInput.val());
			ensureResult(name);

			if (name) {
				boxes.eq(2).find('h1 em').eq(0).text(name);
				//隐藏财神
				box2.find('[data-id=1_14]').removeClass('moved');
				//出现 签筒
				box2.find('#barrel').addClass('moved');
				setTimeout(function() {
					//摇签 声音
					playAudio();
					//摇签 动画
					$('#barrel').addClass('shaking');
					//摇签结束
					setTimeout(function() {//return;
						//隐藏“过渡文字”
						box2.find('[data-id=2_12]').hide();

						//隐藏 #barrel
						$('#barrel').removeClass('moved');

						//出现"解签"财神，随机
						box2.find('.solve.mammon').addClass('moved');

						//出现“解签”按钮
						box2.find('p.solve').fadeIn();

						box2.find('.solve .button').on('click', function() {
							box2.hide();
							box3();
						})

						//摇一摇
						var myShakeEvent = new Shake({
			                threshold: 15
			            });
            			myShakeEvent.start();
            			
            			window.addEventListener('shake', shakeEventDidOccur, false);

            			function shakeEventDidOccur (){
            				box2.hide();
							box3();
							//$('input').remove();
							window.removeEventListener('shake', shakeEventDidOccur, false);
							myShakeEvent.stop();
            			}
					}, 3000)
				}, 500);
				//隐藏
				box2.find('[data-id=1_12], .input, >.button').fadeOut(/*function(){
					nameInput.remove();
				}*/);
				//出现 文字
				box2.find('[data-id=2_12]').fadeIn();
			}
		});
		
		

		// 根据输入的name确定抽签结果
		function ensureResult(n){
			if(!n.length)
				return;
			var ds = divinations;
			var md5 = $.md5(n);
			var lastLetter = md5[md5.length - 1];
			var charCode = lastLetter.charCodeAt(0);
			var index = charCode%ds['wen'].length;
			var divination = ds['wen'][index];

			var a = ds.qian[divination[0]],
				b = ds.ji[divination[1]],
				b = b? '财运'+b+'吉': '平安特吉';
				c = divination[2];
			//console.log(a,b,c)
			var yunshiWrapper = $('.yunshi');
			yunshiWrapper.eq(0).html(b.split('').join('<br/>'))
			yunshiWrapper.eq(1).text(b)
				.siblings('span.fr').text(a);
			boxes.find('.detail').text(c);
			document.title = '2016的我：'+b+'。还能领取免费话费！';
		}
	}

	function box3() {
		clearInterval(fbId);
		var box3 = boxes.eq(2).show();
		box3.find('.button').eq(0).on('click', function() {
			location.reload();
		}).next().on('click', function() {
			//分享
			$('#share-tip').show();
		});
		$('#share-tip').on('click', function(){
			$(this).hide();
		})
	}

	//加载第二波图片
	function loadOtherImg() { //debugger
		var delayed = boxes.find('img.delayed'); //console.log(delayed.length)
		delayed.each(function() {
			var i = arguments[1]; //console.log(arguments)
			replaceSrc(i);
		});

		//preLoadMp3
		window.audio = new Audio();
		audio.src = 'yaoqian.mp3';
	}

	//文字动画
	wenzi.textImgLoaded = 0;
	function wenzi() {
		var img = $(arguments[0]);
		wenzi.textImgLoaded++;
		if (wenzi.textImgLoaded == 3) { //有4个成员执行该函数
			// console.log('文字动画')
			var textImg = $('.box:eq(0) .text-img');
			textImg.eq(0).addClass('moved');
			setTimeout(function() {
				textImg.eq(1).addClass('moved');
			}, 500);
			setTimeout(function() {
				textImg.eq(2).addClass('moved');

			}, 1000);
			setTimeout(function() {
				wenzi.complete = true;
			}, 1500);
		}
	}

	//元宝动画
	function yuanbao(img, wrapper) {
		fbId && clearInterval(fbId);
		//console.log('元宝动画');
		wrapper =  wrapper || $('#dollar');// console.log(wrapper)
		window.fbId = setInterval(function() {
			var r = 25 - Math.random() * 50 //-25 25
			var s = (50 + 100 * Math.random()) / 100; //50-100
			var l = wrapper.width() * Math.random() + 'px';
			var dollarId = 'dollar-' + (+new Date());
			var dollar = '<img id="' + dollarId + '" src="img/1/4.png" class="dollar" style="transform: rotateZ(' +
				r + 'deg) scale(' + s + '); left: ' + l + '; top: -100px;" />';

			//每隔一段时间 添加一个
			wrapper.append(dollar)
			dollar = $('#' + dollarId);
			dollar.css({
				'top': wrapper.height()
			});
			setTimeout(function() {
				dollar.remove();
			}, 1200)
		}, 300);
	}

	//根据data-id修改图片src
	//1_1 -> img/1/1.png
	function replaceSrc(img) {
		var dataId = $(img).attr('data-id'); //console.log(dataId)
		var ids = dataId.split('_');
		var src = 'img/' + ids[0] + '/' + ids[1] + '.png';

		var target = boxes.find('[data-id=' + dataId + ']');
		target && target.attr('src', src);
	}

	//播放抽签声音
	function playAudio() {//console.log(audio);return
		//var audio = new Audio();
		// http://yhdhd.evenhidata.com/chouqian/static/html/images/yaoqian.mp3
		//http://yhdhd.evenhidata.com/chouqian/static/html/images/luodi.mp3
		//audio.src = 'yaoqian.mp3';
		//audio.loop = true;
		audio.id = 'myAudio3';
		//audio.playAudio = true;
		/*audio.addEventListener('canplay', function(){//console.log('canplay')
			audio.play();
			setTimeout(function(){
		  	audio.pause();
		  	audio = null;
		  }, 3000)
		}, false);*/
		audio.play();
		setTimeout(function(){
			audio.pause();
			audio = null;
		}, 3000)
	}

	var divinations = {
		qian: ['上签', '上上签'],//[0=>上签, 1=>上上签] 
		ji: ['小', '中', '大', '特'],//[0=>小, 0=>中, 0=>大, 0=>特]
		wen: [
			[0, 1, '鸿运当头哦！偏财，一定有偏财！'],
			[0, 0, '财运不错！死爱钱，别不好意思说啊！'],
			[1, 2, '哎呀呀！财运暴强啊！给财神上柱香吧！'],
			[0, 0, '今天你要走狗屎运了！赶紧买彩票吧！'],
			[0, 0, '欧耶，2016年你的财运不错哦！据统计，你将是所有朋友中，2016年最有可能捡到钱的，别小看一元钱，捡着捡着就变多了呢！'],
			[1, 4, '哇~2016年你将爱情平安，亲情平安，友情平安，财运平安，事事皆平安，平安无极限！'],
			[0, 2, '恭喜恭喜，2016年你的财运很好呢！玛雅人说多刮彩券吧~~您将在2016年的某个晚上，请朋友吃饭，刮发票刮中神秘数字哦。'],
			[1, 3, '哇塞，2016年你的财运超级无敌啊！财神告诉你，今年会有超级幸福的大奖在等你哦。亲，发达了。可别忘了第一个祝福你的我啊！'],
			[0, 2, '2016年最红的人是谁，当然是你啦，人人要请你吃饭，全年出门都不用带钱包啦！'],
			[1, 3, '不错哦！2016年你这是要大财、小财、意外财，财源滚滚啊！']
		]
	};
})()

