#include <Adafruit_SGP30.h>
#include <M5StickCPlus.h>

Adafruit_SGP30 sgp;

// Define a struct to hold the CO2 and TVOC values
struct AirQualityData {
  uint16_t current_Co2;
  uint16_t min_Co2;
  uint16_t max_Co2;
  uint16_t current_TVOC;
  uint16_t min_TVOC;
  uint16_t max_TVOC;
};


// Define an array to hold CO2 label values
int label_Co2_title[] = {3,1};
int label_Co2_now[] = {3,30};
int label_Co2_min[] = {3,50};
int label_Co2_max[] = {3,70};
int label_TVOC_title[] = {3,120};
int label_TVOC_now[] = {3,150};
int label_TVOC_min[] = {3,170};
int label_TVOC_max[] = {3,190};
int label_num_meaure[] = {3,210};

// Define the background color 
uint16_t backgroundColor = BLACK;
uint16_t textColor = WHITE; // Default text color (white)
bool isWhiteBackground = false;   // Initially set to false (black background)


// Define the start time
int last_measurement = 0;
int i = 0; 

// Function to print the first element of the array to the M5StickC-Plus screen
void write_to_screen(int* label, const char* msg, int text_size) {
  int x_cord = label[0];
  int y_cord = label[1];
  M5.Lcd.setCursor(x_cord, y_cord); // Set cursor to the top-left corner of the screen
  M5.Lcd.setTextSize(text_size);
  M5.Lcd.setTextColor(textColor); // Set the text color
  M5.Lcd.print(msg);

}

AirQualityData airData = {
  0,
  60000,
  0,
  0,
  60000,
  0
};

void measureAirQuality(){

  if (sgp.IAQmeasure()) {
    airData.current_Co2 = sgp.eCO2;
    airData.current_TVOC = sgp.TVOC;

    // Update the minimum and maximum eCO2 values
    if (airData.current_Co2 < airData.min_Co2) airData.min_Co2 = airData.current_Co2;
    if (airData.current_Co2 > airData.max_Co2) airData.max_Co2 = airData.current_Co2;
    

    // Update the minimum and maximum TVOC values
    if (airData.current_TVOC < airData.min_TVOC) airData.min_TVOC = airData.current_TVOC;
    if (airData.current_TVOC > airData.max_TVOC) airData.max_TVOC = airData.current_TVOC;

  } else {
    Serial.println("Measurement failed.");
  }
  last_measurement = millis();
}


void update_display(){
  M5.Lcd.fillScreen(backgroundColor); // Fills the entire screen with black color
  write_to_screen(label_Co2_title, "Co2", 3);
  write_to_screen(label_TVOC_title, "TVOC", 3);

  write_to_screen(label_Co2_now, ("Now: " + String(airData.current_Co2)).c_str(), 2);
  write_to_screen(label_Co2_min, ("Min: " + String(airData.min_Co2)).c_str(), 2);
  write_to_screen(label_Co2_max, ("Max: " + String(airData.max_Co2)).c_str(), 2);
  write_to_screen(label_TVOC_now, ("Now: " + String(airData.current_TVOC)).c_str(), 2);
  write_to_screen(label_TVOC_min, ("Min: " + String(airData.min_TVOC)).c_str(), 2);
  write_to_screen(label_TVOC_max, ("Max: " + String(airData.max_TVOC)).c_str(), 2);
  write_to_screen(label_num_meaure, ("#: " + String(i)).c_str(), 1);
  
}

void measure_and_update(){
  M5.Lcd.fillScreen(backgroundColor); // Clear the screen with black color
  measureAirQuality();
  update_display();
}

void setup() {
  Serial.begin(38400);
  // Initialize the M5StickC-Plus
  M5.begin();
  sgp.begin();
  M5.Lcd.setRotation(0); // Set screen rotation if necessary
  measure_and_update();
}


void loop() {
  M5.update();  // Necessary to read button states properly

  if (M5.BtnA.wasPressed()) {
    // Toggle between white and black background
    if (isWhiteBackground) {
      backgroundColor = BLACK;
      textColor = WHITE;
    } else {
      backgroundColor = WHITE;
      textColor = BLACK;
    }

    isWhiteBackground = !isWhiteBackground; // Toggle the flag
    update_display(); // Update the screen with the new colors
  }

  // Nothing to do in the loop for now
  int current_time = millis();
  if((current_time -last_measurement) >= 60000){ //60.000ms = 1 secons
    i = i+1;
    measure_and_update();
    last_measurement = current_time;
  }
  delay(100); // Small delay to prevent excessive button presses
}
