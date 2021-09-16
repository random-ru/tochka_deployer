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
    return res.json({
      response: "Нихуя",
    });
  }

  try {
    cp.execSync(`ssh -p ${SSH_PORT} ${SSH_HOST} '
      cd tochka_bot;
      git pull;
      docker-compose down;
      docker-compose build;
      docker-compose up -d;
    '`);
    return res.json({
      response: "Готово",
    });
  } catch (error) {
    return res.json({
      response: "Ошибка",
    });
  }
});

app.listen(5469, "0.0.0.0");
