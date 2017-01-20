// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/MassesAndSpringsModel' );
  var EnergyScreenView = require( 'MASSES_AND_SPRINGS/energy/view/EnergyScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var energyString = require( 'string!MASSES_AND_SPRINGS/energy' );

  /**
   * @constructor
   */
  function EnergyScreen() {

    var options = {
      name: energyString,
      backgroundColorProperty: new Property( Color.toColor( 'white' ) )
    };

    Screen.call( this,
      function() { return new MassesAndSpringsModel(); },
      function( model ) { return new EnergyScreenView( model ); },
      options
    );
  }

  massesAndSprings.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );