import express from "express";

const app = express();
const port = 3000;

app.route("/").get((req, res) => {
    // console.log(req.headers);
    const {host, connection, "cache-control": cacheControl, "user-agent":userAgent} = req.headers;
    // console.log(req.headers);
    console.log(host, connection, cacheControl, userAgent);

    console.log("\n\n" + userAgent);
    res.status(200).json({msg:"Welcome to Gallant Byte SMS"});
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port: ${port}`);
});