'use strict';

(function($) {

    var config = {
        zindex: 0, // 操作对象父节点的 z-index
        background: [], // 颜色参数
        nums: 0, // 卡片数量
        stop: [0, 0, 0, 0], // 偏移坐标 0上 1右 2下 3左
        el: null // 操作对象
    }

    function sticky(el, options) {

        config.el = el;
        config.zindex = Number($(config.el).parent().css('z-index')) + 1;
        config.nums = $(config.el).length + config.zindex;
        config = $.extend(config, options);

        createCard();
        close();
        move();
        
    }

    function createCard() {

        if (config.stop[0] < 0 || config.stop[1] < 0 || config.stop[2] < 0 || config.stop[3] < 0) {
            alert('stop 偏移值 不可为负！');
            return
        }

        var html = '';
        var $e = $(config.el);
        var colors = config.background.length - 1; // 颜色数量

        var divH = parseInt($e.parent().height()); // 父容器高度
        var divW = parseInt($e.parent().width()); // 父容器宽度

        var elH = parseInt($e.height()) / 2;
        var elW = parseInt($e.width()) / 2;

        config.stop[0] = config.stop[0] + elH;
        config.stop[1] = config.stop[1] + elW;
        config.stop[2] = config.stop[2] + elH;
        config.stop[3] = config.stop[3] + elW;

        var stopMaxX = divW - config.stop[1] - elW; // 偏离X最大值
        var stopMaxY = divH - config.stop[2] - elH; // 偏离Y最大值

        if (stopMaxX < 0) {
            stopMaxX = 0;
        }

        if (stopMaxY < 0) {
            stopMaxY = 0;
        }

        var stopMinX = config.stop[3] - elW; // 偏离X最小值
        var stopMinY = config.stop[0] - elH; // 偏离Y最小值

        if (stopMinX > (divW - elW)) {
            stopMinX = (divW - elW*2);
        }

        if (stopMinY > (divH - elH)) {
            stopMinY = (divH - elH*2);
        }

        $e.each(function(i) {
            var zindex = random(config.zindex, config.nums); // 随机层级，范围从第一个节点的层级到节点的数量
            var color = random(0, colors); // 随机颜色
            var top = random(stopMinY, stopMaxY) + 'px';
            var left = random(stopMinX, stopMaxX) + 'px';
            var html = `<i class='close'></i>`;
            $(this).css({
                'z-index': zindex,
                background: config.background[color],
                top: top,
                left: left
            })

            $(this).html(html);
            $(this).fadeIn();
        })
    }

    function move() {

        $(config.el).mousedown(function(e) {

            var that = this;
            var fatherNode = $(that).parent();

            // 点击的便利贴升到最顶，最大值 z-index + 1
            config.nums++;
            $(that).css('z-index', config.nums);

            // 获取在目标便利贴按下鼠标的位置
            var mvx = e.clientX - fatherNode.offset().left; // 鼠标在父节点中的 X坐标
            var mvy = e.clientY - fatherNode.offset().top; // 鼠标在父节点中的 Y坐标
            var top = parseInt($(that).css('top'));
            var left = parseInt($(that).css('left'));

            // 获得鼠标点击在便利贴上的坐标
            var ctop = mvy - top;
            var cleft = mvx - left;

            fatherNode.mousemove(function(e) {
                var mvx = e.clientX - fatherNode.offset().left; // 鼠标在父节点中的 X坐标
                var mvy = e.clientY - fatherNode.offset().top; // 鼠标在父节点中的 Y坐标
                var fatherH = parseInt(fatherNode.height());
                var fatherW = parseInt(fatherNode.width());
                var elH = parseInt($(that).height());
                var elW = parseInt($(that).width());

                // 避免点击便利贴时的偏移
                mvx = mvx - cleft;
                mvy = mvy - ctop;

                // 移动边界
                var mousex = fatherW - elW;
                var mousey = fatherW - elH;

                if (mvx > mousex) {
                    mvx = mousex;
                }

                if (mvx < 0) {
                    mvx = 0;
                }

                if (mvy > mousey) {
                    mvy = mousey
                }

                if (mvy < 0) {
                    mvy = 0;
                }

                $(that).css({
                    top: mvy,
                    left: mvx
                })


            })

        })

        $(config.el).mouseup(function() {
            $(config.el).parent().off('mousemove');
        })

        $(config.el).parent().mouseleave(function(){
            $(config.el).parent().off('mousemove');
        })



    }

    function random(min, max) {
        return Math.round(min + Math.random() * (max - min));
    }

    function close(){
        $('.close').on('click',function(){
            $(this).parent().fadeOut();
        })
    }

    $.fn.sticky = function(options) {
        return new sticky(this, options)
    }

}(jQuery))
