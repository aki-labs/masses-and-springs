// Copyright 2017-2018, University of Colorado Boulder

/**
 * Spring view used for the energy screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndDampingControlNode = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var OneSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringScreenView' );

  /**
   * @param {EnergyModel} model
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyScreenView( model, tandem ) {

    // Calls common spring view
    OneSpringScreenView.call( this, model, tandem );
    var self = this;

    // Gravity Control Panel
    var gravityAndDampingControlNode = new GravityAndDampingControlNode(
      model, this, tandem.createTandem( 'gravityAndDampingControlNode' ),
      {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        dampingVisible: true,
        hSlider: true
      }
    );

    //REVIEW: This is duplicated with the LabScreenView.
    var indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, false, tandem );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        gravityAndDampingControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    //REVIEW: Energy/Intro/Lab all create optionsPanels with fairly duplicated code. Support for this should be moved
    //REVIEW: to SpringScreenView, and the optionsPanel should be layered correctly so that no moveToBack() is needed.
    //REVIEW: Let me know if I can help with this.
    var optionsPanel = new Panel(
      optionsVBox,
      {
        xMargin: 10,
        fill: MassesAndSpringsConstants.PANEL_FILL,
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'LineVisibilityNode' ),
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
      } );

    this.addChild( optionsPanel );
    optionsPanel.moveToBack();

    this.visibleBoundsProperty.link( function(  ) {
      optionsPanel.top = self.energyGraphNode.top;
      optionsPanel.right = self.panelRightSpacing;
      self.toolboxPanel.top = optionsPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING;
      self.toolboxPanel.right = self.panelRightSpacing;
    } );
  }

  massesAndSprings.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( OneSpringScreenView, EnergyScreenView );
} );