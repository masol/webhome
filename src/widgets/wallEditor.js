/**************************************************************************
 *  This file is part of the WebHome.
 *  Published under the MIT license.
 *  Copyright (C) by SanPolo Co.Ltd.
 *
 *  See https://osc.spolo.org/ for more information.
 *  SanPolo Co.Ltd
 **************************************************************************/

/** Because we are multiple cooperate, this file can been divide to multi-file.
 * and merge through a js compiler to generate final file.
 **/

define(['lodash', 'fabric', 'furniture/wall'], function (_, fabric) {

    var WallEditor = function () {
    };

    var wallEditorState = {
        disable: 0,
        enable: 1
    };

    WallEditor.prototype = _.extend(WallEditor.prototype, {
        _state: wallEditorState.disable,
        _ctl: null,
        _events: {
            'window keyup': 'onKeyUp',
            'scene mouse:down': 'onMouseDown',
            'scene mouse:move': 'onMouseMove'
        },
        _targetWall: null,
        _eventsHandlers: {},
        setCtl: function (ctl) {
            this._ctl = ctl;
        },// call method - on + camelized eventName(like onCtlStateChange) with data
        dispatch: function (eventName) {
            var data = Array.prototype.slice.call(arguments, 1);
            var splitSymbol = ':';
            var methodName = 'on' + _.map(eventName.split(splitSymbol),function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join('');

            if (_.isFunction(this[methodName])) {
                this[methodName].apply(this, data);
            }
        },
        onCtlStateChange: function (data) {
            switch (data.state) {
                case 'wall':
                    this.enable();
                    break;
                default:
                    this.disable();
                    break;
            }
        },
        isEnable: function () {
            return this._state == wallEditorState.enable;
        },
        enable: function () {
            if (this.isEnable()) {
                return;
            }
            var _this = this;
            this._state = wallEditorState.enable;

            _.forEach(this._events, function(handler, event){
                var eventType = event.split(' ');
                var callback = _this.bind(handler);

                if (!callback) {
                    return;
                }

                switch (eventType[0]) {
                    case 'scene':
                        _this.onScene(eventType[1], callback);
                        break;
                    case 'window':
                        window.addEventListener(eventType[1], callback);
                        break;
                    default:
                        return;
                }

                if (!_this._eventsHandlers[event]) {
                    _this._eventsHandlers[event] = [];
                }
                _this._eventsHandlers[event].push(callback);
            });

        },
        disable: function () {
            if (!this.isEnable()) {
                return;
            }
            var _this = this;
            this._state = wallEditorState.disable;

            _.forEach(this._eventsHandlers, function(handlers, event){
                var eventType = event.split(' '),
                    removeEvent = null;


                for (var i=0; i< handlers.length; i++) {
                    // TODO clear this
                    switch (eventType[0]) {
                        case 'scene':
                            _this.offScene(eventType[1], handlers[i]);
                            break;
                        case 'window':
                            window.removeEventListener(eventType[1], handlers[i]);
                            break;
                        default:
                            return;
                    }

                }

                _this._eventsHandlers[event].length = 0;
            });

        },
        onScene: function (eventName, handler) {
            this._ctl._scene.on(eventName, handler)
        },
        offScene: function (eventName, options) {
            this._ctl._scene.off(eventName, options)
        },
        onMouseDown: function (o) {
            var pointer = this._ctl._scene.getPointer(o.e);

            this._targetWall = new fabric.Wall({
                left: pointer.x,
                top: pointer.y,
                fill: 'red',
                width: 1,
                height: 5
            });

            this._ctl._scene.add(this._targetWall);
            this._ctl._scene.renderAll();
        },
        onMouseMove: function (o) {
            if (!this._targetWall) {
                return;
            }
            var pointer = this._ctl._scene.getPointer(o.e);

            var left = this._targetWall.get('left');
            var top = this._targetWall.get('top');

            this._targetWall.set({
                width: pointer.x - left
            });
            this._ctl._scene.renderAll();
        },
        onKeyUp: function(e){
            switch (e.keyCode) {
                case 27: //escape
                    if (this._targetWall) {
                        this._ctl._scene.remove(this._targetWall);
                        this._targetWall = null;
                        this._ctl._scene.renderAll();
                    }
                    break;
            }
        },
        bind: function (functionName) {
            if (!_.isFunction(this[functionName])) {
                return;
            }
            var _this = this;
            return function () {
                _this[functionName].apply(_this, arguments);
            }
        }
    });

    return WallEditor;
});
