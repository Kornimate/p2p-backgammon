package services

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"

	Model "iot/main/models"
)

const VOC string = "tvoc"
const CO2 string = "co2"

var db *sql.DB

func EstablishDatabaseConnection() (bool, error) {
	var err error

	db, err = sql.Open("sqlite3", "database.db")

	if err != nil {
		return false, err
	}

	return createDatabaseScheme()
}

func createDatabaseScheme() (bool, error) {

	_, err := db.Exec("CREATE TABLE IF NOT EXISTS measurements (id INTEGER PRIMARY KEY AUTOINCREMENT, created_time TEXT, measurement_type TEXT, value INTEGER);")

	if err != nil {
		return false, err
	}

	var rowCount int = -1
	row := db.QueryRow("SELECT COUNT(*) FROM measurements")

	if err := row.Scan(&rowCount); err != nil {
		fmt.Printf("Error while querying rows %v\n", err)

		return false, fmt.Errorf("error while querying rows %v", err)
	}

	if rowCount <= 0 {

		currentTime := time.Now().Format(time.RFC3339)

		db.Exec(fmt.Sprintf("INSERT INTO measurements values (1,'%v','tvoc',400)", currentTime))
		db.Exec(fmt.Sprintf("INSERT INTO measurements values (2,'%v','co2',400)", currentTime))
	}

	return true, nil
}

func GetLatestCO2() (Model.Measurement, error) {
	return getLatestValue(CO2)
}

func GetLatestTVOC() (Model.Measurement, error) {
	return getLatestValue(VOC)
}

func getLatestValue(v_type string) (Model.Measurement, error) {
	var measurement Model.Measurement

	row := db.QueryRow("select * from measurements where created_time in (select max(created_time) from measurements where measurement_type = ?) and measurement_type = ?;", v_type, v_type)

	if err := row.Scan(&measurement.Id, &measurement.CreatedDate, &measurement.MeasuremenType, &measurement.Value); err != nil {
		return measurement, fmt.Errorf("error while getting value (%v) %v", v_type, err)
	}

	return measurement, nil
}

func InsertNewValue(newItem Model.Measurement) (bool, error) {

	_, err := db.Exec("INSERT INTO measurements (created_time,measurement_type,value) values (?,?,?)", newItem.CreatedDate, newItem.MeasuremenType, newItem.Value)

	if err != nil {
		fmt.Printf("Error while inserting value %v\n", err)

		return false, fmt.Errorf("error while inserting value %v", err)
	}

	fmt.Println("Value added")

	return true, nil
}
