import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


//    1. Retrieve all patients
// Create a ```GET``` endpoint that retrieves all patients and displays their:
// - ```patient_id```
// - ```first_name```
// - ```last_name```
// - ```date_of_birth```

app.get('/all/patients', (req, res) => {
    const sql = `SELECT patient_id, first_name, last_name, DATE_FORMAT(date_of_birth, "%Y-%m-%d") AS date_of_birth FROM patients`;
    db.query(sql, (err, results) => {
        if(err) {
            return console.log("Failed to fetch all patients");
        }

        if(!results || results.length === 0){
            return console.log("No available patients");
        }        

        res.render("all-patients", {results});
    })
})


// 2. Retrieve all providers
// Create a ```GET``` endpoint that displays all providers with their:
// - ```first_name```
// - ```last_name```
// - ```provider_specialty```

app.get('/all/providers', (req, res) => {
  const sql = `SELECT first_name, last_name, provider_specialty FROM providers`;
  db.query(sql, (err, results) => {
    if(err) {
      return console.log("Failed to fetch all providers");
    }

    if(!results || results.length === 0){
      return console.log("No available providers");
    }

    res.render("all-providers", {results});
  })
})


// 3. Filter patients by First Name
// Create a ```GET``` endpoint that retrieves all patients by their first name

app.get('/all/patients/:first_name', (req, res) => {
  const sql = `SELECT patient_id, first_name, last_name, DATE_FORMAT(date_of_birth, "%Y-%m-%d") AS date_of_birth FROM patients WHERE first_name = ?`;
  db.query(sql, [req.params.first_name], (err, results) => {
    if(err) {
      return console.log("Failed to fetch all patients");
    }

    if(!results || results.length === 0){
      return console.log("No available patients");
    }

    res.render("all-patients", {results});
  })
})



// 4. Retrieve all providers by their specialty
// Create a ```GET``` endpoint that retrieves all providers by their specialty

app.get('/all/providers/:provider_specialty', (req, res) => {
  const sql = `SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?`;
  db.query(sql, [req.params.provider_specialty], (err, results) => {
    if(err) {
      return console.log("Failed to fetch all providers");
    }

    if(!results || results.length === 0){
      return console.log("No available providers");
    }

    res.render("all-providers", {results});
  })
})

db.connect((err) => {
  if (err) {
    return console.error("Failed to connect to db");
  }

  app.listen(process.env.PORT, () => {
    console.log(
      `Server running on port ${process.env.PORT} and connected to mysql db id ${db.threadId}`
    );
  });
});
