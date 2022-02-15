const express = require("express");            //to incorporate express in our project
const bodyParser = require("body-parser");      //to incorporate body-Parser in our project body parser is used to parse the
//data from html/ejs file to server

const mongoose = require("mongoose");           //to incorporate mongoose to our project

mongoose.connect("mongodb://localhost:27017/jackFruit");  //to connect to localhost 27017 where our mongodb server is running and connect
//to toDoListDB database
const app = express();

app.set('view engine', 'ejs');                          //to set the view engine of app to ejs

app.use(bodyParser.urlencoded({ extended: true }));       //to incorporate body-parser with express
app.use(express.static("public"));

const authSchema = new mongoose.Schema({
    email: String,
    passWord: String

});

const calculationSchema = new mongoose.Schema({
    email: String,
    Bas: Number,
    LTA: Number,
    HRA: Number,
    FA: Number,
    Inv: Number,
    Rent: Number,
    CityType: String,
    Med: Number,
    AppHRA: Number,
    taxableAmount: Number

});

const calculationCollection = mongoose.model("calculationCollection", calculationSchema);

const authCollection = mongoose.model("authCollection", authSchema);

app.post("/taxableAmount", function (req, res) {

    var email = req.body.username;
    console.log(email);
    var Bas = parseFloat(req.body.Bas);

    var LTA = parseFloat(req.body.LTA);
    var HRA = parseFloat(req.body.HRA);
    var FA = parseFloat(req.body.FA);
    var Inv = parseFloat(req.body.Inv);
    var Rent = parseFloat(req.body.Rent);
    var CityType = req.body.CityType;
    var Med = parseFloat(req.body.Med)

    var AppHRA;

    if (CityType === "metro") {

        var baseOnBas = (Bas * 50) / 100;
        var baseOnRentAndBas = Rent - (Bas * 10) / 100;

        var baseOnHRA = HRA;

        if (baseOnBas < baseOnRentAndBas && baseOnBas < baseOnHRA) {
            AppHRA = baseOnBas;
        }
        else if (baseOnRentAndBas < baseOnBas && baseOnRentAndBas < baseOnHRA) {
            AppHRA = baseOnRentAndBas;

        }
        else {
            AppHRA = baseOnHRA;

        }
        //console.log(AppHRA);

    }
    else {

        var baseOnBas = (Bas * 40) / 100;
        var baseOnRentAndBas = Rent - (Bas * 10) / 100;

        var baseOnHRA = HRA;

        if (baseOnBas < baseOnRentAndBas && baseOnBas < baseOnHRA) {
            AppHRA = baseOnBas;
        }
        else if (baseOnRentAndBas < baseOnBas && baseOnRentAndBas < baseOnHRA) {
            AppHRA = baseOnRentAndBas;

        }
        else {
            AppHRA = baseOnHRA;

        }

    }
    console.log(Bas);
    console.log(LTA);
    console.log(HRA);
    console.log(FA);
    console.log(AppHRA);
    console.log(Inv);
    console.log(Med);
    //console.log(Bas);
    var taxableAmount = (Bas + LTA + HRA + FA) - AppHRA - Inv - Med;
    console.log(taxableAmount);

    const calculationDocument = new calculationCollection({
        email: email,
        Bas: Bas,
        LTA: LTA,
        HRA: HRA,
        FA: FA,
        Inv: Inv,
        Rent: Rent,
        CityType: CityType,
        Med: Med,
        AppHRA: AppHRA,
        taxableAmount: taxableAmount

    });
    calculationDocument.save();

    res.render("taxableAmount", { taxableAmount: taxableAmount });
});

app.get("/", function (req, res) {
    res.render("login", { message: "" });

});
app.post("/authenticate", function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    authCollection.find({ email: username }, { passWord: password }, function (err, output) {
        if (err) {
            console.log("Error while authentication");
            res.render("login", { message: "" });
        }
        else if (output.length != 0) {
            res.render("userInput", { email: username });
        }
        else {
            res.render("login", { message: "" });
        }

    });

});
app.get("/register", function (req, res) {
    res.render("register");

});
app.post("/register", function (req, res) {
    var username = req.body.username;
    var password1 = req.body.password;

    authCollection.find({ email: username }, function (err, output) {
        if (err) {
            console.log("Error while authentication");
            res.render("register");
        }
        else if (output.length != 0) {
            res.render("login", { message: "User with this Email Id already Exists please Create an account with different email Id" });
        }
        else {
            const newUser = new authCollection({
                email: username,
                passWord: password1

            });
            newUser.save();
            console.log("data added");
            res.render("userInput", { email: username });

        }

    });





});



app.listen(3000, function () {
    console.log("Listrning on port 3000");
});