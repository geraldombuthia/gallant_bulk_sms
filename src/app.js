import express from "express";

const app = express();
const port = 3000;

app.route("/").get((req, res) => {
    res.status(200).json({msg:"Welcome to Gallant Byte SMS"});
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})