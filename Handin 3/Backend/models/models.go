package models

type Measurement struct {
	Id             int     `json:"id"`
	CreatedDate    string  `json:"createdDate"`
	MeasuremenType string  `json:"measurementType"`
	Value          float64 `json:"value"`
}

type Config struct {
	Mqtt struct {
		Broker   string `yaml:"broker"`
		Port     int    `yaml:"port"`
		Username string `yaml:"username"`
		Password string `yaml:"password"`
	} `yaml:"mqtt"`
}
