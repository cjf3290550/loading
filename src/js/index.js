;(function (win, doc, undefined) {
    function Loading(options) {
        this.config = {
            width: 6,         // loading框的宽度，单位：‘rem’
            height: 6,        // loading框的高度，单位：‘rem’
            count: 12,        // 动画圆点或条状的个数
            mask: false,      // 是否有遮罩
            type: 'fade',      // 动画类型 dot fade rotate
            text: 'loading',  // 动画下方的文字
            time: 30000,    // 自动关闭动画的时间
            bgColor: '#fff',  // 背景颜色
            bar: false        // 只在fade模式下生效，设置条状的loading环
        }

        this.default = {
            body: doc.getElementsByTagName('body')[0],
            wrapperClassName: 'loading-wrapper',
            loadBoxClassName: 'load flex-box flex-direction bg-black-05',
            color: '#fff'
        }
        // 初始化配置项
        this.config = _copy(this.config, options, this.default)

        // init的原型继承Loading的原型；Loading原型上的方法init也可以调用；
        Loading.prototype.init.prototype = Loading.prototype

        // 为了避免在调用时new一个对象，直接返回一个实例对象
        return new Loading.prototype.init(this.config);
    }

    // 将Loading暴露到window下
    win.loading = Loading;

    // 初始化loading
    Loading.prototype.init = function (config) {
        // fade模式下判断是圆点还是条状
        var bar = config.bar ? 'bar' : 'circle'
        // 获取背景颜色
        var bgColor = config.bgColor
        if (config.mask === true) {
            config.wrapperClassName += ' bg-black-05'
            config.loadBoxClassName += ' bg-white'
            // 修改默认字体颜色
            config.color = '#445366'
            // 如果背景色是白色，就将背景色替换成红色，否则背景色使用传进来的颜色
            bgColor = config.bgColor === '#fff' ? 'red' : config.bgColor
        }
        var loadWrapper = _createEl('div', config.wrapperClassName, 'loading-wrapper')
        var load = _createEl('div', config.loadBoxClassName, 'load', {
            'width': config.width + 'rem',
            'height': config.height + 'rem'
        })
        var loading = _createEl('div', 'loading flex-1 flex-box center', 'loading')
        loading.appendChild(_createLoadEl(config.count, config.type, bgColor, bar))
        load.appendChild(loading)
        if (config.text !== '') {
            var loadText = _createEl('div', 'loading-text', '', {
                'color': config.color
            })
            loadText.innerText = config.text
            load.appendChild(loadText)
        }
        loadWrapper.appendChild(load)
        config.body.appendChild(loadWrapper)
        setTimeout(function () {
            this.close();
        }.bind(this), config.time)
    }

    // 关闭loading
    Loading.prototype.close = function () {
        var el = doc.getElementById('loading-wrapper')
        el.remove()
    }

    // 创建element
    function _createEl(tagName, className, id, style) {
        var el = doc.createElement(tagName)
        el.className = className || '';
        el.id = id || ''
        for (var key in style) {
            el.style[key] = style[key]
        }
        return el;
    }

    // 创建loading元素，返回值是一个element
    function _createLoadEl(count, type, bg_color, bar) {
        return ({
            dot: function () {
                var div = _createEl('div', 'flex-box center')
                for (var i = 0; i < count; i++) {
                    var span = _createEl('span', 'dot', '', {
                        'animation-delay': i / count * 1.2 + 's',
                        'background': bg_color
                    })
                    div.appendChild(span)
                }
                return div
            },
            rotate: function () {
                var circleWrapper = _createEl('div', 'relative-wrapper rotate', '', {
                    'width': config.width / 2 + 'rem',
                    'height': config.height / 2 + 'rem'
                })
                for (var i = 0; i < count; i++) {
                    var deg = i * 360 / count + 'deg'
                    var style = {
                        'transform': 'rotate(' + deg + ')'
                    }
                    var span = _createEl('span', 'circle', '', style)
                    circleWrapper.appendChild(span)
                }
                _addRules('circle', 'before', {'background': bg_color})
                return circleWrapper;
            },
            fade: function () {
                var circleWrapper = _createEl('div', 'relative-wrapper', '', {
                    'width': config.width / 2 + 'rem',
                    'height': config.height / 2 + 'rem'
                })
                for (var i = 0; i < count; i++) {
                    var deg = i * 360 / count + 'deg'
                    var style = {
                        'transform': 'rotate(' + deg + ')',
                        'animation': 'fade 1.6s linear ' + i * 1.6 / count + 's infinite'
                    }
                    var span = _createEl('span', bar, '', style)
                    circleWrapper.appendChild(span)
                }
                _addRules(bar, 'before', {'background': bg_color})
                return circleWrapper
            }
        }[type])()
    }

    // 浅拷贝，把其他对象复制到目标对象上
    function _copy() {
        var target = arguments[0] || {};
        if (typeof target !== 'object') {
            target = {}
        }
        var key, copy, obj;
        for (var i = 1; i < arguments.length; i++) {
            obj = arguments[i]
            if (obj !== null || obj !== undefined) {
                for (key in obj) {
                    copy = obj[key]
                    // 防止出现死循环，要复制的值正好是目标对象
                    if (target === copy) {
                        continue;
                    }
                    // 如果值存在就复制到目标对象上
                    if (copy !== undefined) {
                        target[key] = copy
                    }
                }
            }
        }
        return target
    }

    // 添加class
    function _addClass(el, className) {
        var reg = new RegExp('(\\s|^)' + className + '($|\\s)');
        var currentClassName = el.className;
        // 判断是否已经有这个class了
        if (!reg.test(currentClassName)) {
            // 元素本身class为空，直接添加
            if (currentClassName.length === 0) {
                el.className = className;
            } else {
                var newClassNames = currentClassName.split(' ')
                newClassNames.push(className)
                el.className = newClassNames.join(' ')
            }
        }
    }


    function _addRules(className, pesudo, rules) {
        var styleSheet = doc.styleSheets[0]
        if (!styleSheet) {
            styleSheet = doc.createElement('style')
            doc.head.appendChild(styleSheet)
        }
        for (var key in rules) {
            styleSheet.addRule('.' + className + ':' + pesudo, key + ':' + rules[key])
        }
    }

})(window, document)