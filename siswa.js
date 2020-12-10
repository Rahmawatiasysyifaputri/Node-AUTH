const Cryptr = require('cryptr')
const cryptr = new Cryptr("6969696809")
module.exports =
  function(app, db) {
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
          let decryptToken = crypt.decrypt(token)

          // sql cek id_user
          let sql = "select * from user where ?"

          // set parameter
          let param = {
            id_user: decryptToken
          }

          // run query
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

    app.get("/siswa", validateToken(), (req, res) => {
      let sql = "select * from siswa";

      db.query(sql, (error, result) => {
        let response = null;
        if (error) {
          response = {
            message: error.message,
          };
        } else {
          response = {
            count: result.length,
            siswa: result,
          };
        }
        res.json(response);
      });
    });

    app.get("/siswa/:id", validateToken(), (req, res) => {
      let data = {
        id_siswa: req.params.id,
      };

      let sql = "select * from siswa where ?";

      db.query(sql, data, (error, result) => {
        let response = null;
        if (error) {
          response = {
            message: error.message,
          };
        } else {
          response = {
            count: result.length,
            siswa: result,
          };
        }
        res.json(response);
      });
    });

    app.post("/siswa", validateToken(), (req, res) => {
      let data = {
        nis: req.body.nis,
        nama_siswa: req.body.nama_siwa,
        kelas: req.body.kelas,
        poin: req.body.poin,
      };

      let sql = "insert into siswa set ?";

      db.query(sql, data, (error, result) => {
        let response = null;
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

    //プットオプション
    app.put("/siswa", validateToken(), (req, res) => {
      let data = [{
          nis: req.body.nis,
          nama_siswa: req.body.nama_siswa,
          kelas: req.body.kelas,
          poin: req.body.poin,
        },
        {
          id_siswa: req.body.id_siswa,
        },
      ];

      let sql = "update siswa set ? where ?";

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

    app.delete("/siswa/:id", validateToken(), (req, res) => {
      let data = {
        id_siswa: req.params.id,
      };

      let sql = "delete from siswa where ?";

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
  }