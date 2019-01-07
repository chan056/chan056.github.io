/******************************
** 文件描述 :  公益环保活动 中均资本
** 时    间 ： 2016.03.10 - 03.11
** 作    者 ： wangweimin
** E-mail：wangweimin@zjcap.cn
*******************************/
var server = window.location.origin;
(function($) {
    var Environment = {

        init: function() {
            this.initPage();
            this.loadRes();
        },

        initPage: function() {
            var h = $(window).height();

            this.h = h;

            $('.h,.page').css('height', $(window).height() + 'px');
        },

        //图片预加载
        loadRes: function() {
           var me = this,
                $load = $('.load'),
                index = 0,
                len = 36;

            for (var i = 1; i <= len; i++) {
                var objImg = new Image();
                //if (location.host == 'mingsixue.com') {
                    //objImg.src = server + '/test/h5/activity/environment314/images/' + i +'.png';
                //} else {
                    objImg.src = server + '/h5/activity/environment/images/' + i +'.png';
                //}

                objImg.onload = function() {
                    index++;

                    var num = Math.floor(index * 10);
                    if (num <= 180) {
                        $load.find('.right').css('transform', "rotate(" + num + "deg)");
                    } else {
                        $load.find('.right').css('transform', "rotate(180deg)");
                        $load.find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
                    };
                    $('.radar-arrows').css('transform', "rotate("+ num +"deg)");

                    $load.find('.progress').html(Math.floor(index / len * 100) + '%');


                    if (index == len) {
                        $load.hide();
                        me.main();
                    }
                }
                objImg.onerror = function() {
                    $load.hide();
                    me.main();
                }
            }
        },

        main: function() {
            var me = this,
                $tree = $('.wrap-tree'),
                $page = $tree.find('.page'),
                $rule = $('.page-rule'),
                $share = $('.wrap-share'),
                $alert = $('.wrap-alert'),
                $nums = $page.find('.js-nums');

            // 获取绿叶数量
            var getLeaf = function() {
                $.ajax({
                    url: server + '/web/noauth',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        method: '/arborday/activity/hits'
                    },
                    success: function(response) {
                        if (response.retCode == '0000') {
                            $nums.html( response.data );
                        }
                    }
                });
            }

            // 新增绿叶
            var addLeaf = function(callback) {
                $.ajax({
                    url: server + '/web/noauth',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        method: '/arborday/activity/add'
                    },
                    success: function(response) {
                        if (response.retCode == '0000') {
                            callback && callback();
                        }
                    }
                })
            }

            getLeaf();

            $tree.removeClass('hide');
            $page.removeClass('hide');

            // 显示水波
            setTimeout(function() {
                $page.find('.round').addClass('round-click');
            }, 7000);

            // 领取绿叶
            $page.on('click', '.js-get-leaf', function() {
                $page.find('.round').removeClass('round-click');

                $page.find('.page-1').addClass('hide');
                $page.find('.page-2').removeClass('hide');

                setTimeout(function() {
                    $page.find('.page-2').addClass('page-3');
                }, 2800);

                // 是否添过绿
                if (localStorage.isClick) {
                    setTimeout(function() {
                        $alert.find('.mb').html('您已经为地球添过绿<br/>中均将帮您捐出1元钱');
                        $alert.removeClass('hide')
                    }, 8000);
                    return;
                }

                // 添加绿叶
                addLeaf(function() {
                    localStorage.isClick = true;

                    setTimeout(function() {
                        $alert.removeClass('hide');
                        $nums.html( $nums.html()*1 + 1);
                    }, 8000);
                });
            });

            // 分享引导
            $page.on('click', '.share-btn', function() {
                $share.removeClass('hide');
            });

            // 关闭分享引导
            $share.click(function() {
                $(this).addClass('hide');
            });

            // 关闭弹窗
            $alert.on('click', '.btn-thx', function() {
                /*$alert.addClass('wrap-alert-out');
                setTimeout(function() {
                    $alert.addClass('hide').removeClass('wrap-alert-out');
                }, 3000);*/
                $alert.addClass('hide');
                $rule.removeClass('hide');
            });

            // 参与方式
            $page.on('click', '.rule-btn', function() {
                $rule.removeClass('hide');
            });

            // 关闭参与方式
            $rule.on('click', '.btn-thx', function() {
                /*$rule.addClass('wrap-alert-out');
                setTimeout(function() {
                    $rule.addClass('hide').removeClass('wrap-alert-out');
                }, 3000);*/
                $rule.addClass('hide');
            });
        }
    };

    Environment.init();
}(jQuery))
