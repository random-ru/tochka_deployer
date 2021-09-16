//@ts-check
const express = require("express");
const cp = require("child_process");

const secret = process.env.SECRET;
const SSH_HOST = process.env.SSH_HOST;
const SSH_PORT = process.env.SSH_PORT;

const app = express();

app.use(express.json());

app.post("/hui", (req, res) => {
  const requestSecret = req.headers["secret"];

  if (requestSecret !== secret) {
    return res.status(400).json({
      response: "Нихуя",
    });
  }

  try {
    const env = req.body.env;

    const envString = Object.values(env)
      .map((entry) => entry.join("="))
      .join("\n");

    cp.execSync(`ssh -p ${SSH_PORT} ${SSH_HOST} '
      cd tochka_bot;
      docker-compose down;
      git pull;
      rm .env;
      echo '${envString}' > .env;
      docker-compose build;
      docker-compose up -d;
    '`);
    return res.json({
      response: "Готово",
    });
  } catch (error) {
    return res.status(400).json({
      response: "Ошибка",
    });
  }
});

app.listen(5469, "0.0.0.0");
