#include <FastGPIO.h>
#define APA102_USE_FAST_GPIO

#include <APA102.h>

#define SERIAL_TIMEOUT 100 /* ms */

APA102<11, 12> ledStrip;
const uint16_t ledCount = 144;
rgb_color pixels[ledCount];

void setup() {
  Serial.begin(115200);
  Serial.println("Ready!");
}

void loop() {
  for (uint16_t i = 0; i < ledCount; i++)
  {
    unsigned long start = millis();
    while (Serial.available() < 3 && (millis() - start < SERIAL_TIMEOUT));
    if (millis() - start >= SERIAL_TIMEOUT) {
      // Timeout
      break;
    }
    pixels[i] = (rgb_color) {Serial.read(), Serial.read(), Serial.read()};
  }
  ledStrip.write(pixels, ledCount, 2);
}
