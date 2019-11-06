import * as express from "express";
import bodyParser = require("body-parser");
import { compareImage } from "./libs/image-processing";

const app = express();
const port = process.env.PORT || "8000";

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());

app.post("/compare", async (req, res) => {
  console.log("Request: ", req.body);
  const result = await compareImage(req.body);
  res.send({ "result": result });
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});