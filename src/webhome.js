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

define(['lodash', 'fabric'], function (_, fabric) {

    var webhome = {
        _scene: null,
        _currentState: "edit",
        _widgets: {},
        _keyBinding: function () {
            var that = this;
            window.onkeyup = function (e) {
                if (e.keyCode == 46) { // remove object from canvas
                    if (that._scene) {
                        that._scene.remove(that._scene.getActiveObject());
                    }
                }
            }
            return this;
        },
        _createContextMenu: function () {
            window.oncontextmenu = function () {
                return false;
            }
            var that = this;
            this._scene.upperCanvasEl.addEventListener("mousedown", function (e) {
                if (e.which == 3) {
                }
            }, false);
        },
        create: function (CanvasID) {
            try {
                this._scene = new fabric.Canvas(CanvasID);
                this._keyBinding()._createContextMenu();
                return this;
            } catch (e) {
                alert("you need fabric.js library to use webhome");
            }
        },
        setBackground: function (imgSrc) {
            if (this._scene) {
                var scene = this._scene;
                this._scene.setBackgroundImage(imgSrc, function () {
                    scene.renderAll();
                });
            }
        },
        setState: function (state) {
            this.resetState();
            this._currentState = state;

            switch (state) {
                case "draw":
                    this._scene.isDrawingMode = true;
                    this._scene.freeDrawingBrush.width = 10;
                    break;
                case "edit":
                    this._scene.selection = true;
                    break;
            }

            this.trigger('ctl:state:change', {state: state});

        },
        getState: function () {
            return this._currentState;
        },
        resetState: function(){
            this._currentState = null;
            this._scene.isDrawingMode = false;
            this._scene.selection = false;
        },
        addWidget: function(name, widget){
            this._widgets[name] = widget;
            this._widgets[name].setCtl(this);
        },
        removeWidget: function(name){
            if (this._widgets[name]) {
                delete this._widgets[name];
            }
        },
        trigger: function(eventName, data){
            _(this._widgets).forEach(function(widget) {
                if(_.isFunction(widget['dispatch'])) {
                    //TODO pass into dispatch clone of the data
                    widget.dispatch(eventName, data);
                }
            });
        }
    };


    return webhome;
});