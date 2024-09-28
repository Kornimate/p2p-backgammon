package main

type Config struct {
	Mqtt struct {
		Broker   string `yaml:"broker"`
		Port     int    `yaml:"port"`
		Username string `yaml:"username"`
		Password string `yaml:"password"`
	} `yaml:"mqtt"`
}
