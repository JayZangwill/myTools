'use strict';

(function(window, document) {
    function Jay(selector) {};
    Jay.prototype = {
        constructor: Jay,
        //获取元素
        $: function(selector) {
            if (selector[0] === '#') {
                return document.getElementById(selector.slice(1));
            } else {
                var node = document.querySelectorAll(selector);
                return node.length > 1 ? node : node[0];
            }
        },
        //函数防抖
        debounce: function(fn, delay, now) {
            var timer;
            return function() {
                var self = this;
                if (now) {
                    now = false;
                    fn.call(self);
                }
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.call(self);
                }, delay);
            }
        },
        //函数节流
        throttle: function(fn, delay, time) {
            var timer,
                oldTime = new Date(),
                now;
            return function() {
                var self = this;
                if ((now = new Date()) - oldTime > time) {
                    fn.call(self);
                    oldTime = now;
                }
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.call(self);
                }, delay);
            }
        },
        //判断类型
        nativeType: function(obj) {
            var type = typeof obj;
            return type === 'object' ? {}.toString.call(obj) : type;
        }
    }
    window.jay = new Jay();
})(window, document);