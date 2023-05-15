const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const { getNetworkIp } = require("./utils/os-utils");
const { handleWebhook } = require("./services/task");
const { return404 } = require("./middlewares/error");
const { blue } = require("kolorist");
const { cyan } = require("kolorist");

const PROTOCOL = "http";
const PORT = 10086;
const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../log/access.log'), {flags: 'a'});
app.use(morgan('short', {stream: accessLogStream}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use("*", (req, res, next) => {
  next();
});

app.get("/webhook", (req, res, next) => {
  handleWebhook(req, res);
});

app.use('*',(req,res,next)=>{
  return404(res)
})

app.listen(PORT, () => {
  const IPLIST = getNetworkIp();
  IPLIST.forEach((ip) => {
    const now = new Date().toLocaleString()
    const address = `${PROTOCOL}://${ip}:${PORT}`
    console.log(`[${now}] [INFO] Starting server at ${cyan(address)}`);
  });
});
