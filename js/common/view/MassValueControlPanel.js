// Copyright 2017-2018, University of Colorado Boulder

/**
 * Panel that is responsible for adjusting the value of its corresponding mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var massString = require( 'string!MASSES_AND_SPRINGS/mass' );
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );

  /**
   * @param {Mass} mass
   * @param {Node} massNodeIcon: icon that represents the mass to be adjusted
   * @constructor
   */
  function MassValueControlPanel( mass, massNodeIcon ) {

    assert && assert( mass.adjustable === true, 'MassValueControlPanel should only adjust a mass that is adjustable.' );

    // range for mass in kg
    var range = new Range( 50, 300 );

    var massInGramsProperty = new DynamicProperty( new Property( mass.massProperty ), {
      bidirectional: true,
      map: function( mass ) {
        return mass * 1000;
      },
      inverseMap: function( massInGrams ) {
        return massInGrams / 1000;
      }
    } );

    var numberControl = new NumberControl( massString, massInGramsProperty, range, {
      titleMaxWidth: 35,
      valuePattern: StringUtils.fillIn( massValueString, {
        mass: '{0}'
      } ),
      valueFont: new PhetFont( 14 ),
      majorTickLength: 10,
      titleFont: new PhetFont( { size: 14, weight: 'bold' } ),
      trackSize: new Dimension2( 125, 0.1 ),
      thumbSize: new Dimension2( 13, 24 ),
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
      stroke: null,
      sliderIndent: 7,
      majorTicks: [
        {
          value: range.min,
          label: new Text( String( range.min ), { font: new PhetFont( 14 ) } )
        },
        {
          value: range.max,
          label: new Text( String( range.max ), { font: new PhetFont( 14 ) } )
        }
      ],
      layoutFunction: NumberControl.createLayoutFunction1( {
        titleXSpacing: 65,
        ySpacing: 4,
        arrowButtonsXSpacing: 5
      } ),
      useRichText: true,
      decimalPlaces: 0,
      arrowButtonScale: 0.5,
      delta: 1
    } );

    var contentNode = new Node( { children: [ numberControl, massNodeIcon ], resize: false, preventFit: true } );

    Panel.call( this, contentNode, {
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH,
      maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 20,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      fill: 'white',
      stroke: 'gray',
      yMargin: 4,
      xMargin: 6
    } );

    massNodeIcon.left = this.bounds.left;
    massNodeIcon.top = numberControl.top - 3;
    massNodeIcon.pickable = false;
  }

  massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );
  return inherit( Panel, MassValueControlPanel );
} );
