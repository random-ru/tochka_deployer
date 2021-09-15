//@ts-check
const express = require("express");
const cp = require("child_process");

const secret = process.env.SECRET;
const SSH_HOST = process.env.SSH_HOST;
const SSH_PORT = process.env.SSH_PORT;

const app = express();

app.get("/hui", (req, res) => {
  const requestSecret = req.headers["secret"];

  if (requestSecret !== secret) {
    return;
  }

  cp.execSync(`ssh -p ${SSH_PORT} ${SSH_HOST} '
  cd tochka_deployer;
  docker-compose -f ./target.yml down;
  docker-compose -f ./target.yml build;
  docker-compose -f ./target.yml up -d;
'`);
});

app.listen(5469, "0.0.0.0");
