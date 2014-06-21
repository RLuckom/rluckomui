ambiGUI
---------

I was looking for a SVG tree UI for [another
project](https://rluckom.github.io/lasertutor), but I couldn't find any that
were exactly what I wanted. I'd already added jQuery, Handlebars, Backbone, and
THREE.js on that project, and I was coming down with a serious case of
Dependency Fatigue. So I decided to make one for myself. AmbiGUI is a parent
project to contain purpose-built, no-dependency composable UI elements. 

There's a [demo](https://rluckom.github.io/ambigui#DOGWOOD) but I'm definitely 
not finished yet. Upcoming improvements, in vague order of priority:

 * Support touch navigation, not just mouse
 * Decide on and support a way of scrolling the window onto the tree.
   * I really like the mini-doc-view in SublimeText, maybe something like that.
 * Add a convenient interface for binding callbacks and data to nodes.
   * Note this extends Backbone.View, so the Backbone Event framework is a
     likely choice.
 * Support keyboard nav.
