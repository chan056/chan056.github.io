/******************************
** 文件描述 :  欧洲杯决战
** 时    间 ： 2016.07.09
** 作    者 ： wangweimin
** E-mail：wangweimin@zjcap.cn
*******************************/
var server = window.location.origin;
(function($) {
    var EuroCup = {

        init: function() {
            this.main();
        },

        main: function() {
            var me = this,
                $wrap = $('#wrap'),
                $main = $wrap.find('.wrap-con'),
                $mask = $wrap.find('.mask'),
                $verification = $wrap.find('.mask-verification'),
                $login = $wrap.find('.mask-login');

            var showMask = function() {
                var h = $(window).height();
                $mask.css('height', h).show();
            };

            var showVerification = function(phone) {
                $verification.show();
                $verification.find('.codeImg').trigger('click');
            };

            var zero = function(num) {
                return num < 10 ? '0' + num : num;
            };

            var countdown = function($this) {
                var s = 60;
                $this.addClass('disabled').attr('disabled', true);
                var timer = setInterval(function() {
                    s--;
                    if (s <= 0) {
                        clearInterval(timer);
                        $wrap.find('.input-mobile').attr('readonly', false);
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
                                imageToken: $(".input-imgcode").val()
                            },
                            success: function(res) {
                                if (res.retCode == '0000') {
                                    $wrap.find('.input-mobile').attr('readonly', true);
                                    countdown($this);
                                    $main.find('.btn-code').data('isimg', 1);
                                    alert('短信发送成功，请注意查收！');
                                } else {
                                    alert(res.retMsg);
                                }
                            }
                        })
                    }
                })
            };

            $main.on('blur', '.input-mobile', function() {
                var $this = $(this),
                    val = ($this.val()).replace(/\s/g,"");

                if (!/^(1[34578][0-9])\d{8}$/.test(val)) {
                    $this.addClass('error');
                    return alert('请输入手机号或格式错误！');
                } else {
                    //手机号是否注册
                    $.ajax({
                        url: '/web/noauth',
                        type: 'GET',
                        dataType: 'json',
                        async: false,
                        data: {
                            method: '/register/mobile/check',
                            mobilePhone: $this.val()
                        },
                        success: function(response) {
                            if (response.retCode == '6006') {
                                $this.get(0).blur();
                                me.isYet = true;
                                return alert('手机号已注册！')
                            } else {
                                $this.removeClass('error');

                                //图形验证码
                                if (!$wrap.find('.btn-code').hasClass('disabled')) {
                                    showMask();
                                    showVerification(val);
                                }
                            }
                        }
                    });
                }
            });

            $main.on('blur', '.input-code', function() {
                var $this = $(this),
                    val = ($this.val()).replace(/\s/g,"");

                if (!/^[a-z0-9]{6}$/i.test(val)) {
                    $this.addClass('error');
                    $this.get(0).blur();
                    return alert('请输入验证码或验证码错误！');
                }

                $this.removeClass('error');
            });

            // 刷新图形验证码
            $verification.on('click', '.codeImg', function() {
                var phone = $main.find('.input-mobile').val();
                $(this).attr('src', server + '/validcode/generate-validcode-api.do?mobilePhone='+ phone +'&_='+ Math.random());

                $verification.find('.input-verification').val('');
                $main.find('.input-imgcode').val('');
            });

            // 取消验证码输入框
            $verification.on('click', '.btn-cancel', function() {
                $verification.hide();
                $mask.hide();
            });

            // 关闭验证码输入框
            $verification.on('click', '.btn-confirm', function() {
                var val = ($verification.find('.input-verification').val()).replace(/\s/g,"");

                if (!/^[a-z0-9]{4}$/i.test(val)) {
                    return alert('请输入图形验证码或验证码格式错误！');
                }

                $wrap.find('.input-imgcode').val(val);
                $verification.hide();
                $mask.hide();

                $main.find('.btn-code').data('isimg', 2).trigger('click');
            });

            // 获取短信验证码
            $main.on('click', '.btn-code', function() {
                var $this = $(this),
                    $mobile = $wrap.find('.input-mobile'),
                    val = ($mobile.val()).replace(/\s/g,"");

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
                    }
                }
            });

            // 注册
            $wrap.on('click', '.btn-reg', function() {
                var $this = $(this);

                if (!$wrap.find('.input-mobile').val()) {
                    $wrap.find('.input-mobile').trigger('blur');
                    return;
                }

                if (!$wrap.find('.input-code').val()) {
                    $wrap.find('.input-code').trigger('blur');
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
                        smsVerifyCode: ($wrap.find('.input-code').val()).replace(/\s/g,""),
                        mobilePhone: ($wrap.find('.input-mobile').val()).replace(/\s/g,""),
                        introducer: ($wrap.find('.input-referrer').val()).replace(/\s/g,"")
                    },
                    success: function(response) {
                        if (response.retCode == '0000') {
                            alert('注册成功，请查收短信！');
                            window.location.href = server + '/wechat/home.html?platform=wechat';
                        } else {
                            $this.removeClass('disabled');
                            alert(response.retMsg);
                        }
                    }
                });
            });
        }
    };

    EuroCup.init();
}(jQuery))
