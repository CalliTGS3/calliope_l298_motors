//% color="#AA278D" weight=8 icon="\uf1ba"
namespace l298 {

    export class L298Motor{
        in1: DigitalPin;
        in2: DigitalPin;
        en: AnalogPin;

        /**
        * Run the motor. 
        * @param speed a value between -100 and 100. speed < 0 is backwards
        */
        //% speed.min=-100 speed.max=100
        //% block="drehe Motor $this(motor) mit Geschwindigkeit $speed"
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
        //% block="stoppe Motor $this(motor)"
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
        */
        //% speed.min=-100 speed.max=100
        //% richtung.min=-100 richtung.max=100
        //% block="fahre Fahrzeug $this(vehicle) mit Geschwindigkeit $speed und Richtung $richtung "
        drive(speed: number, richtung: number): void {
            if (richtung <= 0) {
                this.motor_left.turn(speed * (100 + richtung) / 100)
                this.motor_right.turn(speed)
            } else {
                this.motor_left.turn(speed)
                this.motor_right.turn(speed * (100 - richtung) / 100)
            }
        }

        /**
        * Turn the vehicle left (left motor backwards, right motor forwards)
        * @param speed a value between 0 and 100
        */
        //% speed.min=0 speed.max=100
        //% block="drehe Fahrzeug $this(vehicle) mit Geschwindigkeit $speed nach links."
        turn_left(speed:number):void{
            this.motor_left.turn(-speed)
            this.motor_right.turn(speed)
        }

        /**
        * Turn the vehicle right (left motor forwards, right motor backwards)
        * @param speed a value between 0 and 100
        */
        //% speed.min=0 speed.max=100
        //% block="drehe Fahrzeug $this(vehicle) mit Geschwindigkeit $speed nach rechts."
        turn_right(speed:number):void{
            this.motor_left.turn(speed)
            this.motor_right.turn(-speed)
        }

        /**
        * Stop the vehicle 
        */
        //% block="stoppe Fahrzeug $this(vehicle)"
        stop():void{
            this.motor_left.stop()
            this.motor_right.stop()
        }

    }

    /**
     * Create a new motor object for L298 motor driver.
     * @param in1 the pin where IN1/IN3 of L298 is connected.
     * @param in2 the pin where IN2/IN4 of L298 is connected.
     * @param EN the pin where ena/enb of L298 is connected.
    */
    //% blockId="l298_motor_create" block="Motor an IN1/IN3: %in1 IN2/IN4: %in2 EN: %en"
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
    */
    //% blockId="vehicle_create" block="Vehicle mit Motor links: %motor_left Motor rechts: %motor_right"
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
