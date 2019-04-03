/******************************
** 文件描述 :  美国队长3活动 快速注册
** 时    间 ： 2016.05.04
** 作    者 ： wangweimin
** E-mail：wangweimin@zjcap.cn
*******************************/
var server = window.location.origin;
(function($) {
    var CA3 = {

        init: function() {
            this.reg();
        },

        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                if (r[2].indexOf("%u") < 0) {
                    r[2] = decodeURIComponent(r[2]).replace(/\\/g, "%");
                }
                return this.xssEscape(unescape(r[2]));
            }
            return null;
        },

        xssEscape: function (content) {
            return typeof content === 'string'
            ? content.replace(/&(?![\w#]+;)|[<>"']/g, function (s) {
                return {
                    "<": "&#60;",
                    ">": "&#62;",
                    '"': "&#34;",
                    "'": "&#39;",
                    "&": "&#38;"
                }[s];
            })
            : content;
        },

        reg: function() {
            var me = this,
                $wrap = $('.register-main'),
                h = ($(window).height() < 1300) ? 1300 : $(window).height(),
                uuid = me.getQueryString('uuid') || '';

            $wrap.css('height', h);

            var zero = function(num) {
                return num < 10 ? '0' + num : num;
            };

            // 倒计时
            var downTime = function($this) {
                var s = 60;

                $this.addClass('disabled');

                var timer = setInterval(function() {
                    s--;
                    if ( s < 0) {
                        clearInterval(timer);
                        $this.html('获取验证码').removeClass('disabled');
                        return;
                    }

                    $this.html(zero(s) + ' s');
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
                                imageToken: $.trim($(".code").val())
                            },
                            success: function(response) {
                                downTime($this);
                            }
                        })
                    }
                })
            };

            //验证手机号
            $wrap.on('blur', '.phone', function() {
                var $this = $(this),
                    $tip = $wrap.find('.phone-tip'),
                    val = $.trim($this.val());

                if (!/^(1[34578][0-9])\d{8}$/.test(val)) {
                    $tip.html('手机号格式错误').removeClass('hide');
                    return;
                } else {
                    //手机号是否注册
                    $.ajax({
                        url: '/web/noauth',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            method: '/register/mobile/check',
                            mobilePhone: $this.val()
                        },
                        success: function(response) {
                            if (response.retCode == '6006') {
                                $tip.html(response.retMsg).removeClass('hide');
                                return;
                            } else {
                                $tip.addClass('hide');
                                $wrap.find('.codeImg').trigger('click');
                            }
                        }
                    });
                }
            });

            // 图形验证码
            $wrap.on('blur', '.code', function() {
                var $this = $(this),
                    $tip = $wrap.find('.code-tip'),
                    val = $.trim($this.val());

                if (!/^[a-z0-9]{4,6}$/i.test(val)) {
                    $tip.removeClass('hide');
                } else {
                    $tip.addClass('hide');
                }
            });

            $wrap.on('click', '.codeImg', function() {
                var $this = $(this);

                if ($wrap.find('.phone').val()) {
                    $this.attr('src', server + '/validcode/generate-validcode-api.do?mobilePhone='+ $wrap.find('.phone').val() +'&_='+ Math.random());
                } else {
                    $this.attr('src', server + '/validcode/generate-validcode.do?' + Math.random());
                }

                $('.code').val('');
            });

            $wrap.on('click', '.codeTxt', function() {
                $wrap.find('.codeImg').trigger('click');
            });

            // 手机验证码
            $wrap.on('blur', '.phonecode', function() {
                var $this = $(this),
                    $tip = $wrap.find('.phonecode-tip'),
                    val = $.trim($this.val());

                if (!/^[a-z0-9]{4,6}$/i.test(val)) {
                    $tip.removeClass('hide');
                } else {
                    $tip.addClass('hide');
                }
            });

            // 获取验证码
            $wrap.on('click', '.btn-code', function() {
                var $this = $(this);
                if (!$this.hasClass('disabled')){
                    var mobile = $.trim($wrap.find('.phone').val());

                    if (!mobile) {
                        return;
                    }

                    getSendinfo(mobile, $(this));
                }
            });

            //注册
            $wrap.on('click', '.btn-register', function() {
                var $this = $(this);

                $wrap.find('input').trigger('blur');

                if ($wrap.find('.js-tip:visible').length > 0) {
                    return;
                }

                if ($this.hasClass('disabled')) {
                    return;
                }

                $this.addClass('disabled');

                $.ajax({
                    url: '/web/noauth/',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        method: '/register/quickpersonal',
                        smsVerifyCode: $.trim($wrap.find('.phonecode').val()),
                        mobilePhone: $.trim($wrap.find('.phone').val()),
                        introducerUuid: uuid
                    },
                    success: function(response) {
                        if (response.retCode == '0000') {
                            window.location.href = server + '/wechat/home.html?platform=wechat';
                        } else {
                            $this.removeClass('disabled');
                            alert(response.retMsg);
                        }
                    }
                })
            });
        }
    };

    CA3.init();
}(jQuery))
