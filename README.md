WebHome
=======

  Welcome to webhome. WebHome is a javascript library that utilizing the power of html5 canvas to help people designing their home. It's ownered by SanPolo.Co.LTD and published under the license of MIT. WebHome internal using javascript canvas library [Fabric.js](http://fabricjs.com/).

Background
----------

 webhome is open source project supported by [SanPolo.Co.LTD](http://www.spolo.org). Official hosted at [opensource community of SanPolo Co.LTD](https://osc.spolo.org/root/webhome/tree/master).
 

about the code
--------------

1. The testing code is under the test directory. You can reading it to get a first-impression how to using webhome. WebHome provide a pure home editor widget, you can instantiate and connect with it's event.
2. The widget itself support follow concept:
  * Action : you can add,remove,replace some home item into widget.
  * State : widget will in different state. Every state support different interaction schema. (I.E Edit state or Draw state has differenct interaction schema)
  * Event : you can connect handler to event.
3. Boundary of the widget:
  * The widget itself don't care how to synchronize data with remote server. Manipulating data.io is the duty of caller instead of Webhome itself. You can check the testing code to understanding this.
  * The widget itself only manipulate the editing window. I.E ```javascript  var homewidget = webhome.Create('test'); ```.This home edit widget only generate the scene. No toolbar, tree tec... It's the duty of caller to manipulate other UI widget.
4. Data Type Definition:
  * [Home](DTD_Home)
  * [Item](DTD_Item)
  
Plan
----

1. User can download a fixed home with pre-layouted furniture. They only can replace furniture with other furniture.
2. User can layout the furniture. add,move,rotate,scale(some custom furniture need scale).
3. User can draw home style in home edit widget. and use the result act as a portion to edti.

This three step is very easy, because most of the function implmented in Fabric.js

4. Support the wall editor. This mean, we need another widget to gather user input when user click some specific 'furniture'(wall, for example). The wall editor widget is just like home editor widget.
5. Support special furniture layer editor. for instance, user click table, a new widget showed, let user edit which decorator will placed on table.

This two step is easy too. just need more widget,it's same with home edit widget.

6. Refine the layout, support auto-layout. We need add type information to object. and import one physic library(such as WebBox2d) to caculate the relation of furniture, then make the decision place where.
7. The exported data can generate some 3d scene(generate in server side because we need model data) and show/or edit in web3d editor widget. (This may cause another project).

8. More for the futher requirement.





