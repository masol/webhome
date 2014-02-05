WebHome
=======

  Welcome to webhome. WebHome is a javascript library that utilizing the power of html5 canvas to help people designing their home. It's ownered by SanPolo.Co.LTD and published under the license of MIT. WebHome internal using javascript canvas library [Fabric.js](http://fabricjs.com/).

Background
----------

 Webhome is open source project supported by [SanPolo.Co.LTD](http://www.spolo.org). Official hosted at [Github](https://github.com/masol/webhome). 
 Before you begin, please read the [Detail Background](../../wiki/Background) carefully.
 

about the code
--------------

1. The testing code is under the test directory. You can reading it to get a first-impression how to using webhome. WebHome provide a pure home editor widget, you can instantiate and connect with it's event.
2. The widget itself support follow concept:
  * Action : you can add,remove,replace some home item into widget.
  * State : widget will in different state. Every state support different interaction schema. (I.E Edit state or Draw state has differenct interaction schema)
  * Event : you can connect handler to event.
3. Boundary of the widget:
  * The widget itself don't care how to synchronize data with remote server. Manipulating data.io is the duty of caller instead of Webhome itself. You can check the testing code to understanding this. This mean: _Webhome only deal pure javascript object. Because the persistent layer is out of boundary. So, you can add property as your wish. And write some faked data in HTML is enough. How to generate these data dynamically is the duty of another project and the user of webhome library._
  * The widget itself only manipulate the editing window. I.E ```javascript  var homewidget = webhome.Create('test'); ```.This home edit widget only generate the scene. No toolbar, tree tec... It's the duty of caller to manipulate other UI widget. This mean : _We only need main window.do not need toolbar(toolbar is out of boundary), some crude button in testing file is enough._
  * Webhome will delegate all other used UI widget to caller. At least, caller can change sub-ui that webhome widget used. This design is more flexible. 
4. Data Type Definition:
  * [Home](home.dtd.md)
  * [Item](item.dtd.md)
  
Plan
----

1. User can download a fixed home with pre-layouted furniture. They only can replace furniture with other furniture.
2. User can layout the furniture. add,move,rotate,scale(some custom furniture need scale).
3. User can draw home style in home edit widget. and use the result as a portion of home to edit.

This three step is very easy, because most of the function implmented in Fabric.js

4. Support the wall editor. This mean, we need another widget to gather user input when user click some specific 'furniture'(wall, for example). The wall editor widget is just like home editor widget.
5. Support special furniture layer editor. for instance, user click table, a new widget showed, let user edit which decorator will placed on table.

This two step is easy too. just need more widget,it's same with home edit widget.

6. Refine the layout, support auto-layout. We need add type information to object. and import one physic library(such as WebBox2d) to caculate the relation of furniture, then make the decision place where.
7. The exported data can generate some 3d scene(generate in server side because we need model data) and show/or edit in web3d editor widget. (This may cause another project).

8. More for the futher requirement.


Simlar Projects
-----------------
* [Sweet home](http://www.sweethome3d.com/)
* [Planner 5D](https://planner5d.com/)
* [Autodesk homestyler](http://www.homestyler.com/)
* [Live Interior 3D Pro](http://www.belightsoft.com/products/liveinterior/overview.php)
* [LoveMyHome Designer](http://www.lovemyhome.net/)
* [Floorplanner](http://www.floorplanner.com/)
* [MagicPlan](http://www.sensopia.com/english/index.html) : This is iphone app and has amazing convenient manner to generate house style.
 
Feature of webhome
------------------
* Web-based. Can run on every browser that support HTML5 Canvas.
* Open source under MIT.
* Easy to use.
* Used for end-user. Mainly using 2D to represent the design.


Cooperation
-----------

Because we are in a multi-peopel cooperate. So, please keep in mind to recude the confliction.
* Webhome is developed under the mode of common open source. Before you enter one direction, please read the plan wiki of colleagues.
* Plese maintain an personal plan in wiki.This personal plan list what you want to do next and what is your concerns.
* You are better to commit frequently or create an new branch for your self and merge at last.
* We using a simple module mechanism to enable seperate module file. please refer to [the code](src/webhome.js#L29).

What do i do next?

We adopt [XP](http://en.wikipedia.org/wiki/Extreme_programming) methodology. So you can do with the follow job after join.

* If you think some code can refine, provide a diff file or make a branch and request merge after modified.
* You can do one sub-component that not progress at now.
* We think, function implementation first at project. The data structure will be clear with the progress of function implementation. If you need some data, just add it and modify the Data Type Definition listed precede. After the function been implemented. We can refine it.

Sub-Compoent
------------

The Sub-Component is changing with the progress of our project. Any suggestion, please open an question issue.

* [Wall Widget](../../wiki/Wall-editor) contribute by [ikantam](https://github.com/ikantam).
* [Replace Widget](../../wiki/Replace-editor) : home widget that support furniture replace.
* [Layout widget](../../wiki/Replace-editor) : home widget that support furniture layout.
* [Table layout](../../wiki/Replace-editor) : home widget that support desktop items layout.
* [House Style Drawer](../../wiki/Replace-editor) : home widget that enable user to draw their house style.
