module.exports = function(app, db, md5) {
  const cryptr = require('cryptr')
  const fs = require("fs");
  const path = require('path');
  const appDir = path.dirname(require.main.filename);
  console.log(appDir)
  const apis = fs.readdirSync(`${appDir}/api`).filter((file) => file.endsWith(".js"));

  for (api of apis) {
    require(`${appDir}/api/${api}`)(app, db, cryptr);
  }
};