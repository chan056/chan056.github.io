/******************************
** 文件描述 :  奥运大竞猜
** 时    间 ： 2016.08.01
** 作    者 ： wangweimin
** E-mail：wangweimin@zjcap.cn
*******************************/
var server = window.location.origin;
(function($) {
    var Olympic = {

        init: function() {
            this.initPage();
            $('.wrap-con')[0] && this.loadRes();
            $('.register-con')[0] && this.register();
        },

        initPage: function() {
            var wh = $(window).height(),
                dh = $(document).height(),
                h = wh > dh ? wh : dh;

            $('.mask').css('height', h);
        },

        //图片预加载
        loadRes: function() {
           var me = this,
                $load = $('.load'),
                index = 0,
                times = 0;

            $('#wrap').css('height', '1334px');

            var arr = ['loading.gif', 'bg_index.jpg', 'product.jpg', 'title.png', 'what.png', 'nowbuy.png', 'rate_right.png', 'rate_wrong.png', 'btn_bg.png', 'ojb.png', 'mascot.png', 'bg_foot2.png', 'bg_share.png', 'bg_register.jpg', 'bg_foot.jpg', 'btn_register.png', 'icon_horn.png', 'icon_imgcode.png', 'icon_mobile.png', 'icon_phonecode.png'];

            //超过3秒且资源加载完
            var timer = setInterval(function() {
                times++;
                if (times >= 3) {
                    if (index == arr.length) {
                        clearInterval(timer);
                        $load.hide();
                        me.main();
                    }
                }
            }, 1000);

            for (var i = 0, l = arr.length; i < l; i++) {
                var objImg = new Image();
                //if (location.host == 'mingsixue.com') {
                    //objImg.src = server + '/test/h5/activity/olympic/images/' + arr[i];
                //} else {
                    objImg.src = server + '/h5/activity/olympic/images/' + arr[i];
                //}

                objImg.onload = function() {
                    index++;

                    //if (index == l) {
                        //$load.hide();
                        //me.main();
                    //}
                }
                objImg.onerror = function() {
                    clearInterval(timer);
                    $load.hide();
                    me.main();
                }
            }
        },

        // 首页
        main: function() {
            var productSn; //产品sn 需要每次替换，没有则不写
            var $wrap = $('.wrap-con');

            /*if (server == 'https://www.zjtest3.com') {
                productSn = 1042;
            } else if (server == 'https://uatest.winfae.com') {
                productSn = 690;
            }*/

            $('#wrap').removeAttr('style');
            $('#wrap').attr('style', 'background: #0a9142 url(images/bg_foot2.png) no-repeat center bottom;');
            $wrap.show();

            if (window.isAPP) {
                $wrap.find('.btn-share').hide();
            }

            // 跳转注册页
            $wrap.on('click', '.btn-register', function() {
                if (window.isIOS) {
                    window.location.href = $(this).data('href') + '?ios_h5_zjcap&WKWebView=' + window.WKWebView;
                } else {
                    window.location.href = $(this).data('href');
                }
            });

            // 立即抢购
            $wrap.on('click', '.btn-buy', function() {
                if (productSn) {
                    CallH5ToAPP(2, {productSn: productSn}, '/wechat/product_detail2.html?productSn=' + productSn);
                } else {
                    //没有产品则去应用宝
                    //window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zjzc.zjcap';

                    //新需求 没产品去首页
                    if (window.isAPP) {
                        CallH5ToAPP(5, '', '/wechat/home.html?platform=wechat');
                    } else {
                        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zjzc.zjcap';
                    }
                }
            });

            // 详细规则
            $wrap.on('click', '.rules h3', function() {
                if ($wrap.find('.rule-con:visible').length) {
                    $wrap.find('.rule-con').hide();
                } else {
                    $wrap.find('.rule-con').show();
                }
            });

            // 分享弹窗
            $wrap.on('click', '.btn-share', function() {
                $('.mask-share').show();
                $('.mask').show();
            });
            $('.mask').click(function() {
                $('.mask-share').hide();
                $('.mask').hide();
            });

            $.ajax({
                url: '/web/loginInfo/',
                type: 'GET',
                dataType: 'json',
                cache: false,
                async: true,
                success: function(response){
                    if (response.isLogin) {
                        $wrap.find('.btn-register').hide();
                    } else {
                        $wrap.find('.btn-register').show();
                    }
                }
            });
        },

        // 快速注册
        register: function() {
            var me = this,
                $wrap = $('#wrap'),
                $main = $wrap.find('.register-con'),
                $mask = $wrap.find('.mask'),
                $verification = $wrap.find('.mask-verification'),
                $alert = $wrap.find('.alert-con');

            $wrap.css('height', '1334px');

            // 提示框
            var tips = function(msg, speed) {
                $wrap.find('.tips').html(msg).show();

                setTimeout(function() {
                    $wrap.find('.tips').hide().html('');
                }, speed || 1500);
            };

            // alert框
            var alert = function(msg) {
                $alert.find('.con').html(msg).end().show();
                $mask.show();
            };

            // 显示图形验证码框
            var showVerification = function() {
                $alert.hide();
                $mask.show();
                $verification.show();
                $verification.find('.imgcode').trigger('click');
            };

            var zero = function(num) {
                return num < 10 ? '0' + num : num;
            };

            // 验证码倒计时
            var countdown = function($this) {
                var s = 60;
                $this.addClass('disabled').attr('disabled', true).html('60s后获取');
                var timer = setInterval(function() {
                    s--;
                    if (s <= 0) {
                        clearInterval(timer);
                        $wrap.find('.input-mobile').attr('disabled', false).prev('strong').removeClass('disabled');
                        $this.html('获取验证码').removeClass('disabled').attr('disabled', false);
                        return;
                    }
                    $this.html(zero(s) + 's');
                }, 1000);
            };

            // 获取手机验证码信息
            var getSendinfo = function(mobile, $this) {
                $.ajax({
                    url: '/web/noauth/',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        method: '/validate/code/sendinfo',
                        mobilePhone: mobile
                    },
                    success: function(response) {
                        // 发送验证码
                        $.ajax({
                            url: '/web/sendregistersmscode',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                mobilePhone: mobile,
                                messageType: 1,
                                stringToken: response.data.stringToken,
                                imageToken: $verification.find(".input-imgcode").val()
                            },
                            success: function(res) {
                                if (res.retCode == '0000') {
                                    $wrap.find('.input-mobile').attr('disabled', true).prev('strong').addClass('disabled');
                                    countdown($this);
                                    $main.find('.btn-phonecode').data('isimg', 1);
                                    tips('验证码发送成功');
                                } else {
                                    alert(res.retMsg);
                                }
                            }
                        })
                    }
                });
            };

            // 登录
            $main.on('click', '.btn-login', function() {
                if (window.isAPP) {
                    if (window.isIOS) {
                        sessionStorage.apptoh5url = 'index.html?source=ios_h5_zjcap&WKWebView=' + window.WKWebView;
                    } else {
                        sessionStorage.apptoh5url = 'index.html?source=android_h5_zjcap';
                    }
                }

                CallH5ToAPP(1, '', '', function() {
                    window.location.href = server + '/business/dispatch_get.do?action=doCurrentActivityLogin&h5_support=true';
                });
            });

            $alert.on('click', '.btn-confirm', function() {
                $alert.find('.con').html('').end().hide();
                $mask.hide();
            });

            // 手机验证
            $main.on('keyup', '.input-mobile', function() {
                var $this = $(this),
                    val = ($this.val()).replace(/\s/g, '');

                $this.val(val);

                if (!/^(1[34578][0-9])\d{8}$/.test(val)) {
                    return $this.addClass('error');
                } else {
                    $main.find('.input-mobile').trigger('blur');
                    return $this.removeClass('error');
                }
            });
            $main.on('blur', '.input-mobile', function() {
                var $this = $(this),
                    val = ($this.val()).replace(/\s/g, '');

                if  (!$wrap.find('.alert-con:visible')) {
                    return;
                }

                $this.val(val);

                if (!/^(1[34578][0-9])\d{8}$/.test(val)) {
                    $this.addClass('error');
                    return tips('请输入正确的手机号');
                } else {
                    // 手机号是否请求验证过，是则不再请求
                    var checks = JSON.parse(sessionStorage.getItem('checkmobile'));
                    if (checks && checks.mobile) {
                        if (checks.mobile == val) {
                            if (checks.retCode == '6006') {
                                $this.get(0).blur();
                                me.isYet = true;
                                $this.addClass('error');
                                return tips('该手机号已注册！')
                            } else if (checks.retCode == '0000') {
                                $this.removeClass('error');
                                $this.get(0).blur();
                                $main.find('.btn-phonecode').removeClass('disabled');

                                //图形验证码
                                showVerification();
                            } else {
                                return alert(checks.retMsg);
                            }
                            return;
                        }
                    }

                    //手机号是否注册
                    $.ajax({
                        url: '/web/noauth',
                        type: 'GET',
                        dataType: 'json',
                        async: false,
                        data: {
                            method: '/register/mobile/check',
                            mobilePhone: val
                        },
                        success: function(response) {
                            var checkmobile = {mobile: val, retCode: response.retCode, retMsg: response.retMsg};
                            sessionStorage.setItem('checkmobile', JSON.stringify(checkmobile));

                            if (response.retCode == '6006') {
                                $this.get(0).blur();
                                me.isYet = true;
                                $this.addClass('error');
                                return tips('该手机号已注册！')
                            } else if (response.retCode == '0000') {
                                $this.removeClass('error');
                                $this.get(0).blur();
                                $main.find('.btn-phonecode').removeClass('disabled');

                                //图形验证码
                                showVerification();
                            } else {
                                return alert(response.retMsg);
                            }
                        }
                    });
                }
            });

            // 短信验证码验证
            $main.on('keyup', '.input-phonecode', function() {
                var $this = $(this),
                    val = ($this.val()).replace(/\s/g, '');

                $this.val(val);

                if (!/^\d{6}$/i.test(val)) {
                    return $this.addClass('error');
                } else {
                    $main.find('.input-phonecode').trigger('blur');
                    return $this.removeClass('error');
                }
            });
            $main.on('blur', '.input-phonecode', function() {
                var $this = $(this),
                    val = ($this.val()).replace(/\s/g, '');

                if (!/^(1[34578][0-9])\d{8}$/.test($main.find('.input-mobile').val())) {
                    return $main.find('.input-mobile').addClass('error');
                }

                $this.val(val);

                if (!/^\d{6}$/i.test(val)) {
                    $this.addClass('error');
                    $this.get(0).blur();
                    $main.find('.btn-register').addClass('disabled');
                    return;
                    //return alert('请输入正确的手机验证码');
                }

                $this.removeClass('error');

                if (!/^[a-z0-9]{4}$/i.test($verification.find('.input-imgcode').val())) {
                    return $verification.find('.input-imgcode').addClass('error');
                }

                $main.find('.btn-register').removeClass('disabled');
            });

            // 刷新图形验证码
            $verification.on('click', '.imgcode', function() {
                var phone = $main.find('.input-mobile').val();
                $(this).attr('src', server + '/validcode/generate-validcode-api.do?mobilePhone='+ phone +'&_='+ Math.random());
                $verification.find('.input-imgcode').val('');
            });

            // 取消验证码输入框
            $verification.on('click', '.btn-cancel', function() {
                $verification.hide();
                $mask.hide();
            });

            // 验证图形验证码
            $verification.on('keyup', '.input-imgcode', function() {
                var $this = $(this),
                    val = ($this.val()).replace(/\s/g, '');

                $this.val(val);

                if (!/^[a-z0-9]{4}$/i.test(val)) {
                    return $this.addClass('error');
                } else {
                    return $this.removeClass('error');
                }
            });
            $verification.on('blur', '.input-imgcode', function() {
                var $this = $(this),
                    val = ($this.val()).replace(/\s/g, '');

                $this.val(val);

                if (!/^[a-z0-9]{4}$/i.test(val)) {
                    $this.val('').addClass('error');
                    $this.next('.imgcode').trigger('click');
                    return tips('验证码不正确');
                } else {
                    $this.removeClass('error');
                }
            });

            // 关闭验证码输入框
            $verification.on('click', '.btn-confirm', function() {
                $verification.find('.input-imgcode').trigger('blur');

                if ($verification.find('.input-imgcode').hasClass('error')) {
                    return;
                }

                $verification.hide();
                $mask.hide();
                $main.find('.btn-phonecode').removeClass('disabled').data('isimg', 2).trigger('click');
            });

            // 获取短信验证码
            $main.on('click', '.btn-phonecode', function() {
                var $this = $(this),
                    $mobile = $wrap.find('.input-mobile'),
                    val = ($mobile.val()).replace(/\s/g, '');

                if (!$this.hasClass('disabled')){

                    if (!/^(1[34578][0-9])\d{8}$/.test(val)) {
                        return;
                    }

                    if ($mobile.hasClass('error')) {
                        return;
                    }

                    if ($this.data('isimg') == 2) {
                        getSendinfo(val, $this);
                    } else {
                        if (!me.isYet) {
                            $wrap.find('.input-mobile').trigger('blur');
                        }
                        me.isYet = false;

                        $wrap.find('.input-phonecode').val('');
                        $wrap.find('.btn-register').addClass('disabled');
                    }
                }
            });

            // 验证推荐人
            $main.on('keyup', '.input-referrer', function() {
                var $this = $(this),
                    val = $this.val();

                if (val) {
                    val = val.replace(/\s/g, '');
                    $this.val(val);

                    if (!/^(1[34578][0-9])\d{8}$/.test(val)) {
                        return $this.addClass('error');
                    } else {
                        var mobile = $main.find('.input-mobile').val();
                        if (val == mobile) {
                            tips('推荐人手机号不允许和注册的手机号相同');
                            return $this.addClass('error');
                        }
                        return $this.removeClass('error');
                    }
                } else {
                    $this.removeClass('error');
                }
            });
            $main.on('blur', '.input-referrer', function() {
                var $this = $(this),
                    val = $this.val();

                $this.val(val);

                if (val) {
                    val = val.replace(/\s/g, '');
                    $this.val(val);

                    if (!/^(1[34578][0-9])\d{8}$/.test(val)) {
                        $this.addClass('error');
                        return tips('请输入正确的手机号');
                    } else {
                        var mobile = $main.find('.input-mobile').val();
                        if (val == mobile) {
                            tips('推荐人手机号不允许和注册的手机号相同');
                            return $this.addClass('error');
                        }
                        return $this.removeClass('error');
                    }
                } else {
                    $this.removeClass('error');
                }
            });

            // 注册
            $wrap.on('click', '.btn-register', function() {
                var $this = $(this);

                if (!$wrap.find('.input-mobile').val()) {
                    $wrap.find('.input-mobile').trigger('keyup');
                    return;
                }

                if (!$wrap.find('.input-phonecode').val()) {
                    $wrap.find('.input-phonecode').trigger('keyup');
                    return;
                }

                if ($wrap.find('.error').length > 0) {
                    return;
                }

                if ($this.hasClass('disabled')) {
                    return;
                }

                $this.addClass('disabled');

                $.ajax({
                    url: '/web/registerandlogin',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        smsVerifyCode: ($wrap.find('.input-phonecode').val()).replace(/\s/g,""),
                        mobilePhone: ($wrap.find('.input-mobile').val()).replace(/\s/g,""),
                        introducer: ($wrap.find('.input-referrer').val()).replace(/\s/g,"")
                    },
                    success: function(response) {
                        if (response.retCode == '0000') {
                            tips('注册成功，请查收短信！');

                            setTimeout(function() {
                                //删除checkmobile
                                sessionStorage.removeItem('checkmobile');
                                //跳转活动首页
                                window.location.href = 'index.html';
                            }, 1500);
                        } else {
                            $this.removeClass('disabled');
                            alert(response.retMsg);
                        }
                    }
                });
            });
        }
    };

    Olympic.init();
}(jQuery))
