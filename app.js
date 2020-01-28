
const express = require("express");//require() is a specific built-in NodeJS function for loading modules (smth like "include" in C++)
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

//static() is a function to serve files from within the "root" directory. It specifies a static folder, where we can hold files of the resourses, for example.
//Files of the resources in .html have to be inside the "root" folder and pathes to them should be mentioned without the name of the "root".
app.use(express.static("public"));

//urlencoded() is a function that creates "application/x-www-form-urlencoded" parser. This parser gets urlencoded-body.
//Addition of the option "extended:true" allows to use JSON-like syntax to access the data.
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  //Data from signup.html form
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;

//An object with data about new subscriber. This is a parameter that should be passed in the body of the request to the server.
  let data = {
    members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
    }]
  };

  let jsonData = JSON.stringify(data);//Convertation from Object type to JSON. This format is required in "options" parameter of "request()"

  let options = {
    url: "https://XXX.api.mailchimp.com/3.0/lists/xxxxxxxxxx", //https:{name of the server - from API key}.api.mailchimp.com/3.0/lists/{list id}
    method: "POST",
    headers: {
        "Authorization": "thereShouldBeNameOfTheUser xxxxxxxxxx5940f9bb6c940d8865ae5b-us4", //'Authorization': 'userName myApiKey'
    },
    body: jsonData //JSON object wich we pass to the mailchimp server. It represents data about new subscriber.
  };

  request(options, function(error, response, body) {

    if(error|(response.statusCode !== 200)){
      res.sendFile(__dirname + "/failure.html");
      //console.log(response.statusCode);
    }else{
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
        //console.log(response.statusCode);
      }
    }
  });
});

app.post("/failure", (req, res) => {
  res.redirect("/");//from the page "localhost:3000/failure" we can move back to the root "localhost:3000" if the user will click on the button "Go back"
});

app.listen(3000, () => {
  console.log("The server is running and listens to the port 3000");
});
