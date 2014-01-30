/**
 * Created by krona on 1/30/14.
 */
define(['lodash', 'fabric', 'furniture/wall'], function(_, fabric, Wall){
    var
        hitch = function(scope, callback){
            return function(){
                return callback.apply(scope, arguments);
            }
        },
        WallEditor = function(scene){
            this.init(scene);
        }
    ;
    WallEditor.prototype = _.extend(WallEditor.prototype, {
        _scene: undefined,
        _scope: undefined,
        _group: undefined,
        _current: undefined,
        init: function(scope){
            this._scope = scope;
            this._scene = scope._scene;
            this._scene.on('mouse:up', hitch(this, this.onClick));
            this._scene.on('mouse:move', hitch(this, this.onMouseMove));
            window.addEventListener('keyup', hitch(this, this.onKeyUp));
        },
        startDraw: function(){
            if(this._scope.getState() == 'wall'){
                this._group = [];
            }
        },
        finishDraw: function(){
            this._current.remove();
            this._current = undefined;
            var group = [];
            this._group.forEach(function(item){
                group.push(item.clone());
                item.remove();
            });
            this._group = undefined;
            group = new fabric.Group(group, {
                selectable: true
            });
            this._scene.add(group);
            this._scene.renderAll();
        },
        onKeyUp: function(e){
            if(this._scope.getState() == 'wall'){
                if(e.keyCode == 27){ //ESC button
                    this.finishDraw();
                }
            }
        },
        onMouseMove: function(o){
            var pointer = this._scene.getPointer(o.e);
            if(this._current){
                this._current.set({ x2: pointer.x, y2: pointer.y });
                this._scene.renderAll();
            }
        },
        onClick: function(o){
            if(this._scope.getState() == 'wall'){
                var pointer = this._scene.getPointer(o.e);
                var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
                if(this._current){
                    this._current.set({ x2: pointer.x, y2: pointer.y });
                } else {
                    this.startDraw();
                }
                this._current = new Wall(points, {
                    strokeWidth: 5,
                    fill: '#aaa',
                    stroke: '#aaa',
                    originX: 'center',
                    originY: 'center'
                });
                this._scene.add(this._current);
            }
        }
    });
    return WallEditor;
});