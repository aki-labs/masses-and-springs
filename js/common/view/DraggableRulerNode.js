// Copyright 2017-2020, University of Colorado Boulder

/**
 * Responsible for the attributes and drag handlers associated with the ruler node.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Matt Pennington (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import massesAndSpringsStrings from '../../massesAndSpringsStrings.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

const cmString = massesAndSpringsStrings.cm;

/**
 * @param {ModelViewTransform2} mvt
 * @param {Bounds2} dragBounds
 * @param {Vector2} initialPosition
 * @param {Property.<boolean>} visibleProperty
 * @param {function} endDragCallback
 * @param {Tandem} tandem
 *
 * @constructor
 */
function DraggableRulerNode( mvt, dragBounds, initialPosition, visibleProperty, endDragCallback, tandem ) {
  const self = this;

  // @public {Panel|null} (read-write) Used for returning ruler to toolbox. Set this if needed to be returned.
  this.toolbox = null;

  // @public {Property.<Boolean>} Flag used to determine if the user has dragged the ruler from its starting position.
  this.draggedProperty = new BooleanProperty( false );

  // define ruler params view units
  const rulerLength = mvt.modelToViewDeltaY( -1 ); // 1 meter
  const rulerWidth = 0.125 * rulerLength;
  const majorTickLabels = [ '' ];
  for ( let i = 1; i < 10; i++ ) {
    majorTickLabels.push( '' );
    majorTickLabels.push( '' + i * 10 );
    assert && assert( majorTickLabels[ i * 2 ] === '' + Math.floor( i * 10 ) );
  }
  majorTickLabels.push( '' );
  majorTickLabels.push( '' );
  const majorTickWidth = rulerLength / ( majorTickLabels.length - 1 );

  RulerNode.call( this, rulerLength, rulerWidth, majorTickWidth, majorTickLabels, cmString, {
    insetsWidth: 0,
    minorTicksPerMajorTick: 4,
    unitsMajorTickIndex: 19,
    rotation: Math.PI / 2,
    backgroundFill: 'rgb( 237, 225, 121 )',
    cursor: 'pointer',
    majorTickFont: MassesAndSpringsConstants.LABEL_FONT,
    majorTickHeight: 10,
    minorTickHeight: 5,
    unitsFont: MassesAndSpringsConstants.LABEL_FONT,
    opacity: 0.8,
    tickMarksOnBottom: false
  }, { tandem: tandem.createTandem( 'ruler' ) } );

  // @private (read-only) - position of ruler node in screen coordinates
  this.positionProperty = new Vector2Property( initialPosition, {
    tandem: tandem.createTandem( 'positionProperty' )
  } );
  this.positionProperty.linkAttribute( this, 'translation' );

  // @private {MovableDragHandler} (read-only) handles ruler node drag events
  this.rulerNodeMovableDragHandler = new MovableDragHandler( this.positionProperty, {
    tandem: tandem.createTandem( 'dragHandler' ),
    dragBounds: dragBounds,
    startDrag: function() {
      self.draggedProperty.set( true );
      self.moveToFront();
    },
    endDrag: function() {
      endDragCallback();
    }
  } );
  this.addInputListener( this.rulerNodeMovableDragHandler );
  visibleProperty.linkAttribute( self, 'visible' );
}

massesAndSprings.register( 'DraggableRulerNode', DraggableRulerNode );

export default inherit( RulerNode, DraggableRulerNode, {

  /**
   * @public
   */
  reset: function() {
    this.positionProperty.reset();
  }
} );