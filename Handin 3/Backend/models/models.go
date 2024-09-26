package models

type Measurement struct {
	Id             int    `json:"id"`
	CreatedDate    string `json:"createdDate"`
	MeasuremenType string `json:"measurementType"`
	Value          int    `json:"value"`
}

type Config struct {
	Mqtt struct {
		Broker   string `yaml:"broker"`
		Port     int    `yaml:"port"`
		Username string `yaml:"username"`
		Password string `yaml:"password"`
	} `yaml:"mqtt"`
}

type IoTDTO struct {
	Co2_level  int `json:"co2_level"`
	Tvoc_level int `json:"tvoc_level"`
}
