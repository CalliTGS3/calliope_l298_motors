//% color="#AA278D" weight=8 icon="\uf1ba"
namespace l298 {

    export class L298Motor{
        in1: DigitalPin;
        in2: DigitalPin;
        en: AnalogPin;
        /**
        * Run the motor. 
        * @param speed a value between -100 and 100. speed < 0 is backwards
        **/
        //% block="turn motor $this(motor) with $speed"
        //% block.loc.de="drehe Motor $this(motor) mit Geschwindigkeit $speed"        
        //% jsdoc.loc.de="Drehe den Motor."
        //% speed.loc.de="Ein Wert für die Geschwindigkeit zwischen -100 und 100. Ein Wert kleiner 0 ist rückwärts." 
        //% speed.min=-100 speed.max=100
        turn(speed: number): void {   
            if (speed > 0) {
                pins.servoSetPulse(this.en, speed * 200)
                pins.digitalWritePin(this.in1, 0)
                pins.digitalWritePin(this.in2, 1)
            } else if (speed < 0) {
                pins.servoSetPulse(this.en, -speed * 200)
                pins.digitalWritePin(this.in2, 0)
                pins.digitalWritePin(this.in1, 1)
            } else {
                pins.analogWritePin(this.en, 0)
                basic.turnRgbLedOff()
            }
        }
        /**
        * Stop the motor. 
        **/
        //% block="stop motor $this(motor)"
        //% block.loc.de="stoppe Motor $this(motor)"
        //% jsdoc.loc.de="Stoppe den Motor."
        stop():void{
            this.turn(0)
        }
    }

    export class Vehicle{
        motor_left: L298Motor;
        motor_right: L298Motor;
        /**
        * Run the vehicle. 
        * @param speed a value between -100 and 100. speed < 0 is backwards
        * @param direction a value between -100 and 100. -100 is left (left motor stopped), 0 is straight, 100 is right (right motor stopped)
        **/
        //% speed.min=-100 speed.max=100
        //% direction.min=-100 direction.max=100
        //% block="drive vehicle $this(vehicle) with $speed and direction $direction"
        //% block.loc.de="fahre Fahrzeug $this(vehicle) mit Geschwindigkeit $speed und Richtung $direction"
        //% jsdoc.loc.de="Setzt das Fahrzeug in Fahrt."
        //% speed.loc.de="Ein Wert für die Geschwindigkeit zwischen -100 und 100. Ein Wert kleiner 0 ist rückwärts."
        //% direction.loc.de="Ein Wert für die Richtung zwischen -100 und 100. -100 ist links (linker Motor gestoppt), 0 geradeaus, 100 ist rechts (rechter Motor gestoppt)"
        drive(speed: number, direction: number): void {
            if (direction <= 0) {
                this.motor_left.turn(speed * (100 + direction) / 100)
                this.motor_right.turn(speed)
            } else {
                this.motor_left.turn(speed)
                this.motor_right.turn(speed * (100 - direction) / 100)
            }
        }
        /**
        * Turn the vehicle left (left motor backwards, right motor forwards).
        * @param speed a value between 0 and 100 
        */
        //% block="turn vehicle $this(vehicle) to left with speed $speed"
        //% block.loc.de="drehe Fahrzeug $this(vehicle) mit Geschwindigkeit $speed nach links"
        //% jsdoc.loc.de="Drehe das Fahrzeug nach links (linker Motor rückwärts, rechter Motor vorwärts)"
        //% speed.loc.de="Geschwindigkeit, ein Wert zwischen 0 und 100"
        //% speed.min=0 speed.max=100
        turn_left(speed:number):void{
            this.motor_left.turn(-speed)
            this.motor_right.turn(speed)
        }
        /**
        * Turn the vehicle right (left motor forwards, right motor backwards)
        * @param speed a value between 0 and 100
        */
        //% block="turn vehicle $this(vehicle) to right with speed $speed"
        //% block.loc.de="drehe Fahrzeug $this(vehicle) mit Geschwindigkeit $speed nach rechts"
        //% jsdoc.loc.de="Drehe das Fahrzeug nach rechts (rechter Motor rückwärts, linker Motor vorwärts)"
        //% speed.loc.de="Geschwindigkeit, ein Wert zwischen 0 und 100"
        //% speed.min=0 speed.max=100
        turn_right(speed:number):void{
            this.motor_left.turn(speed)
            this.motor_right.turn(-speed)
        }
        /**
        * Stop the vehicle. 
        **/
        //% block="stop vehicle $this(vehicle)"
        //% block.loc.de="stoppe Fahrzeug $this(vehicle)"
        //% jsdoc.loc.de="Stoppe das Fahrzeug."
        stop():void{
            this.motor_left.stop()
            this.motor_right.stop()
        }
    }

    /**
     * Create a new motor object for L298 motor driver.
     * @param in1 the pin where IN1/IN3 of L298 is connected.
     * @param in2 the pin where IN2/IN4 of L298 is connected.
     * @param en the pin where ENA/ENB of L298 is connected.
    **/
    //% blockId="l298_motor_create"
    //% block="Motor on IN1/IN3: %in1 IN2/IN4: %in2 EN: %en"
    //% block.loc.de="Motor an IN1/IN3: %in1 IN2/IN4: %in2 EN: %en"
    //% jsdoc.loc.de="Erzeuge ein neues Motor-Objekt für den L298 Motortreiber."
    //% in1.loc.de="Der Pin, mit dem IN1/IN3 des L298 verbunden ist."
    //% in2.loc.de="Der Pin, mit dem IN2/IN4 des L298 verbunden ist."
    //% en.loc.de="Der Pin, mit dem ENA/ENB des L298 verbunden ist."
    //% weight=90 blockGap=8
    //% blockSetVariable=motor
    //% trackArgs=0,2
    export function create_motor(in1: DigitalPin, in2:DigitalPin, en:AnalogPin): L298Motor {
        let motor = new L298Motor();
        motor.in1 = in1;
        motor.in2 = in2;
        motor.en = en;
        return motor;
    }
    /**
     * Create a new Vehicle object for two L298 motors.
     * @param motor_left the left motor
     * @param motor_right the right motor
    **/
    //% blockId="vehicle_create"
    //% block="Vehicle with motor left: %motor_left motor right: %motor_right"
    //% block.loc.de="Fahrzeug mit Motor links: %motor_left Motor rechts: %motor_right"
    //% jsdoc.loc.de="Erzeuge ein neues Fahrzeug-Objekt."
    //% motor_left.loc.de="Der linke Motor."   
    //% motor_right.loc.de="Der rechte Motor."     
    //% weight=90 blockGap=8
    //% blockSetVariable=vehicle
    //% trackArgs=0,2
    export function create_vehicle(motor_left: L298Motor, motor_right: L298Motor): Vehicle {
        let vehicle = new Vehicle();
        vehicle.motor_left = motor_left;
        vehicle.motor_right = motor_right;
        return vehicle;
    }
}
