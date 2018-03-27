// Copyright 2017-2018, University of Colorado Boulder

/**
 * Responsible for the creation of the arrowNodes associated with the masses and visibility panels.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  /**
   * @param {Color} color
   * @constructor
   */
  function VectorArrow( color ) {
    ArrowNode.call( this, 10, 0, 34, 0, {
      fill: color,
      stroke: 'black',
      centerY: 0,
      tailWidth: 8,
      headWidth: 14
    } );
  }

  massesAndSprings.register( 'VectorArrow', VectorArrow );
  return inherit( ArrowNode, VectorArrow );
} );
