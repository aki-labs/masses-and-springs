// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var BodyIO = require( 'MASSES_AND_SPRINGS/common/model/BodyIO' );
  var SimSpeedChoice = require( 'MASSES_AND_SPRINGS/common/enum/SimSpeedChoice' );
  var ForcesModeChoice = require( 'MASSES_AND_SPRINGS/common/enum/ForcesModeChoice' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsQueryParameters = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsQueryParameters' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Range = require( 'DOT/Range' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

  // constants
  var GRABBING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be connected
  var RELEASE_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be released
  var UPPER_CONSTRAINT = new LinearFunction( 20, 60, 1.353, 1.265 ); // Limits how much we can prime the spring.

  /**
   * @constructor
   *
   * @param {Tandem} tandem
   */
  function MassesAndSpringsModel( tandem ) {

    var self = this;

    // @public {Property.<boolean>} determines whether the sim is in a play/pause state
    this.playingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'playingProperty' )
    } );

    // @public {Property.<number>} coefficient of damping applied to the system
    this.dampingProperty = new NumberProperty( 0, {
      units: 'newtons',
      tandem: tandem.createTandem( 'dampingProperty' )
    } );

    // @public {Property.<number>} gravitational acceleration associated with each planet
    //REVIEW: If Body.CUSTOM has null gravity, how does this not get null, or is that case handled? doc?
    this.gravityProperty = new NumberProperty( MassesAndSpringsConstants.EARTH_GRAVITY, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      units: 'meters/second/second',
      range: new Range( 0, 30 )
    } );

    // @public {Property.<string>} determines the speed at which the sim plays.
    this.simSpeedProperty = new Property( SimSpeedChoice.NORMAL, {
      tandem: tandem.createTandem( 'simSpeedProperty' ),
      phetioType: PropertyIO( StringIO ),
      validValues: [ SimSpeedChoice.SLOW, SimSpeedChoice.NORMAL ]
    } );

    // @public {Property.<boolean>} determines visibility of ruler node
    this.rulerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rulerVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of timer node
    this.timerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerVisibleProperty' )
    } );

    // @public {Property.<number>} elapsed time shown in the timer (rounded off to the nearest second)
    this.timerSecondsProperty = new NumberProperty( 0, {
      range: new Range( 0, Number.POSITIVE_INFINITY ),
      tandem: tandem.createTandem( 'timerSecondsProperty' ),
      units: 'seconds'
    } );

    // @public {Property.<boolean>} determines whether timer is active or not
    this.timerRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerRunningPropertyProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of movable line node
    this.movableLineVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'movableLineVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of equilibrium line node
    this.equilibriumPositionVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'equilibriumPositionVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of natural length line node. Note this is also used for the
    // displacementArrowNode's visibility because they should both be visible at the same time.
    this.naturalLengthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'naturalLengthVisibleProperty' )
    } );

    // @public {Property.<string>} body of planet selected
    this.bodyProperty = new Property( Body.EARTH, {
      tandem: tandem.createTandem( 'bodyProperty' ),
      phetioType: PropertyIO( BodyIO )
    } );

    // Visibility Properties of vectors associated with each mass
    // @public {Property.<boolean>} determines the visibility of the velocity vector
    this.velocityVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'velocityVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the acceleration vector
    this.accelerationVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'accelerationVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the gravitational force vector
    this.gravityVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'gravityVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the spring force vector
    this.springVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'springVectorVisibilityProperty' )
    } );

    // @public {Property.<string>} determines mode of the vectors to be viewed
    this.forcesModeProperty = new Property( ForcesModeChoice.FORCES, {
      tandem: tandem.createTandem( 'forcesModeProperty' ),
      phetioType: PropertyIO( StringIO ),
      validValues: [ ForcesModeChoice.FORCES, ForcesModeChoice.NET_FORCES ]
    } );

    // @public {Spring[]} Array that will contain all of the springs.
    this.springs = [];

    // @public {Mass[]} Array that will contain all of the masses.
    this.masses = [];

    // Used for testing purposes
    if ( MassesAndSpringsQueryParameters.printSpringProperties ) {
      Property.multilink( [ self.springs[ 0 ].springConstantProperty, self.springs[ 0 ].thicknessProperty ], function( springConstant, springThickness ) {

        console.log( 'springConstant = ' + Util.toFixed( springConstant, 3 ) + '\t\t' + 'thickness = ' + Util.toFixed( springThickness, 3 ) );
      } );
    }
  }

  massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

  return inherit( Object, MassesAndSpringsModel, {

    /**
     * Creates new mass object and pushes it into the model's mass array.
     * @public
     *
     * @param {number} mass - mass in kg
     * @param {number} xPosition - starting x-coordinate of the mass object, offset from the first spring position
     * @param {string} color - color of the MassNode
     * @param {string} specifiedLabel - customized label for the MassNode
     * @param {Tandem} tandem
     */
    createMass: function( mass, xPosition, color, specifiedLabel, tandem ) {
      this.masses.push( new Mass( mass, xPosition, color, this.gravityProperty, tandem ) );
    },

    /**
     * Creates a new spring and adds it to the model.
     * @public
     *
     * @param {number} x - The x coordinate of the spring, in model coordinates.
     * @param {Tandem} tandem
     */
    createSpring: function( x, tandem ) {
      var spring = new Spring(
        new Vector2( x, MassesAndSpringsConstants.CEILING_Y ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        this.dampingProperty.get(),
        this.gravityProperty,
        tandem
      );
      this.springs.push( spring );

      // Links are used to set damping Property of each spring to the damping property of the system
      //REVIEW: Additionally, why not pass this reference in directly, so direct listeners can be added?
      this.dampingProperty.link( function( newDamping ) {
        assert && assert( newDamping >= 0, 'damping must be greater than or equal to 0: ' + newDamping );
        spring.dampingCoefficientProperty.set( newDamping );
      } );
    },

    /**
     * Spring set that contains two springs. Used on the Intro and Vector screens.
     * @protected
     *
     * @param {Tandem} tandem
     */
    addDefaultSprings: function( tandem ) {
      this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X - 0.3, tandem.createTandem( 'leftSpring' ) );
      this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X, tandem.createTandem( 'rightSpring' ) );
    },

    /**
     * Mass set that contains seven standard masses. Used on the Intro and Vector screens.
     * @protected
     *
     * @param {Tandem} tandem
     */
    addDefaultMasses: function( tandem ) {
      this.createMass( 0.250, 0.12, 'rgb( 153, 153, 153 )', null, tandem.createTandem( 'largeLabeledMass' ) );
      this.createMass( 0.100, 0.20, 'rgb( 153, 153, 153 )', null, tandem.createTandem( 'mediumLabeledMass1' ) );
      this.createMass( 0.100, 0.28, 'rgb( 153, 153, 153 )', null, tandem.createTandem( 'mediumLabeledMass2' ) );
      this.createMass( 0.050, 0.33, 'rgb( 153, 153, 153 )', null, tandem.createTandem( 'smallLabeledMass' ) );
      this.createMass( 0.200, 0.63, 'rgb( 250, 186, 75)', null, tandem.createTandem( 'largeUnlabeledMass' ), { gradientEnabled: false } );
      this.createMass( 0.150, 0.56, 'rgb( 0, 222, 224 )', null, tandem.createTandem( 'mediumUnlabeledMass' ), { gradientEnabled: false } );
      this.createMass( 0.075, 0.49, 'rgb( 246, 164, 255 )', null, tandem.createTandem( 'smallUnlabeledMass' ), { gradientEnabled: false } );

      // Mystery masses should have a question mark as their label.
      //REVIEW: This is supported in Mass options, ideally we should pass it there. Not clear if these are the FIRST
      //REVIEW: masses added or not, so I'm not for-sure which masses this should apply to. Passing in with createMass
      //REVIEW: options would simplify a lot.
      for ( var i = 4; i < this.masses.length; i++ ) {
        this.masses[ i ].mysteryLabel = true;
      }
    },

    /**
     * @public
     */
    reset: function() {
      this.dampingProperty.reset();
      this.gravityProperty.reset();
      this.bodyProperty.reset();
      this.playingProperty.reset();
      this.simSpeedProperty.reset();
      this.rulerVisibleProperty.reset();
      this.timerVisibleProperty.reset();
      this.timerSecondsProperty.reset();
      this.timerRunningProperty.reset();
      this.movableLineVisibleProperty.reset();
      this.naturalLengthVisibleProperty.reset();
      this.equilibriumPositionVisibleProperty.reset();
      this.velocityVectorVisibilityProperty.reset();
      this.accelerationVectorVisibilityProperty.reset();
      this.gravityVectorVisibilityProperty.reset();
      this.springVectorVisibilityProperty.reset();
      this.forcesModeProperty.reset();
      this.masses.forEach( function( mass ) { mass.reset(); } );
      this.springs.forEach( function( spring ) { spring.reset(); } );
    },

    /**
     * Based on new dragged position of mass, try to attach or detach mass if eligible and then update position.
     *
     * @param {Mass} mass
     * @public
     */
    adjustDraggedMassPosition: function( mass ) {
      var massPosition = mass.positionProperty.get();

      // Attempt to detach
      if ( mass.springProperty.get()
           && Math.abs( mass.springProperty.get().positionProperty.get().x - massPosition.x ) > RELEASE_DISTANCE ) {
        mass.springProperty.get().removeMass();
        mass.detach();
      }

      // Update mass position and spring length if attached
      if ( mass.springProperty.get() ) {

        // Update the position of the mass
        if ( mass.positionProperty.value.x !== mass.springProperty.get().positionProperty.get().x ) {
          mass.positionProperty.set( mass.positionProperty.get().copy().setX( mass.springProperty.get().positionProperty.get().x ) );
        }

        // Update spring displacementProperty so correct spring length is used.
        mass.springProperty.value.updateDisplacement( massPosition.y );

        // Maximum y value the spring should be able to contract based on the thickness and amount of spring coils.
        var maxY = mass.springProperty.get().thicknessProperty.get() *
                   OscillatingSpringNode.MAP_NUMBER_OF_LOOPS( mass.springProperty.get().naturalRestingLengthProperty.get() );

        // Max Y value in model coordinates
        var modelMaxY = UPPER_CONSTRAINT( maxY );

        // Update only the spring's length if we are lower than the max Y
        if ( mass.positionProperty.get().y > modelMaxY ) {

          // set mass position to maximum y position based on spring coils
          mass.positionProperty.set( mass.positionProperty.get().copy().setY( modelMaxY ) );

          // Limit the length of the spring to based on the spring coils.
          mass.springProperty.value.updateDisplacement( modelMaxY );
        }
      }

      // Update mass position if unattached
      else {

        // Attempt to attach. Assumes springs are far enough apart where one mass can't attach to multiple springs.
        this.springs.forEach( function( spring ) {
          if ( Math.abs( massPosition.x - spring.positionProperty.get().x ) < GRABBING_DISTANCE &&
               Math.abs( massPosition.y - spring.bottomProperty.get() ) < GRABBING_DISTANCE &&
               spring.massAttachedProperty.get() === null ) {
            spring.setMass( mass );
          }
        } );
      }
    },

    /**
     * Responsible for stepping through the model at a specified dt
     * @param {number} dt
     *
     * @public
     */
    stepForward: function( dt ) {
      this.modelStep( dt );// steps the nominal amount used by step forward button listener
    },

    /**
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      // If simulationTimeStep > 0.3, ignore it - it probably means the user returned to the tab after
      // the tab or the browser was hidden for a while.
      dt = Math.min( dt, 0.3 );

      if ( this.playingProperty.get() ) {
        this.modelStep( dt );
      }
    },

    /**
     * Steps in model time.
     *
     * @param {number} dt
     * @private
     */
    modelStep: function( dt ) {
      var self = this;
      var animationDt = dt;

      // Change the dt value if we are playing in slow motion.
      if ( this.simSpeedProperty.get() === SimSpeedChoice.SLOW && this.playingProperty.get() ) {
        dt = dt / MassesAndSpringsConstants.SIM_DT_RATIO;
      }
      for ( var i = 0; i < this.masses.length; i++ ) {

        // Fall if not hung or grabbed
        this.masses[ i ].step( self.gravityProperty.value, MassesAndSpringsConstants.FLOOR_Y + MassesAndSpringsConstants.SHELF_HEIGHT, dt, animationDt );
      }
      if ( this.timerRunningProperty.value ) {
        this.timerSecondsProperty.set( this.timerSecondsProperty.value + dt );
      }

      // Oscillate springs
      this.springs.forEach( function( spring ) {
        spring.step( dt );
      } );
    }
  } );
} );
