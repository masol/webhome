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
    // ExtendPoints may be added globally for simplify editing
        points = [],
        walls = [],
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
        getDirection = function (wall) {
            if (wall.x1 < wall.x2 && wall.y1 < wall.y2) {
                return 'top-right';
            } else if (wall.x1 > wall.x2 && wall.y1 < wall.y2) {
                return 'bottom-right';
            } else if (wall.x1 > wall.x2 && wall.y1 > wall.y2) {
                return 'bottom-left';
            } else {
                return 'top-left';
            }
        },
        makeWall = function (pointer, scene) {
            var
                points = [ pointer.x, pointer.y, pointer.x, pointer.y ],
                wall = new Wall(points, {
                    id: walls.length + 1,
                    strokeWidth: 5,
                    fill: '#aaa',
                    stroke: '#aaa',
                    originX: 'center',
                    originY: 'center',
                    selectable: false
                })
                ;
            scene.add(wall);
            var
                beginPoint = makeExtendPoint(wall.x1, wall.y1, [
                    {position: 1, wall: wall}
                ]),
                endPoint = makeExtendPoint(wall.x2, wall.y2, [
                    {position: 2, wall: wall}
                ])
                ;
            endPoint.strokeWidth = beginPoint.strokeWidth = 4;
            beginPoint.hidden = endPoint.hidden = true;
            wall.hasControls = false;
            wall.onMove = function () {
                var
                    halfs = {
                        left: wall.width / 2,
                        top: wall.height / 2
                    },
                    point = {
                        x1: undefined,
                        x2: undefined,
                        y1: undefined,
                        y2: undefined
                    }
                    ;
                // We check direction of Wall for correct points position
                switch (getDirection(wall)) {
                    case 'top-right':
                        point = {
                            x1: wall.left - halfs.left,
                            x2: wall.left + halfs.left,
                            y1: wall.top - halfs.top,
                            y2: wall.top + halfs.top
                        };
                        break;
                    case 'bottom-right':
                        point = {
                            x1: wall.left + halfs.left,
                            x2: wall.left - halfs.left,
                            y1: wall.top - halfs.top,
                            y2: wall.top + halfs.top
                        };
                        break;
                    case 'bottom-left':
                        point = {
                            x1: wall.left + halfs.left,
                            x2: wall.left - halfs.left,
                            y1: wall.top + halfs.top,
                            y2: wall.top - halfs.top
                        };
                        break;
                    case 'top-left':
                        point = {
                            x1: wall.left - halfs.left,
                            x2: wall.left + halfs.left,
                            y1: wall.top + halfs.top,
                            y2: wall.top - halfs.top
                        };
                        break;
                }
                wall.set({x1: point.x1, x2: point.x2, y1: point.y1, y2: point.y2});
                wall.beginPoint.set({left: point.x1, top: point.y1});
                wall.endPoint.set({left: point.x2, top: point.y2});
                wall.setCoords() && wall.beginPoint.setCoords() && wall.endPoint.setCoords();
            };
            wall.showPoints = function () {
                beginPoint.visible = endPoint.visible = true;
                wall.selectable = true;
            };
            wall.hidePoints = function () {
                beginPoint.visible = endPoint.visible = false;
                wall.selectable = false;
            };
            wall.hidePoints();
            scene.add(beginPoint);
            scene.add(endPoint);

            wall.beginPoint = beginPoint;
            wall.endPoint = endPoint;
            walls.push(wall);

            return wall;
        },
        makeWallPoint = function (pointer, scene, wall, position) {
            var beginPoint = getPoint(pointer);
            if (!beginPoint) {
                beginPoint = makeExtendPoint(pointer.x, pointer.y, [
                    {
                        position: position,
                        wall: wall
                    }
                ]);
                scene.add(beginPoint);
            } else {
                beginPoint.walls.push({
                    position: position,
                    wall: wall
                })
            }
            if (!Array.isArray(wall.points)) {
                wall.points = [];
            }
            wall.points.push(beginPoint);
        },

        getPoint = function (pointer) {
            var point;
            points.forEach(function (item) {
                if (!item.hidden && Math.abs(item.top - pointer.y) < 10 && Math.abs(item.left - pointer.x) < 10) {
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
            this._scene.on('selection:created', lang.hitch(this, this.onSelection));
            this._scene.on('selection:cleared', lang.hitch(this, this.onSelectionCleared));
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
        onSelection: function (o) {
            o.target.hasControls = false;
        },
        onSelectionCleared: function (o) {
            if (this.activeObject && this.activeObject.hidePoints) {
                this.activeObject.hidePoints();
                this.activeObject.setCoords();
                this.checkPoints();
                this.activeObject = undefined;
                this._scene.renderAll();
            }
        },
        onKeyUp: function(e){
            if(this._scope.getState() == 'wall'){
                if(e.keyCode == 27){ //ESC button
                    this.finishDraw();
                }
            }
        },
        onPointMove: function (e) {
            if (e.target.onMove) {
                e.target.setCoords();
                e.target.onMove();
//                this.activeObject && this.activeObject.setCoords();
//                this.activeObject && this.checkPoints();
                this._scene.renderAll();
                return;
            }
            var
                targets = [],
                basePosition = {
                    x: 0,
                    y: 0
                }
                ;
            if (e.target.type && !e.target.objects) {
                targets.push(e.target);
            } else {
                targets = e.target.objects;
                basePosition = {
                    x: e.target.left,
                    y: e.target.top
                };
            }
            targets.forEach(function (target) {
                var
                    position = {
                        x: basePosition.x + target.left,
                        y: basePosition.y + target.top
                    }
                    ;
                if (target.walls && target.walls.length != 0) {
                    target.walls.forEach(function (wall) {
                        if (wall.position == 1) {
                            wall.wall.set({x1: position.x + 2, y1: position.y + 2});
                        } else {
                            wall.wall.set({x2: position.x + 2, y2: position.y + 2});
                        }
                        wall.wall.onMove();
                    });
                }
            }, this);
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
                this._current.setCoords();
                this._scene.renderAll();
            }
        },
        onClick: function(o){
            if (this._scope.getState() == 'wall' && !this._mover) {
                var pointer = this._scene.getPointer(o.e);
                if(this._current){
                    this._current.set({ x2: pointer.x, y2: pointer.y });
                    this._current.setCoords();
                    makeWallPoint(pointer, this._scene, this._current, 2);
                } else {
                    this.startDraw();
                }
                this._current = makeWall(pointer, this._scene);
                makeWallPoint(pointer, this._scene, this._current, 1);
            } else if (o.target && o.target.type == 'wall') {
                if (o.target.showPoints) {
                    this.activeObject = o.target;
                    o.target.showPoints();
                }
            }
            this._mover = false;
            this._mouseDown = false;
            this._scene.renderAll();
        },
        checkPoints: function () {
            var
                wall = this.activeObject
                ;
            console.log(wall.id);
            _.remove(wall.points, function (point) {
                point.setCoords();
                _.remove(point.walls, function (value) {
                    return value.wall.id === wall.id;
                });
                if (point.walls.length == 0) {
                    point.remove();
                }
                return true;
            });
            makeWallPoint({x: wall.beginPoint.left, y: wall.beginPoint.top}, this._scene, wall, 1);
            makeWallPoint({x: wall.endPoint.left, y: wall.endPoint.top}, this._scene, wall, 2);
        }
    });
    return WallEditor;
});