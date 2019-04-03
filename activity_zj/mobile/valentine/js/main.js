var cookieHelper = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + options.path : '',
            domain = options.domain ? '; domain=' + options.domain : '',
            secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}
/*datas*/
var datas = [
    {a: '最佳拍档',b:'85%',c:'你们是死党，是想法一致的情侣，不过就因为同质性太高，有时会有点闷，药剂得多制造些生活情趣，多说些甜言蜜语给对方听。'},
    {a: '似远还近',b:'80%',c:'双方个性不同，想法又各异，但竟然还可成为情侣，双方需互相迁就才能甜蜜度日。'},
    {a: '欢喜冤家',b:'75%',c:'小俩口一见面就吵，越吵感情越好，不过有时也要互相学习尊重喔。'},
    {a: '一见钟情',b:'85%',c:'诗曰：乃蒙郎君一见钟情，故贱妾有感于心。一见钟情要多久？答案是30秒。你们的结识是一场背景华丽的艳遇，一见到对方就难舍难分，还在等什么？心动不如马上行动。'},
    {a: '美好邂逅',b:'85%',c:'诗曰：野有蔓草，零露漙兮。有美一人，清扬婉兮。邂逅相遇，适我愿兮。野有蔓草，零露瀼瀼。有美一人，婉如清扬。邂逅相遇，与子偕臧。两人偶然相遇，志趣相投，随即陷入热恋，两人越看越相衬。总之，这是一种美丽的缘分。'},
    {a: '完美情人',b:'95%',c:'女方一见到男方，就会被对方丰富的学识及人生经验所倾倒，而义无反顾的相爱。'},
    {a: '上进情侣',b:'90%',c:'两人能互相鼓励，有上进心，幸福指日可待'}
];
/*主功能*/
var main = {
    setPage: function (key) {
        $(".page").hide();
        if(key == 'page1' || key == 'page5') $(".petal").hide();
        else $(".petal").show();
        $("#"+key).show();
    },

    page1: function (argument) {
        main.setPage("page1");
        var s1 = new createjs.LoadQueue(!0),
            $num = $("#progessnum");
        s1.addEventListener("progress", loadingProgress);
        s1.setMaxConnections(1);
        function loadingProgress(e) {
            window.setNumTime && clearInterval(setNumTime);
            setNum = window.setNum || 1;
            var num = e.progress*100;
            setNumTime = setInterval(function() {
                if(num <= setNum) {
                    if(num==100) setTimeout(main.page2, 200);
                    clearInterval(setNumTime);
                    return;
                }
                ++setNum;
           //     if(++setNum < 100) ++setNum;
                $num.html(setNum+"%");
            }, 20);
        }

        function loadingComplete() {

        }

        $(".p-head .p-h1").animate({"opacity":1, "margin-top":0}, 1200, function(argument) {
            $(".p-head .p-h2").animate({"opacity":1}, 200);
        });
        for ( 0 == load_imgs.length; 0 < load_imgs.length; ) {
            s1.loadFile(load_imgs.shift());
        }
        for (var i = 1; i <= 36; i++) {
            s1.loadFile('images/'+i+".png");
        };
    },
    page2: function (argument) {
        main.setPage("page2");
        cookieHelper('key', '');
        var $man = $(".js-man"),$woman = $(".js-woman");
        $man.val(''),$woman.val('');
        $('.js-save').click(function(event) {
            /* Act on the event */
            main.manval = $.trim($man.val()),main.womanval = $.trim($woman.val());
            if(main.manval && main.womanval) {
                main.page3(main.manval+main.womanval);
            }
        });
    },
    page3: function(val) {
        main.setPage("page3");
        var lastVal = $.md5(val).substr(-1,1),
            num = lastVal.charCodeAt() - 48;
        if(num > 47) num -= 38;
        num %=7;
        main.data = datas[num];
        setTimeout(function(){
            cookieHelper('key', num), cookieHelper('man', main.manval),cookieHelper('woman', main.womanval);
            self.location.href = 'wobble.html';
        }, 5000);
    },
    page4: function() {
        $("input").blur();
        main.setPage("page4");
        $(".js-result").html(main.data.a);
        var myShakeEvent = new Shake({
            threshold: 15
        });
        myShakeEvent.start();
        window.addEventListener('shake', main.page5, false);
    },
    page5: function() {
        main.setPage("page5");
        $("#man").html(main.manval);
        $("#woman").html(main.womanval);
        $("title").html(main.manval+'和'+main.womanval+'的缘分指数：'+main.data.b+'。测完缘分领免费话费！');
        $(".js-result").html(main.data.a);
        $(".js-num").html(main.data.b);
        $(".js-info").html(main.data.c);
        $(".js-btn-test").click(main.page2);
        $(".js-btn-share").click(function(event) {
            $(".share-wrap").show();
            event.stopPropagation();
        });
        $("body, .share-wrap").click(function(event) {
            $(".share-wrap").hide();
        });
    }
};
/*首界面加载图片*/
(function(argument) {
    var key = cookieHelper('key'), man = cookieHelper('man'), woman = cookieHelper('woman');
    if(key){
        main.key = key, main.data = datas[key],main.manval = man,main.womanval = woman;
        main.page5();
    }else{
        var s1_img = [
            "images/p-h1.png",
            "images/p-h2.png",
            "images/x1.png",
            "images/x2.png",
            "images/x3.png",
            "images/x4.png"
        ];

        var s1 = new createjs.LoadQueue(!0);
        s1.addEventListener("complete", main.page1);
        s1.setMaxConnections(1);
        for ( 0 == s1_img.length; 0 < s1_img.length; ) {
            s1.loadFile(s1_img.shift());
        }
    }
})();



/** 监听hash变化
(function(a) {
    function _hash() {
        var hashVal = location.hash;
        $(".page-box").hide();
        if(!$(hashVal).length) $("#page1").show();
        else $(hashVal).show();
    }
    $(window).bind('hashchange', _hash);
    _hash();
})(); **/
