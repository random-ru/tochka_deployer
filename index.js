//@ts-check
const express = require("express");
const cp = require("child_process");

const secret = process.env.SECRET;

const app = express();

app.get("/hui", (req, res) => {
  const requestSecret = req.headers["secret"];

  if (requestSecret !== secret) {
    return;
  }

  cp.execSync("docker-compose -f ./target.yml down");
  cp.execSync("docker-compose -f ./target.yml build");
  cp.execSync("docker-compose -f ./target.yml up -d");
});

app.listen(5469, "0.0.0.0");
