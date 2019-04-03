/******************************
** 文件描述 :  地球熄灯1小时活动 中均资本
** 时    间 ： 2016.03.17 - 03.19
** 作    者 ： wangweimin
** E-mail：wangweimin@zjcap.cn
*******************************/
var server = window.location.origin;
(function($) {
    var Earth = {

        init: function() {
            $('.h').css('height', $(window).height() + 'px');
            this.loadRes();
        },

        //图片预加载
        loadRes: function() {
           var me = this,
                $load = $('.load'),
                index = 0,
                isError = false,
                firstTimer = new Date().getTime();

            // 图片名称
            var arr = ['b1', 'b2', 'b3', 'b5', 'd1', 'd2', 'd3', 'g1', 'g2', 'g3', 't1', 't2', 't3', 't4', 't5', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'z10'];

            for (var i = 1, l = arr.length; i < l; i++) {
                var objImg = new Image();
                objImg.src = server + '/h5/activity/earth/images/' + arr[i] +'.png';

                objImg.onload = function() {
                    index++;

                    $load.find('.progress').html(Math.floor(index / arr.length * 100) + '%');

                    if (index == arr.length - 1) {
                        if ((new Date().getTime() - firstTimer) < 2500) {
                            setTimeout(function() {
                                $load.hide();
                                me.main();
                            }, 2500);
                        } else {
                            $load.hide();
                            me.main();
                        }
                    }
                }
                objImg.onerror = function() {
                    if (!isError) {
                        isError = true;
                        if ((new Date().getTime() - firstTimer) < 2500) {
                            setTimeout(function() {
                                $load.hide();
                                me.main();
                            }, 2500);
                        } else {
                            $load.hide();
                            me.main();
                        }
                    }
                }
            }
        },

        main: function() {
            var me = this,
                $earth = $('.wrap-earth'),
                $page = $earth.find('.page'),
                $rule = $('.page-rule'),
                $share = $('.wrap-share'),
                $alert = $('.wrap-alert'),
                $nums = $earth.find('.js-nums');

            // 获取关灯数量
            var getLamp = function() {
                $.ajax({
                    url: server + '/web/noauth',
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    data: {
                        method: '/earthhour/activity/hits'
                    },
                    success: function(response) {
                        if (response.retCode == '0000') {
                            $nums.html( response.data );
                        }
                    }
                });
            }

            // 新增关灯
            var addLamp = function(callback) {
                $.ajax({
                    url: server + '/web/noauth',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        method: '/earthhour/activity/add'
                    },
                    success: function(response) {
                        if (response.retCode == '0000') {
                            callback && callback();
                        }
                    }
                });
            }

            var closeLayer = function() {
                $earth.addClass('hide');
                $earth.find('.title,.tip,.lamp,.light,.light2,.light3,.wire,.closelamp,.lefthand,.righthand,.earth-light').hide();
                $earth.find('.page').removeClass('page-out');
            }

            getLamp();

            $earth.removeClass('hide');

            // 关灯
            $earth.on('click', '.btn-closelamp', function() {
                $earth.find('.page').addClass('page-out');
                $('title').html('#地球熄灯日# 我是第'+ $nums.html() +'个参与熄灯的人');
                setTimeout(function() {
                    $earth.find('.btn-closelamp').hide();
                    $earth.find('.title2,.earth,.tip2,.share,.txt,.tophand').show();

                    setTimeout(function() {
                        $earth.find('.earth-light').addClass('light-shows').show();
                    }, 2600);

                    setTimeout(function() {
                        $alert.removeClass('hide');
                    }, 4000);
                }, 1900);

                // 是否关过灯
                if (localStorage.isEarthClick) {
                    return;
                }

                // 添加关灯
                addLamp(function() {
                    localStorage.isEarthClick = true;
                    setTimeout(function() {
                        $earth.find('.plusleft').addClass('plusrun');
                        $earth.find('.plusright').addClass('plusrun2');
                        $nums.html( $nums.html()*1 + 1);
                        $('title').html('#地球熄灯日# 我是第'+ $nums.html() +'个参与熄灯的人');
                    }, 4000);
                });
            });

            // 分享引导
            $earth.on('click', '.share-btn', function() {
                $('title').html('#地球熄灯日# 我是第'+ $nums.html() +'个参与熄灯的人');
                $share.removeClass('hide');
            });

            // 关闭分享引导
            $share.click(function() {
                $(this).addClass('hide');
            });

            // 弹窗
            $earth.on('click', '.btn-alert', function() {
                $alert.removeClass('hide');
            });

            // 关闭弹窗
            $alert.on('click', '.btn-thx', function() {
                $alert.addClass('hide');
                $earth.find('.way').removeClass('hide');
                $rule.removeClass('hide');
                closeLayer();
            });

            // 参与方式
            $earth.on('click', '.rule-btn', function() {
                $rule.removeClass('hide');
                closeLayer();
            });

            // 关闭参与方式
            $rule.on('click', '.btn-thx', function() {
                $rule.addClass('hide');
                $earth.find('.page').addClass('page-static');
                $earth.removeClass('hide');
                $earth.find('.earth-light').addClass('light-shows').show();
            });
        }
    };

    Earth.init();
}(jQuery))
