const express = require("express");
const app = express();
const path = require("path");
const users = require("./mongoconnection");
const cookieparser = require("cookie-parser");
const Razorpay = require("razorpay");
const cors = require("cors");

let static_path = path.join(__dirname, "./public");
app.use(express.static(static_path));

app.use(cors());
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs"); 

app.get("/", (req, res) => {
  res.render("home"); 
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});
 
app.get("/contact", (req, res) => {
  res.render("contact");
});

// FORM CONTACT PAGE
app.post("/contact", async (req, res) => {
  try {
    const user = new users({
      Name: req.body.Name,
      Email: req.body.email,
      Number: req.body.number,
      Message: req.body.message,
    });

    const check = await users.findOne({ Email: user.Email });

    const token = await user.authenticuser();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 40000),
      httpOnly: true,
    });

    if (check) {
      res.redirect("/");
    } else {
      const insertUser = await users.create(user);
      res.redirect("/");
    }
  } catch (err) {
    res.status(404).send(`${err.message}`);
  }
}); 

app.listen(5500, "127.0.0.1", () => {
  console.log(`listening to port 5500..`);
});
