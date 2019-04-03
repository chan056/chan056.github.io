// 控制显示层
var pageShow = function(key) {
    $('.page').hide();
    $('.page-'+key).show();
};
/** 监听hash变化 **/
(function(a) {
    function _hash() {
        var hashVal = location.hash.replace('#', '');
        hashVal = hashVal || 'm1';
        pageShow(hashVal);
    }
    $(window).bind('hashchange', _hash);
    _hash();
})();
/**  **/
var ctx  = (function(dom, w, h) {
    var domcvs = dom.getElementById('canvas'),
        ctx = domcvs.getContext('2d'),
        img = new Image(),
        domimg = dom.getElementById('img');
    var drawName = function(name) {
        ctx.restore();
        ctx.clearRect(0,0,w,h);
        ctx.drawImage(img, 0, 0, w, h);
        ctx.save();
        ctx.rotate(4*Math.PI/180);
        ctx.fillStyle = "#000";
        var py = ConvertPinyin(name).toUpperCase();


        ctx.font = "bold 16px Microsoft YaHei";
        ctx.fillText(name, 75, 38);
        ctx.fillText(py, 75, 58);

        ctx.font = "bold 12px Microsoft YaHei";
        ctx.fillText(name, 595, 190);
        ctx.fillText(py, 595, 205);
        domimg.src = domcvs.toDataURL();
    }
    img.src="images/ticket80.jpg";
    img.onload = function(){

        drawName('大毛');
    }

    return drawName;
})(document, 710, 410);
$('#btn').click(function(event) {
    var val = $('#txt').val() || '';
    if(!val) return;
    val = $.trim(val);
    ctx(val);
    location.href = "#m2";
});

