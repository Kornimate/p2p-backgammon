package services

import (
	"crypto/tls"
	"fmt"
	"iot/main/models"
	"os"
	"strconv"
	"strings"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"gopkg.in/yaml.v3"
)

const TOPIC_POST string = "Alfa/api/POST"
const TOPIC_LED string = "Alfa/api/LED"

var client mqtt.Client
var config models.Config

var messageHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())

	var strData string = string(msg.Payload()[:])

	values := strings.Split(strData, ",")

	var measurement models.Measurement
	var err error

	measurement.CreatedDate = values[0]
	measurement.MeasuremenType = values[1]
	measurement.Value, err = strconv.ParseFloat(values[2], 64)

	if err != nil {
		fmt.Println("Could not parse incoming value")

		return
	}

	InsertNewValue(measurement)
}

var connectionHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected")
}

var connectionLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	fmt.Printf("Connect lost: %v", err)
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

func PublishToTopicTest(value string) {
	if token := client.Publish(TOPIC_POST, 0, false, value); token.Wait() && token.Error() != nil {
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

	tlsConfig := newTlsConfig()
	opts.SetTLSConfig(tlsConfig)

	opts.OnConnect = connectionHandler
	opts.OnConnectionLost = connectionLostHandler

	client = mqtt.NewClient(opts)

	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	subscribeToTopic(TOPIC_POST)
	subscribeToTopic(TOPIC_LED)
}
