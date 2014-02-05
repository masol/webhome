/**
 * Created by alkuk on 04.02.14.
 */


define(['lodash', 'fabric'], function (_, fabric) {

    fabric.Wall = fabric.util.createClass(fabric.Rect, {
        type: "wall"
    });

    return fabric.Wall;
});