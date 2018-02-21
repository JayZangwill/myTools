(function () {
    function Jay() {};
    Jay.prototype = {
        constructor: Jay,
        $: function (selector) {
            if (selector.substr(0, 1) === '#') {
                return document.getElementById(selector.slice(1));
            } else {
                var node = document.querySelectorAll(selector);
                return node.length > 1 ? node : node[0];
            }
        }
    }
    window.jay = new Jay();
})();