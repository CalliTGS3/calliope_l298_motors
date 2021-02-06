input.onButtonPressed(Button.A, function () {
    vehicle.turn_left(100)
    basic.pause(1000)
    vehicle.drive(-80, 0)
    basic.pause(1000)
    vehicle.stop()
})
let vehicle: l298.Vehicle = null
let motor = l298.create_motor(DigitalPin.P0, DigitalPin.P1, AnalogPin.C16)
let motor2 = l298.create_motor(DigitalPin.P2, DigitalPin.P3, AnalogPin.C17)
vehicle = l298.create_vehicle(motor2, motor)
