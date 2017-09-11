// Copyright 2016-2017, University of Colorado Boulder

/**
 * Node for the gravity control panel and combo box for planet gravity options.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var frictionString = require( 'string!MASSES_AND_SPRINGS/friction' );
  var gravityLotsString = require( 'string!MASSES_AND_SPRINGS/gravity.lots' );
  var gravityNoneString = require( 'string!MASSES_AND_SPRINGS/gravity.none' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );

  // phet-io modules
  var TText = require( 'SCENERY/nodes/TText' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   * @constructor
   */
  function GravityAndFrictionControlPanel( model, listNodeParent, tandem, options ) {
    var self = this;
    this.options = _.extend( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      xMargin: 13,
      yMargin: 10,
      align: 'left',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      frictionVisible: false
    }, options );

    //  Add gravity info for various planets
    var bodyListItems = [];
    this.bodies = MassesAndSpringsModel.BODIES;
    MassesAndSpringsModel.BODIES.forEach( function( body ) {
      var bodyLabel = new Text( body.title, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        tandem: tandem.createTandem( 'bodyLabel' ),
        phetioValueType: TText
      } );
      bodyLabel.localBounds = bodyLabel.localBounds.withMaxX( Math.max( 50, bodyLabel.localBounds.maxX ) );

      bodyListItems.push( {
        node: bodyLabel,
        value: body
      } );
    } );

    // @public
    this.gravityProperty = model.gravityProperty;

    // @public
    this.bodyProperty = model.bodyProperty;
    var previousBody = Body.EARTH;

    // @private {read-only} manages the items associated with the gravity panel in a combo box
    var gravityComboBox = new ComboBox( bodyListItems, model.bodyProperty, listNodeParent, {
      listPosition: 'below',
      buttonCornerRadius: 5,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 0,
      tandem: tandem.createTandem( 'gravityComboBox' )
    } );

    // @private {read-only} manages the values associated with the gravity panel in a combo box
    var gravityHSlider = new HSlider( model.gravityProperty, MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get(), {
      majorTickLength: 10,
      trackSize: new Dimension2( 130, 2 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbFillEnabled: '#00b3b3',
      thumbFillHighlighted: '#00e6e6',
      tandem: tandem.createTandem( 'gravityPropertyHSlider' )
    } );
    gravityHSlider.addMajorTick( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get().min, new Text( gravityNoneString, {
      font: MassesAndSpringsConstants.LABEL_FONT,
      tandem: tandem.createTandem( 'gravityNoneString' )
    } ) );
    gravityHSlider.addMajorTick( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get().max, new Text( gravityLotsString, {
      font: MassesAndSpringsConstants.LABEL_FONT,
      tandem: tandem.createTandem( 'gravityLotsString' )
    } ) );

    if ( this.options.frictionVisible ) {
      self.frictionHSlider = new HSlider( model.frictionProperty, MassesAndSpringsConstants.FRICTION_RANGE_PROPERTY.get(), {
        majorTickLength: 10,
        trackSize: new Dimension2( 130, 2 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbFillEnabled: '#00b3b3',
        thumbFillHighlighted: '#00e6e6',
        tandem: tandem.createTandem( 'gravityPropertyHSlider' )
      } );

      Panel.call( self, new VBox( {
        align: 'left',
        children: [
          new Text( gravityString, { font: MassesAndSpringsConstants.TITLE_FONT } ),
          gravityComboBox,
          gravityHSlider,
          new Text( frictionString, { font: MassesAndSpringsConstants.TITLE_FONT } ),
          self.frictionHSlider
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } ), self.options );
    }
    else {
      Panel.call( self, new VBox( {
        align: 'left',
        children: [
          new Text( gravityString, { font: MassesAndSpringsConstants.TITLE_FONT } ),
          gravityComboBox,
          gravityHSlider
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } ), self.options );
    }

    model.bodyProperty.link( function( newBody, previousGravity ) {
      var body = _.find( self.bodies, newBody );

      // Unhide the gravityHSlider if we are not using planetX
      if ( newBody !== Body.PLANET_X ) {
        gravityHSlider.visible = true;
      }

      // If PlanetX hide the slider and update gravity
      if ( newBody === Body.PLANET_X ) {
        gravityHSlider.visible = false;
        self.gravityProperty.set( body.gravity );
      }

      //  If we switched from PlanetX to Custom, display the last known non-planetX gravity.
      else if ( previousBody === Body.PLANET_X && newBody === Body.CUSTOM ) {
        self.gravityProperty.set( previousGravity );
      }

      // Update gravity
      else if ( body.gravity || body === Body.ZERO_G ) {
        self.gravityProperty.set( body.gravity );
      }

      // Store previous state so we can revert after leaving Planet X.
      previousBody = newBody;
    } );

    this.gravityProperty.link( function( newGravity ) {

      // If the user manually changed the gravity then change the body to CUSTOM.
      var selectedBody = model.bodyProperty.get();
      if ( selectedBody !== Body.CUSTOM && selectedBody.gravity !== newGravity ) {

        //  Since the current gravity didn't match any existing bodies, the user must have set gravity manually.
        model.bodyProperty.set( Body.CUSTOM );
      }
    } );
    this.mutate( this.options );
  }

  massesAndSprings.register( 'GravityAndFrictionControlPanel', GravityAndFrictionControlPanel );

  return inherit( Panel, GravityAndFrictionControlPanel );
} );
