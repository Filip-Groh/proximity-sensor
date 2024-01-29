const threshold = 150

music.setVolume(255)
radio.setGroup(1)
radio.setTransmitPower(7)
radio.setFrequencyBand(0)

let lock = false
basic.forever(function () {
    let lightLevel = input.lightLevel()
    if (lightLevel < threshold && !lock) {
        control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 1)
        lock = true
    }

    if (lightLevel >= threshold) {
        lock = false
    }
	
    serial.writeValue("lightLevel", lightLevel)

    basic.pause(10)
})

control.onEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 1, function() {
    music.playTone(2000, 200)
    radio.sendValue("start", control.millis())
})

radio.onReceivedValue(function(name: string, value: number) {
    if (name == "finish") {
        music.playTone(400, 200)
        serial.writeValue("LapTime", value)
    }
})