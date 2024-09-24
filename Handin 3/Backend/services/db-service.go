package services

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/mattn/go-sqlite3"

	Model "iot/main/models"
)

const VOC string = "tvoc"
const CO2 string = "co2"

var db *sql.DB

func EstablishDatabaseConnection() (bool, error) {
	var err error

	db, err = sql.Open("sqlite", "database.db")

	if err != nil {
		return false, err
	}

	return createDatabaseScheme()
}

func createDatabaseScheme() (bool, error) {

	_, err := db.Exec("CREATE TABLE IF NOT EXISTS measurements (id INTEGER PRIMARY KEY AUTOINCREMENT, created_time TEXT, measurement_type TEXT, value REAL);")

	if os.Getenv("ENV") == "Test" {
		db.Exec("INSERT INTO measurements values (1,'2002-08-31','tvoc',1.2)")
		db.Exec("INSERT INTO measurements values (2,'2002-08-31','co2',3.4)")
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

func GetLatestCO2() (Model.Measurement, error) {
	return getLatestValue(CO2)
}

func GetLatestVOC() (Model.Measurement, error) {
	return getLatestValue(VOC)
}

func getLatestValue(v_type string) (Model.Measurement, error) {
	var measurement Model.Measurement

	row := db.QueryRow("select * from measurements where created_date in (select max(created_date) from measurements where measurement_type = ?);", v_type)

	if err := row.Scan(&measurement.Id, &measurement.CreatedDate, &measurement.MeasuremenType, &measurement.Value); err != nil {
		return measurement, fmt.Errorf("Error while getting value (%v) %v", v_type, err)
	}

	return measurement, nil
}
