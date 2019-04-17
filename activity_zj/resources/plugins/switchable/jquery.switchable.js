/**
 * 源自jquery.switchable 1.0
 * http://IlikejQuery.com/switchable/
 * 修改jquer高版本bug，根据需求修改部分逻辑
 * editor：guozhenshi
 * @Depend    jQuery 1.4+
**/
(function($){$.switchable=$.switchable||{};$.switchable={cfg:{triggers:"a",currentCls:"current",initIndex:0,triggerType:"mouse",delay:0.1,effect:"default",steps:1,visible:1,speed:0.7,easing:"swing",circular:false,vertical:false,panelSwitch:false,beforeSwitch:null,onSwitch:null,api:false},addEffect:function($,_){A[$]=_}};var A={"default":function(_,$){this.getPanels().hide();this.getVisiblePanel(_).show();$.call()},ajax:function(_,$){this.getPanels().first().load(this.getTriggers().eq(_).attr("href"),$)}};function _(G,B,F){var E=this,D=$(this),C,_=G.length-1;$.each(F,function(_,A){if($.isFunction(A))D.bind(_,A)});$.extend(this,{click:function(H,B){if(typeof H=="string"&&H.replace("#","")){_=G.filter("[href*='"+H.replace("#","")+"']");H=Math.max(_.index(),0)}var _=G.eq(H);B=B||$.Event();B.type="beforeSwitch";D.trigger(B,[H]);A[F.effect].call(E,H,function(){B.type="onSwitch";D.trigger(B,[H])});B.type="onStart";D.trigger(B,[H]);C=H;G.removeClass(F.currentCls);_.addClass(F.currentCls);return E},getCfg:function(){return F},getTriggers:function(){return G},getPanels:function(){return B},getVisiblePanel:function($){return E.getPanels().slice($*F.steps,($+1)*F.steps)},getIndex:function(){return C},move:function($){if(B.parent().is(":animated")||B.length<=F.visible)return E;if(typeof $=="number"){if($<0)return F.circular?E.click(_):E;else if($>_)return F.circular?E.click(0):E;else return E.click($)}else return E.click()},next:function(){return E.move(C+1)},prev:function(){return E.move(C-1)},bind:function($,_){D.bind($,_);return E},unbind:function($){D.unbind($);return E},beforeSwitch:function($){return this.bind("beforeSwitch",$)},onSwitch:function($){return this.bind("onSwitch",$)},resetPosition:function($){}});var H;G.each(function(_){if(F.triggerType==="mouse")$(this).bind({mouseenter:function($){if(_!==C)H=setTimeout(function(){E.click(_,$)},F.delay*1000)},mouseleave:function(){clearTimeout(H)}});else $(this).bind("click",function($){if(_!==C)E.click(_,$);return false})});if(location.hash)E.click(location.hash);else if(F.initIndex===0||F.initIndex>0)E.click(F.initIndex);B.find("a[href^='#']").click(function(_){E.click($(this).attr("href"),_)});if(F.panelSwitch)B.css("cursor","pointer").click(function(){E.next();return false})}$.fn.switchable=function(C,E){var B=this.eq(typeof E=="number"?E:0).data("switchable");if(B)return B;if($.isFunction(E))E={beforeSwitch:E};var A=$.extend({},$.switchable.cfg),D=this.length;E=$.extend(A,E);this.each(function(I){var F=$(this),A=C.jquery?C:F.children(C);if(!A.length)A=D==1?$(C):F.parent().find(C);var H=F.find(E.triggers);if(!H.length){var G=Math.ceil(A.length/E.steps);for(I=1;I<=G;I++)$("<a>",{href:"javascript:void(0);",target:"_self",text:I}).appendTo(F);H=F.children("a")}B=new _(H,A,E);F.data("switchable",B)});return E.api?B:this}})(jQuery);(function(_){var $=_.switchable;$.plugin=$.plugin||{};$.plugin.autoplay={cfg:{autoplay:true,interval:3,autopause:true,api:false}};_.fn.autoplay=function(C){if(typeof C=="number")C={interval:C};var B=_.extend({},$.plugin.autoplay.cfg),A;_.extend(B,C);this.each(function(){var D=_(this).switchable();if(D)A=D;var C,E,$=true;D.play=function(){if(C)return;$=false;C=setInterval(function(){D.next()},B.interval*1000);D.next()};D.pause=function(){C=clearInterval(C)};D.stop=function(){D.pause();$=true};if(B.autopause)D.getPanels().hover(function(){D.pause();clearTimeout(E)},function(){if(!$)E=setTimeout(D.play,B.interval*1000)});if(B.autoplay)setTimeout(D.play,B.interval*1000)});return B.api?A:this}})(jQuery);(function($){$.fn.carousel=function(){this.each(function(){var E=$(this).switchable(),F=E.getCfg(),C=E.getPanels(),_=C.parent(),A=E.getTriggers().length-1,G=C.slice(0,F.steps),H=C.slice(A*F.steps),D=F.vertical?"top":"left",B=C.length>=F.visible;if(B&&H.length<=F.visible)_.append(C.slice(0,F.visible).clone().addClass("clone"));$.extend(E,{move:function($){if(_.is(":animated")||!B)return this;if($<0){this.adjustPosition(true);return this.click(A)}else if($>A){this.adjustPosition(false);return this.click(0)}else return this.click($)},adjustPosition:function(B){var _=B?H:G,A=0;C.css("position","relative").each(function(){A+=F.vertical?$(this).outerHeight(true):$(this).outerWidth(true)});$.each(_,function(){$(this).css(D,B?-A:A+"px")})},resetPosition:function(B){var A=B?H:G;$.each(A,function(){$(this).css(D,"0px")});lastPosition=F.vertical?H.position().top:H.position().left;_.css(D,B?-lastPosition:0+"px")}})});return this}})(jQuery);$.switchable.addEffect("fade",function(A,$){var D=this,_=D.getCfg(),B=D.getPanels(),C=D.getVisiblePanel(A);B.hide();C.fadeIn(_.speed*1000,$)});$.switchable.addEffect("scroll",function(C,H){var E=this,$=E.getCfg(),_=E.getVisiblePanel(C),D=E.getPanels().parent(),A=E.getIndex(),B=E.getTriggers().length-1,G=A===0&&C===B||A===B&&C===0,F=A===0&&C===B?true:false,I=$.vertical?{top:-_.position().top}:{left:-_.position().left};D.is(":animated")&&D.stop(true);D.animate(I,$.speed*1000,$.easing,function(){H.call();G&&E.resetPosition(F)})})