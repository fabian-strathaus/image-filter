import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage", async (req: Request, res: Response) => {
  if (!req.query.image_url) {
    return res
      .status(400)
      .send(
        "No query parameter image_url provided! Try /filteredimage?image_url=.%2Fdeployment_screenshots%2FEXAMPLE_PLEASE_MAKE_YOUR_OWN.png"
      );
  }
  try {
    const imageURL = await filterImageFromURL(req.query.image_url);
    res.sendFile(imageURL, () => {
      deleteLocalFiles([imageURL]);
    });
  } catch (err) {
    res
      .status(404)
      .send(
        "No image found! Try /filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg"
      );
  }
});

// Root Endpoint
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
