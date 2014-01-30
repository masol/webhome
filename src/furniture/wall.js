/**
 * Created by krona on 1/28/14.
 */
define(['fabric'], function(fabric){
    fabric.Wall = fabric.util.createClass(fabric.Line, {
        type: "wall",
        angleRect: 5
    });

    return fabric.Wall;
});