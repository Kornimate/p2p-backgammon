package services

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"iot/main/models"
	"os"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"gopkg.in/yaml.v3"
)

const TOPIC_POST string = "Alfa/api/POST"
const TOPIC_LED string = "Alfa/api/LED"

var client mqtt.Client
var config models.Config

var messageHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())

	var dto *models.IoTDTO
	var err error

	dto, err = parseJson(msg.Payload())

	if err != nil {
		return
	}

	if dto == nil {
		fmt.Println("error while parsing incoming data")

		return
	}

	var tvoc models.Measurement
	var co2 models.Measurement

	var timeStamp string = time.Now().Format(time.RFC3339)

	tvoc.CreatedDate = timeStamp
	tvoc.MeasuremenType = "tvoc"
	tvoc.Value = dto.Tvoc_level

	co2.CreatedDate = timeStamp
	co2.MeasuremenType = "co2"
	co2.Value = dto.Co2_level

	InsertNewValue(tvoc)
	InsertNewValue(co2)
}

var connectionHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected")
}

var connectionLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	fmt.Printf("Connect lost: %v", err)

	EstablishDatabaseConnection()
}

//private functions

func newTlsConfig() *tls.Config {
	return &tls.Config{
		InsecureSkipVerify: true,
		ClientAuth:         tls.NoClientCert,
		MinVersion:         tls.VersionTLS12,
	}
}

func subscribeToTopic(topic string) {

	if token := client.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	fmt.Printf("Subscribed to topic: %s", topic)
}

func importConfigs() {
	file, err := os.Open("config.yaml")

	if err != nil {
		panic("Unable to open config file")
	}

	defer file.Close()

	err = (yaml.NewDecoder(file)).Decode(&config)

	if err != nil {
		panic("Unable to parse config file")
	}
}

//public functions

func PublishToTopic(state int64) {
	if token := client.Publish(TOPIC_LED, 0, false, fmt.Sprintf("%v", state)); token.Wait() && token.Error() != nil {
		fmt.Println("Error while publishing message")

		return
	}

	fmt.Println("Message successfully published!")
}

func EstablishMQTTConnection() {

	importConfigs()

	opts := mqtt.NewClientOptions()

	opts.AddBroker(fmt.Sprintf("ssl://%s:%d", config.Mqtt.Broker, config.Mqtt.Port))

	opts.SetClientID("api-client")
	opts.SetUsername(config.Mqtt.Username)
	opts.SetPassword(config.Mqtt.Password)
	opts.SetDefaultPublishHandler(messageHandler)
	opts.CleanSession = false

	tlsConfig := newTlsConfig()
	opts.SetTLSConfig(tlsConfig)

	opts.OnConnect = connectionHandler
	opts.OnConnectionLost = connectionLostHandler

	client = mqtt.NewClient(opts)

	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	subscribeToTopic(TOPIC_POST)
}

func parseJson(input []byte) (*models.IoTDTO, error) {
	var dto models.IoTDTO

	err := json.Unmarshal(input, &dto)

	return &dto, err
}

func IsClientAlive() bool {

	fmt.Println(client.IsConnected())
	fmt.Println(client.IsConnectionOpen())

	return client.IsConnected() && client.IsConnectionOpen()

}
