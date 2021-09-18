//@ts-check
const express = require("express");
const cp = require("child_process");
const lodash = require("lodash");

const secret = process.env.SECRET;
const SSH_HOST = process.env.SSH_HOST;
const SSH_PORT = process.env.SSH_PORT;

const app = express();

app.use(express.json());

app.post("/hui", (req, res) => {
  const requestSecret = req.headers["secret"];

  if (requestSecret !== secret) {
    console.log("🤡🤡🤡 Атака 🤡🤡🤡");
    res.status(400);
    return res.json({
      response: "Нихуя",
    });
  }

  try {
    const env = req.body.env;
    const separator = "228randomru228";

    const envString = Object.entries(env)
      .map((entry) => entry.join("="))
      .join(separator);

    const chunks = lodash.chunk(envString, 500).map((ch) => ch.join(""));

    cp.execSync(`ssh -p ${SSH_PORT} ${SSH_HOST} '
      source .zshrc;
      cd tochka_bot;
      rm -f ./.env;
      ${chunks.map((ch) => `printf ${ch} >> .env;`).join("\n")}
      FILENAME=.env SEPARATOR=${separator} npx -y env-enjoyer;
      echo "\n" >> .env;
      git pull;
      docker-compose down;
      docker-compose build;
      docker-compose up -d;
    '`);
    return res.json({
      response: "Готово",
    });
  } catch (error) {
    console.log(error);

    res.status(400);
    return res.json({
      response: "Ошибка",
    });
  }
});

app.listen(5469, "0.0.0.0");
