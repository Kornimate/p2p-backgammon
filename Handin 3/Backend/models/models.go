package models

type Measurement struct {
	Id             int     `json: "id"`
	CreatedDate    string  `json: "createdDate"`
	MeasuremenType string  `json: "measurementType"`
	Value          float64 `json: "value"`
}
