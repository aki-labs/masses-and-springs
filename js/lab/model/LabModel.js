// Copyright 2016-2017, University of Colorado Boulder

/**
 * Energy model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * @constructor
   */
  function LabModel( tandem ) {
    MassesAndSpringsModel.call( this, tandem, { springCount: 1, showVectors: true } );

    var massXPosition = this.springs[ 0 ].positionProperty.get().x;
    // REVIEW: Where do the numbers used to position the masses below come from?
    // REVIEW: There should be a protected method on the base class for adding masses, rather than directly reaching
    // in to the array and pushing them on.
    // REVIEW: It bothers me (jbphet) that this constructor is essentially relying on the way that the superconstructor
    // adds a single mass for the single spring mode, then adds two more.  An alternative would be to be able to
    // specify one of three 'mass sets' in the options to the MassAndSpringsModel and use those instead.
    this.masses.push( this.createMass( 0.125, massXPosition - .02, true, false, 'red', null, tandem.createTandem( 'redLabeledMass' ) ) );
    this.masses.push( this.createMass( 0.150, massXPosition + .05, true, false, 'green', null, tandem.createTandem( 'greenLabeledMass' ) ) );

  }

  massesAndSprings.register( 'LabModel', LabModel );

  return inherit( MassesAndSpringsModel, LabModel );
} );