/**
 * Created by krona on 1/28/14.
 */
define(['fabric', 'lodash'], function (fabric, _) {
    fabric.Wall = fabric.util.createClass(fabric.Line, {
        type: "wall",
        getDirection: function () {
            if (this.x1 < this.x2 && this.y1 < this.y2) {
                return 'top-right';
            } else if (this.x1 > this.x2 && this.y1 < this.y2) {
                return 'bottom-right';
            } else if (this.x1 > this.x2 && this.y1 > this.y2) {
                return 'bottom-left';
            } else {
                return 'top-left';
            }
        },
        showPoints: function () {
            this.beginPoint.visible = this.endPoint.visible = true;
            this.selectable = true;
        },
        hidePoints: function () {
            this.beginPoint.visible = this.endPoint.visible = false;
            this.selectable = false;
        },
        destroy: function () {
            this.destroyPoints();
            this.remove();
        },
        destroyPoints: function () {
            var that = this;
            _.remove(this.points, function (point) {
                point.setCoords();
                _.remove(point.walls, function (value) {
                    return value.wall.id === that.id;
                });
                if (point.walls.length == 0) {
                    point.remove();
                }
                return true;
            });
        },
        onMove: function () {
            var
                halfs = {
                    left: this.width / 2,
                    top: this.height / 2
                },
                point = {
                    x1: undefined,
                    x2: undefined,
                    y1: undefined,
                    y2: undefined
                }
                ;
            // We check direction of Wall for correct points position
            switch (this.getDirection()) {
                case 'top-right':
                    point = {
                        x1: this.left - halfs.left,
                        x2: this.left + halfs.left,
                        y1: this.top - halfs.top,
                        y2: this.top + halfs.top
                    };
                    break;
                case 'bottom-right':
                    point = {
                        x1: this.left + halfs.left,
                        x2: this.left - halfs.left,
                        y1: this.top - halfs.top,
                        y2: this.top + halfs.top
                    };
                    break;
                case 'bottom-left':
                    point = {
                        x1: this.left + halfs.left,
                        x2: this.left - halfs.left,
                        y1: this.top + halfs.top,
                        y2: this.top - halfs.top
                    };
                    break;
                case 'top-left':
                    point = {
                        x1: this.left - halfs.left,
                        x2: this.left + halfs.left,
                        y1: this.top + halfs.top,
                        y2: this.top - halfs.top
                    };
                    break;
            }
            this.set({x1: point.x1, x2: point.x2, y1: point.y1, y2: point.y2});
            this.beginPoint.set({left: point.x1, top: point.y1});
            this.endPoint.set({left: point.x2, top: point.y2});
            this.setCoords() && this.beginPoint.setCoords() && this.endPoint.setCoords();
        }
    });

    return fabric.Wall;
});