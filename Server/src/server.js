import express from "express"
import { ENV } from "./lib/env.js";
const app = express();

app.get("/", (req, res) => { res.status(200).json({ msg: "Server is sending api response." }) });

app.listen(ENV.PORT, () =>
    console.log("Server running is on port  ")
) 