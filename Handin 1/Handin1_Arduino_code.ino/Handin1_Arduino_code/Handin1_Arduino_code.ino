#include <Adafruit_SGP30.h>
#include <M5StickCPlus.h>
#include <M5_EzData.h>

Adafruit_SGP30 sgp;


const char* ssid     = "AU-Gadget";
const char* password = "augadget";
const char* token    = "4f010319125c4afba13a083f175f62b0";

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

// Define the display status
bool is_display_off = false;


// Define the start time
int last_measurement = 0;
int i = 0; 

// Function to print the first element of the array to the M5StickC-Plus screen
void write_to_screen(int* label, const char* msg, int text_size) {
  int x_cord = label[0];
  int y_cord = label[1];
  M5.Lcd.setCursor(x_cord, y_cord); // Set cursor to the top-left corner of the screen
  M5.Lcd.setTextSize(text_size);
  M5.Lcd.setTextColor(WHITE); // Set the text color
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
  M5.Lcd.fillScreen(BLACK); // Fills the entire screen with black color
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

void sendData(){
  setData(token, "test", airData.current_Co2);
  setData(token, "tvoc_mesurement", airData.current_Co2);
}


void measure_and_update(){
  M5.Lcd.fillScreen(BLACK); // Clear the screen with black color
  measureAirQuality();
  update_display();
  sendData();
}




void setup() {
  Serial.begin(38400);
  // Initialize the M5StickC-Plus
  M5.begin();

  if (!setupWifi(ssid, password)) {  // Connect to wifi.  连接到wifi
    M5.Lcd.printf("Connecting to %s failed\n", ssid);
  }
  sgp.begin();
  M5.Lcd.setRotation(0); // Set screen rotation if necessary
  measure_and_update();
}


void loop() {
  M5.update();  // Necessary to read button states properly

  if (M5.BtnA.wasPressed()) {
    // Toggle between white and black background
    if (!is_display_off) {
      is_display_off = true;
      M5.Axp.ScreenBreath(0);     
    } else {
      is_display_off = false;
      M5.Axp.ScreenBreath(99);     
      update_display(); // Update the screen with the new colors
    }
    int Array[3] = {};
    if (getData(token, "testList", Array, 0, 3)) {
        M5.Lcd.print("Success get list\n");
        for (int i = 0; i < 3; i++) {
            M5.Lcd.printf("Array[%d]=%d,", i, Array[i]);
        }
        M5.Lcd.println("");
    } else {
        M5.Lcd.println("Fail to get data");
    }
  }
  delay(5000);

  int current_time = millis();
  if((current_time -last_measurement) >= 5000){ //60.000ms = 1 secons
    i = i+1;
    measure_and_update();
    last_measurement = current_time;
  }
  delay(100); // Small delay to prevent excessive button presses
}
