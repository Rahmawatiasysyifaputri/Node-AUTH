const { app, md5 } = require("./config/init");
const { db } = require("./config/db");
require("./config/dynamicApi")(app, db, md5);

//どうぞよろしくお願いいたします～