class Jay {
  // 获取dom
  $ (selector) {
    if (selector[0] === '#') {
      return document.getElementById (selector.slice (1));
    } else {
      const node = document.querySelectorAll (selector);
      return node.length > 1 ? node : node[0];
    }
  }
  // 函数防抖
  debounce (fn, delay = 300, immediate = true) {
    let timer;
    let complete // 处理fn报错

    function _debounce () {
      if (timer) {
        clearTimeout (timer);
      }

      if (immediate) {
        timer = setTimeout (() => {
          timer = null;
          complete = false
        }, delay);

        if (!complete) {
          complete = true
          fn.apply (this, arguments);
        }
      } else {
        timer = setTimeout (() => {
          fn.apply (this, arguments);
        }, delay);
      }
    }

    _debounce.cancel = () => {
      clearTimeout (timer);
    };

    return _debounce;
  }

  // 函数节流
  throttle (fn, delay = 1000) {
    let timer

    return function() {
      if (timer) {
        return
      }

      timer = setTimeout(() => {
        fn.apply(this, arguments)
        timer = null
      }, delay)
    }
  }

  nativeType (type) {
    return typeof type !== 'object'
      ? typeof type
      : {}.toString.call (type).slice (8, -1).toLocaleLowerCase ();
  }

  //获取url参数
  getParameter (key) {
    if (!key) {
      const result = {};
      const reg = /[\?&]([^=]*)=([^?&#/]*)/g;

      while (reg.test (window.location.href)) {
        result[RegExp.$1] = RegExp.$2;
      }

      return result;
    } else if (this.nativeType (key) === 'array') {
      const result = {};
      key.forEach (item => {
        result[item] = new RegExp (item + '=([^?&#/]*)').test (
          window.location.href
        )
          ? RegExp.$1
          : '';
      });

      return result;
    }
    return new RegExp (key + '=([^?&#/]*)').test (window.location.href)
      ? RegExp.$1
      : '';
  }

  objMerge (target, obj) {
    Object.keys (obj).forEach (key => {
      target[key] && this.nativeType (target[key]) === 'object'
        ? this.objMerge (target[key], obj[key])
        : (target[key] = obj[key]);
    });

    return target;
  }

  insertAfter (target, node) {
    if (target.nodeType !== 1 || node.nodeType !== 1) {
      throw TypeError (target + 'or' + node + 'is no a html node!');
    }
    const next = target.nextSibling;
    const parent = target.parentNode;

    next ? parent.insertBefore (node, next) : parent.appendChild (node);
  }

  isBottom (height = 100, dom = document) {
    if (this.nativeType(height) !== 'number') {
      [height, document] = [100, height]
    }

    const isDocument = dom === document
    const scrollTop = isDocument ? document.documentElement.scrollTop || document.body.scrollTop : dom.scrollTop // 滚动条位置
    const scrollHeight = isDocument ? document.documentElement.scrollHeight || document.body.scrollHeight : dom.scrollHeight // 总高度
    const offsetHeight = isDocument ? document.documentElement.clientHeight : dom.offsetHeight // 可视区域高度

    return scrollHeight - scrollTop - height <= offsetHeight;
  }

  deepClone(obj, map = new WeakMap()) {
    if (typeof obj !== 'object' || obj == null || typeof obj === 'function') {
      return obj
    }

    const result = Array.isArray(obj) ? [] : {}

    if (map.get(obj)) {
      return map.get(obj)
    }

    map.set(obj, result)

    for (let key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        result[key] = this.deepClone(obj[key], map)
      } else {
        result[key] = obj[key]
      }
    }

    return result
  }

  checkCross({ clientY, clientX, top, bottom, left, width }) {
    return clientY > top && clientY < bottom && clientX < left + width && clientX > left
  }

  curry(fn, ...arg) {
    const self = this

    return function () {
      const args = arg.concat(...arguments)

      return fn.length > args.length ? self.curry.call(self, fn, ...args) : fn.apply(self, args)
    }
  }
}

export default new Jay ();
