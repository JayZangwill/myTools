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
				if(now) {
					now = false;
					fn();
				}
                clearTimeout(timer);
                timer = setTimeout(fn, delay);
            }
        }
    }
    window.jay = new Jay();
})();
