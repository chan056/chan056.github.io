/* 操作流程步骤插件
v1.0 | 20150120
guo
*/
;(function($){
	function draw(context){
		var options = $.data(context,"processbar").options;
		var str = "<ul class=\"process_steps\">";
		for(var i=0,length = options.items.length;i<length;i++){
			str += "<li class=\"step_item\"><span class=\"number\">" + (i+1) + "</span>" + "<label class=\"title\">" + options.items[i].title + "</label></li>";
		}
		$(context).addClass("processbar").append(str + "</ul><div class=\"progress\"><div class=\"progress_highlight\"></div></div>");
		adjust(context);
	}
	function adjust(context){
		var step = $.data(context,"processbar").options.step;
		var $process = $(context);
		var $step_items = $process.find(".step_item");
		var unit_width = ($process.find(".process_steps").width()-26)/($step_items.length-1);//options.items.length
		var padding = parseInt($process.css("padding-left"));

		$step_items.each(function(index){
			var $this = $(this);
			var $title = $(this).find(".title");
			$(this).css("left",unit_width*index);
			$title.css("margin-left",-$title.outerWidth()/2);
		});
		$process.find(".progress").css("width",$process.innerWidth()-4);
		$process.find(".progress_highlight").css("width",step<$step_items.length-1?$step_items.eq(step).position().left+padding:"100%");
	}
	
	function setValue(context,step){
		var $process = $(context);
		var $step_items = $process.find(".step_item");
		if( step < 0 ) step = 0;
		if( step >= $step_items.length ) step = $step_items.length-1; 
		$step_items.each(function(index){
			var $this = $(this);
			if(index < step){
				$this.removeClass("active").addClass("after");
			}else if(index == step){
				$this.removeClass("after").addClass("active");
			}else{
				$this.removeClass("active after");
			}
		});
		$process.find(".progress").css("width",$process.innerWidth()-4);
		$process.find(".progress_highlight").animate({width:step<$step_items.length-1?$step_items.eq(step).position().left+parseInt($process.css("padding-left")):"100%"},function(){
			//$step_items.eq(step).removeClass("after").addClass("active");
		})
		var options = $.data(context,"processbar").options;
		if( options.onChange && options.step != step){
			options.onChange(step,options.items[step]);
		}
		options.step = step;
	}
	
	
	$.fn.processbar = function(options,param){
		if (typeof options == "string") {
			return $.fn.processbar.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var data = $.data(this, "processbar"),
				opts;
			if (data) {
				opts = $.extend(data.options, options);
			} else {
				opts = $.extend({}, $.fn.processbar.defaults, options);
				data = $.data(this, "processbar", {
					options: opts
				});
			}
			draw(this);
			$(this).processbar("setValue",data.options.step);
		});
	}
	
	$.fn.processbar.defaults = {
		step: 0,//初始步骤
		items: [],//数组值为对象{title:用于显示的步骤名称},也可用于携带其他值,通过getItem获取
		onChange: null//setValue动态赋值或prev、next时触发,参数返回当前步数和item
	}
	
	$.fn.processbar.methods = {
		options: function (jq) {
			return $.data(jq[0], "processbar").options;
		},
		getItem: function (jq,index) {
			var options = jq.processbar("options");
			return options.items[index || options.step];
		},
		setValue: function (jq,index) {
			return jq.each(function () {
				setValue(this,index);
			});
		},
		getValue: function (jq) {
			return jq.eq(0).find(".step_item.active").index();
		},
		prev: function (jq) {
			jq.processbar("setValue",jq.data("processbar").options.step-1);
		},
		next: function (jq) {
			jq.processbar("setValue",jq.data("processbar").options.step+1);
		},
		adjust: function (jq) {
			return jq.each(function () {
				adjust(this);
			});
		}
	}

})(jQuery)