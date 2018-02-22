(function () {
    function Jay() {};
    Jay.prototype = {
        constructor: Jay,
        //获取dom
        $: function (selector) {
            if (selector.substr(0, 1) === '#') {
                return document.getElementById(selector.slice(1));
            } else {
                var node = document.querySelectorAll(selector);
                return node.length > 1 ? node : node[0];
            }
        },
        //函数防抖
        debounce: function (fn, delay, now) {
            var timer;
            return function () {
                var self = this;
                if (now) {
                    now = false;
                    fn.call(self);
                }
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.call(self);
                }, delay);
            }
        },
        //函数节流
        throttle: function (fn, delay, time) {
            var timer,
                oldTime = new Date(),
                now;
            return function () {
                var self = this;
                if ((now = new Date()) - oldTime > time) {
                    fn.call(self);
                    oldTime = now;
                }
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.call(self);
                }, delay);
            }
        },
        //事件绑定
        on: function (node, type, fn, option) {
            option == undefined && (option = false);
            window.addEventListener ? node.addEventListener(type, fn, option) : node.attachEvent('on' +
                type, fn);
        },
        //事件取消
        off: function (node, type, fn, option) {
            option == undefined && (option = false);
            window.removeEventListener ? node.removeEventListener(type, fn, option) : node.detachEvent('on' +
                type, fn);
        }
    }
    window.jay = new Jay();
})();
