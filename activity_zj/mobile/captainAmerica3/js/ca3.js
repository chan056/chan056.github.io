/******************************
** 文件描述 :  美国队长3活动
** 时    间 ： 2016.05.03
** 作    者 ： wangweimin
** E-mail：wangweimin@zjcap.cn
*******************************/
var server = window.location.origin;
(function($) {
    var CA3 = {

        init: function() {
            this.initPage();
        },

        initPage: function() {
            var me = this,
                $wrap = $('#wrap');

            $wrap.find('.page').css('height', $(document).height());

            $wrap.on('click', '.loading', function() {
                $(this).addClass('hide').next('.main').removeClass('hide');

                me.main();
            });

            // 登录后跳转
            if (sessionStorage.isjumpmd == 'true') {
                $wrap.find('.loading').trigger('click');
                sessionStorage.removeItem('isjumpmd');
            }
        },

        main: function() {
            var me = this,
                $wrap = $('#wrap'),
                $main = $wrap.find('.main'),
                $mask = $('.mask');

            // 判断回到顶部
            var backtopShow = function() {
                $(window).scroll(function() {
                    if($(this).scrollTop() > 1200) {
                        $('.backtop').show();
                    } else {
                        $('.backtop').hide();
                    }
                });
            }

            backtopShow();

            // 回到顶部
            $('.backtop').click(function() {
                $('body,html').animate({scrollTop:0}, 1000);
            });

            // 活动规则跳转
            $main.on('click', '.btn-rule', function() {
                $('body,html').animate({scrollTop: $('.block-7').position().top}, 1000);
            });

            // 我要赢彩蛋
            $main.on('click', '.btn-step1', function() {
                $('body,html').animate({scrollTop: $('.block-3').position().top + 180}, 1000);
            });

            // 彩蛋换电影周边
            $main.on('click', '.btn-step2', function() {
                $('body,html').animate({scrollTop: $('.block-6').position().top + 60}, 1000);
            });

            // 获取登录信息
            var getLoginInfo = function(){
                $.ajax({
                    url: '/web/loginInfo/',
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    success: function(response){
                        window.isLogin = response.isLogin;
                        disposeProduction(response.isLogin);
                    },
                    error: function(response) {
                    }
                });
            };

            // 获取用户信息
            var getUserInfo = function() {
                $.ajax({
                    url: '/web/auth/',
                    type: 'GET',
                    dataType: 'json',
                    async: true,
                    data: {
                        method: '/client/info'
                    },
                    success: function (response) {
                        var url = server + '/h5/activity/captainAmerica3/register.html';
                        if (response && response.data && response.data.uuid) {
                            url += '?uuid=' + response.data.uuid;
                        }
                        $('.mask').find('.js-links').html(url);
                    },
                    error: function(response) {
                    }
                });
            };

            // 产品处理
            var disposeProduction = function(isLogin) {
                // 已登录
                if (isLogin) {
                    $.ajax({
                        url: '/web/auth/',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            method: '/client/activity/civilwar/totalamount'
                        },
                        success: function(response) {
                            if (response && response.retCode == '0000') {
                                $main.find('.jnb .money').html( me.formatMoney(response.data.captainSideAmount, 2) );
                                $main.find('.zz .money').html( me.formatMoney(response.data.ironmanSideAmount, 2) );

                                $main.find('.block-login').hide().siblings('.block-money').show();
                            } else if(response && response.retCode == '1001') {
                                me.alert(response.retMsg);
                                var html = '<p class="tips">活动已过期</p>';
                                $main.find('.jnb').html(html);
                                $main.find('.zz').html(html);
                            }
                        },
                        error: function(response) {
                        }
                    });
                } else {
                    // 未登录
                    $main.find('.block-money').hide().siblings('.block-login').show();
                }
            };
            if (isAPP) {
                if (!window.isLogin && localStorage.isAccessToken) {
                    loginH5(localStorage.isAccessToken);
                }
                disposeProduction(window.isLogin || localStorage.isLogin);
            } else {
                getLoginInfo();
            }
            getUserInfo();

            // 登录
            $main.on('click', '.btn-login', function() {
                sessionStorage.isjumpmd = true;
                CallH5ToAPP(1, '', '', function() {
                    window.location.href = server + '/business/dispatch_get.do?action=doCurrentActivityLogin&h5_support=true';
                });
            });

            // 投资
            $main.on('click', '.btn-invest', function() {
                CallH5ToAPP(5, '', '/wechat/home.html?platform=wechat');
            });

            // 手机号邀请好友
            $main.on('click', '.btn-phone', function() {
                $mask.removeClass('hide').find('.invite-tip').removeClass('hide');
            });
            // 关闭邀请好友
            $mask.on('click', '.js-invite-close', function() {
                $mask.addClass('hide').find('.invite-tip').addClass('hide');
            });

            // 点击复制链接
            $main.on('click', '.btn-link', function() {
                if (window.isLogin) {
                    $mask.removeClass('hide').find('.copy-tip').removeClass('hide');
                } else {
                    me.alert('请先登录！', true);
                }
            });
            // 关闭复制链接
            $mask.on('click', '.js-copy-close', function() {
                $mask.addClass('hide').find('.copy-tip').addClass('hide');
            });

            // 查看我的彩蛋
            $main.on('click', '.btn-myegg', function() {
                //CallH5ToAPP(4, '', '/wechat/award.html');
                if (isAPP) {
                    if (localStorage.isAccessToken) {
                        loginH5(localStorage.isAccessToken);
                        window.location.href = '/wechat/award.html';
                    } else {
                        CallH5ToAPP(1, '', '', function() {});
                    }
                } else {
                    window.location.href = '/wechat/award.html';
                }
            });
        },

        //金额格式化,处理精度,四舍五入等问题
        formatMoney: function(number, digits, round, fill){
            number = parseFloat(number);
            if (!/^\d+(\.\d+)?$/.test(number)) {
                window.console && console.error("formatMoney方法传入非有效正数:" + number);
                return null;
            }
            if (round) {//round可以不传,默认不四舍五入
                return number.toFixed(digits).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
            } else {
                number += "";
                var numbar_arr = number.split(".");
                if (!digits) {//digits === 0
                    return numbar_arr[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') || 0;//被传入数字格式可能为 .1
                } else {
                    var integer = numbar_arr[0] || 0;
                    var decimals = numbar_arr[1] || "";
                    fill = typeof fill == "undefined"? true: fill;
                    if(decimals.length > digits){
                        decimals = decimals.substr(0,digits);
                    }else if(fill && decimals.length < digits){
                        while(decimals.length < digits){
                            decimals += "0";
                        }
                    }
                    return integer.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + (decimals.length?"." + decimals: "");
                }
            }
        },

        alert: function(msg, isjump) {
            var html = '<p class="alertTip">'+ msg +'</p>';
            $('body').append(html);

            setTimeout(function() {
                $('.alertTip').remove();
                if (isjump) {
                    $('.btn-login').eq(0).trigger('click');
                }
            }, 2000);
        }
    };

    CA3.init();
}(jQuery))
