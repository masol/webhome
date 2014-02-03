/**
 * Created by krona on 1/30/14.
 */
define(['lodash', 'fabric', 'webhome/util/lang', 'webhome/furniture/wall'], function (_, fabric, lang, Wall) {
    var
        /**
         * @class WallEditor
         * @constructor
         */
            WallEditor = function(scene){
            this.init(scene);
        },
        makeExtendPoint = function (left, top, walls) {
            var c = new fabric.Circle({
                left: left - 2,
                top: top - 2,
                strokeWidth: 1,
                radius: 4,
                fill: '#fff',
                stroke: '#666'
            });
            c.hasControls = c.hasBorders = false;
            c.walls = walls;
            points.push(c);
            return c;
        },
    // ExtendPoints may be added globally for simplify editing
        points = [],
        getPoint = function (pointer) {
            var point;
            points.forEach(function (item) {
                if (Math.abs(item.top - pointer.y) < 10 && Math.abs(item.left - pointer.x) < 10) {
                    point = item;
                }
            });
            return point;
        }
    ;
    WallEditor.prototype = _.extend(WallEditor.prototype, /** @lends WallEditor.prototype */{
        _scene: undefined,
        _scope: undefined,
        _mover: undefined,
        _mouseDown: undefined,
        _current: undefined,
        init: function(scope){
            this._scope = scope;
            this._scene = scope._scene;
            this._scene.on('mouse:up', lang.hitch(this, this.onClick));
            this._scene.on('mouse:down', lang.hitch(this, this.onMouseDown));
            this._scene.on('object:moving', lang.hitch(this, this.onPointMove));
            this._scene.on('mouse:move', lang.hitch(this, this.onMouseMove));
            window.addEventListener('keyup', lang.hitch(this, this.onKeyUp));
        },
        startDraw: function(){
            if(this._scope.getState() == 'wall'){
//                this._group = [];
            }
        },
        finishDraw: function(){
            var beginPoint = getPoint({x: this._current.x1, y: this._current.y1});
            if (beginPoint.walls.length == 1) {
                beginPoint.remove();
            }
            this._current.remove();
            this._current = undefined;
            this._scene.renderAll();
        },
        onKeyUp: function(e){
            if(this._scope.getState() == 'wall'){
                if(e.keyCode == 27){ //ESC button
                    this.finishDraw();
                }
            }
        },
        onPointMove: function (e) {
            var
                target = e.target,
                position = {
                    x: target.left,
                    y: target.top
                }
                ;
            if (target.walls && target.walls.length != 0) {
                target.walls.forEach(function (wall) {
                    if (wall.position == 1) {
                        wall.wall.set({x1: position.x + 2, y1: position.y + 2});
                    } else {
                        wall.wall.set({x2: position.x + 2, y2: position.y + 2});
                    }
                });
            }
            this._scene.renderAll();
        },
        onMouseDown: function () {
            this._mouseDown = true;
        },
        onMouseMove: function(o){
            var pointer = this._scene.getPointer(o.e);
            if (this._mouseDown) {
                this._mover = true;
            }
            if(this._current){
                this._current.set({ x2: pointer.x, y2: pointer.y });
                this._scene.renderAll();
            }
        },
        onClick: function(o){
            if (this._scope.getState() == 'wall' && !this._mover) {
                this._mover = undefined;
                this._mouseDown = undefined;
                var pointer = this._scene.getPointer(o.e);
                var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
                var beginPoint = getPoint(pointer);
                if(this._current){
                    this._current.set({ x2: pointer.x, y2: pointer.y });
                    if (!beginPoint) {
                        beginPoint = makeExtendPoint(pointer.x, pointer.y, [
                            {
                                position: 2,
                                wall: this._current
                            }
                        ]);
                        this._scene.add(beginPoint);
                    } else {
                        beginPoint.walls.push({
                            position: 2,
                            wall: this._current
                        })
                    }
                } else {
                    this.startDraw();
                }
                this._current = new Wall(points, {
                    strokeWidth: 5,
                    fill: '#aaa',
                    stroke: '#aaa',
                    originX: 'center',
                    originY: 'center',
                    selectable: false
                });
                this._scene.add(this._current);
                if (!beginPoint) {
                    beginPoint = makeExtendPoint(pointer.x, pointer.y, [
                        {
                            position: 1,
                            wall: this._current
                        }
                    ]);
                    this._scene.add(beginPoint);
                } else {
                    beginPoint.walls.push({
                        position: 1,
                        wall: this._current
                    })
                }
            }
        }
    });
    return WallEditor;
});