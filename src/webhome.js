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

/** we using underscore.js to enable sub-module.
 * @FIXME: Shall we using more heavy library : require.js?
 */
define(['lodash', 'fabric', 'webhome/wallEditor'], function (_, fabric, WallEditor) {
    var
        fakeEvents = {
            hover: function(callback, scene){
                var hovered = false;
                scene.on('mouse:move', function(options){
                    if(options.target){
                        !hovered && callback.apply(options.target, arguments);
                        hovered = true;
                    } else {
                        hovered = false;
                    }
                });
            }
        },
        WebHome = function(CanvasID){
            this.create(CanvasID);
        }
    ;
    WebHome.prototype = _.extend(WebHome.prototype, {
        _scene: null,
        _currentState: undefined,
        _wallEditor: undefined,
        _keyBinding: function(){
            var that = this;
            window.onkeyup = function(e){
                if(e.keyCode == 46){ // remove object from canvas
                    if(that._scene){
                        that._scene.remove(that._scene.getActiveObject());
                    }
                }
            }
            return this;
        },
        _createContextMenu: function(){
            window.oncontextmenu = function(){
                return false;
            }
            var that = this;
            this._scene.upperCanvasEl.addEventListener("mousedown", function(e){
                if(e.which == 3){
                }
            }, false);
        },
        create: function(CanvasID){
            try{
                this._scene = new fabric.Canvas(CanvasID);
                this._keyBinding()._createContextMenu();
                this.setState('draw');
                this._wallEditor = new WallEditor(this);
                return this;
            }catch(e){
                alert("you need fabric.js library to use webhome");
            }
        },
        setBackground: function(imgSrc){
            if(this._scene){
                var scene = this._scene;
                this._scene.setBackgroundImage(imgSrc, function(){
                    scene.renderAll();
                });
            }
        },
        setHomeData: function(data, callback){
            callback = callback || function(){};
            this._scene.loadFromJSON(data, callback);
        },
        getActiveObject: function(){
            return this._scene.getActiveObject();
        },
        on: function(eventName, callback){
            if(fakeEvents[eventName]){
                fakeEvents[eventName](callback, this._scene);
            } else {
                this._scene.on(eventName, callback);
            }
        },
        replace: function(object, newObject){
            ['originX', 'originY', 'top', 'left', 'width', 'height', 'scaleX', 'scaleY'].forEach(function(prop){
                newObject[prop] = object[prop];
            });
            object.remove();
            this._scene.add(newObject);
        },
        setState: function(state){
            var name = '_set' + state.charAt(0).toUpperCase() + state.slice(1) + 'Mode';
            if(this[name]){
                this[name]();
            }
        },
        getState: function(){
            return this._currentState;
        },
        _setViewMode: function(){
            this._toggleStates(true);
            this._currentState = 'view';
        },
        _setEditMode: function(){
            this._toggleStates(false);
            this._currentState = 'edit';
        },
        _setWallMode: function(){
            this._toggleStates(false);
            this._currentState = 'wall';
        },
        _toggleStates: function(to){
            this._scene._objects.forEach(function(object){
                if(['furniture', 'wall'].indexOf(object.type) != -1){
                    object.selectable = !to;
                    object.lockMovementX = to;
                    object.lockMovementY = to;
                }
            });
            this._scene.renderAll();
        }
    });
    return WebHome;
});

/** @FIXME: this not tested, @Dariel, plese testing it next time.
 * This allow caller to include multiple module during the time of developing.
 * We will make a build.sh like simpoe 2 step:
 * 1. cat all module to one file.
 * 2. using google cloure to break the depence to Fabric.js and Underscore.js, emit redundant code about module.
 * 3. optional, we can provide version that depend underscore and fabric.
 */

