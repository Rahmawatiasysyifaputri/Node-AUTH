const md5 = require("md5");
const Cryptr = require('cryptr')
const cryptr = new Cryptr("6969696809")
module.exports = function(app, db) {
  validateToken = () => {
    return (req, res, next) => {
      // cek keberadaan "Token" pada request header
      if (!req.get("Token")) {
        // jika "Token" tidak ada
        res.json({
          message: "Access Forbidden"
        })
      } else {
        // tampung nilai Token
        let token = req.get("Token")

        // decrypt token menjadi id_user
        let decryptToken = cryptr.decrypt(token)

        // sql cek id_user
        let sql = "select * from user where ?"

        // set parameter
        let param = {
          id_user: decryptToken
        }

        // run query　ちょっと待って
        db.query(sql, param, (error, result) => {
          if (error) throw error
          // cek keberadaan id_user
          if (result.length > 0) {
            // id_user tersedia
            next()
          } else {
            // jika user tidak tersedia
            res.json({
              message: "Invalid Token"
            })
          }
        })
      }

    }
  }

  //ゲットする-->
  app.get("/user", validateToken(), (req, res) => {
    let sql = "select * from user";

    db.query(sql, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          count: result.length,
          user: result,
        };
      }
      res.json(response);
    });
  });

  app.get("/user/:id", validateToken(), (req, res) => {
    let data = {
      id_user: req.params.id,
    };

    let sql = "select * from user where ?";

    db.query(sql, data, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          count: result.length,
          user: result,
        };
      }
      res.json(response);
    });
  });

  app.post("/user", validateToken(), (req, res) => {
    const {
      nama_user,
      username,
      password
    } = req.body;
    let data = {
      nama_user,
      username,
      password: md5(password)
    };

    let sql = "insert into user set ?";

    db.query(sql, data, (error, result) => {
      let response = null;　//ぬっろ
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          message: result.affectedRows + " Data Inserted!",
        };
      }
      res.json(response);
    });
  });

  app.put("/user", validateToken(), (req, res) => {
    let data = [{
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: req.body.password,
      },
      {
        id_user: req.body.id_user,
      },
    ];

    let sql = "update user set ? where ?";

    db.query(sql, data, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          message: result.affectedRows + " Data Updated!",
        };
      }
      res.json(response);
    });
  });

  app.delete("/user/:id", validateToken(), (req, res) => {
    let data = {
      id_user: req.params.id_user,
    };

    let sql = "delete from user where ?";

    db.query(sql, data, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          message: result.affectedRows + " Data Deleted!",
        };
      }
      res.json(response);
    });
  });

  // endpoint login user (authentication)
  app.post("/user/auth", (req, res) => {
    // tampung username dan password
    let param = [
      req.body.username, //username
      md5(req.body.password) // password
    ]
    // create sql query
    let sql = "select * from user where username = ? and password = ?"

    // run query
    db.query(sql, param, (error, result) => {
      if (error) throw error

      // cek jumlah data hasil query
      if (result.length > 0) {
        // user tersedia
        res.json({
          message: "Logged",
          token: cryptr.encrypt(result[0].id_user), // generate token　点描
          data: result
        })
      } else {
        // user tidak tersedia
        res.json({
          message: "Invalid username/password"
        })
      }
    })
  })　//頑張って❕

};