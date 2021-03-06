# Tree with little icons for making new nodes.
class EditableTree extends SVGTreeNode

  # Makes a tree that has asterisks for making new nodes.
  #
  # @param {Number} model.starLength drop distance of star
  # @param {Number} model.starRadius redius of star
  constructor: (options) ->
    model = if options.parent? then options.parent else options
    @starLength = model.starLength ? 15
    @starRadius = model.starRadius ? 5
    super options
    @makeStar()

  # Moves the node to the current correct location
  move: =>
    @animateStar()
    super()

  # @return {Number} total height including children, and newNode icons
  totalHeight: =>
    if not @isHidden
      h = super()
      if @visibleChildren().length == 0
        h += @starLength
      return h
    return 0

  # @return {Number} position of the top of the star
  getStarTop: =>
    @y + @flagpoleLength() + @marginTop + @contentHeight() + @marginBottom

  # @return {Object} current x1, y1, x2, y2 for line to star
  getStarLinePoints: =>
    top = @getStarTop()
    "#{@indent}, #{top}, #{@indent}, #{top + @starLength}"

  # Assembles the star, appends to @el. binds createChild
  makeStar: =>
    @starTop ?= @getStarTop()
    @star = @svgElement('g', {
      transform: "translate(#{@indent}, #{@starTop + @starLength})"
    })
    c =  {
      cx: 0,
      cy: 0,
      r: @starRadius,
      fill: @emptyColor,
      'stroke-width': @lineWidth,
      stroke: @treeColor
    }
    @star.appendChild @svgElement "circle", c
    cross1 = {
      x1: @starRadius - 2, y1: 0, x2: -@starRadius + 2, y2:0,
      fill:"none", "stroke-width": "#{@lineWidth}px", 'stroke': @treeColor
    }
    @star.appendChild @svgElement 'line', cross1
    cross2 = {
      x1: 0, y1: @starRadius - 2, x2: 0, y2: -@starRadius + 2,
      fill:"none", "stroke-width": "#{@lineWidth}px", 'stroke': @treeColor
    }
    @star.appendChild @svgElement 'line', cross2
    @star.addEventListener "click", @createChild
    @el.appendChild @star
    
  # Moves the starLine and star to the current correct position
  animateStar: (callback=null) =>
    if not @star?
      if @isHidden
        @starTop = @getStarTop()
        return
      @makeStar()
    newStarTop = @getStarTop()
    SVGTreeNode.animator.animation(
      @star, "transform", "translate(#{@indent} #{@starTop + @starLength})",
      "translate(#{@indent} #{newStarTop + @starLength})",
      @animateDuration, null
    )()
    @starTop = newStarTop

  # remove from DOM and parent
  remove: =>
    onhide = =>
      if @parent?
        @parent.children = @parent.children.filter (x) => x isnt this
        if (@parent.children.length == 0) and (@parent.circle?)
          @parent.circle.parentElement.removeChild @parent.circle
          @parent.circle = null
      @requestUpdate()
      @el.parentElement.removeChild @el
    @hide(onhide)

module.DOGWOOD.EditableTree = EditableTree
