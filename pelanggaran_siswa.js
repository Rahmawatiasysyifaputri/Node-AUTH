const md5 = require("md5");　//だたバスと
const moment = require("moment");
const Cryptr = require('cryptr')
const cryptr = new Cryptr("6969696809")　//クリニック2月
module.exports = function(app, db) {
  validateToken = () => {
    return (req, res, next) => {
      // cek keberadaan "Token" pada request header
      if (!req.get("Token")) {
        // jika "Token" tidak ada　（木）
        res.json({
          message: "Access Forbidden"
        })
      } else {
        // tampung nilai Token
        let token = req.get("Token")

        // decrypt token menjadi id_user　2丁目
        let decryptToken = cryptr.decrypt(token)

        // sql cek id_user
        let sql = "select * from user where ?"

        // set parameter　（月）
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

  //ポイント-->
  app.post("/pelanggaran_siswa", validateToken(), (req, res) => {
    let data = {
      id_siswa: req.body.id_siswa,
      id_user: req.body.id_user,
      waktu: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    let pelanggaran = JSON.parse(req.body.pelanggaran);
    let sql = "insert into pelanggaran_siswa set ?";

    db.query(sql, data, (error, result) => {
      let response = null;

      if (error) {
        res.json({
          message: error.message
        });
      } else {
        let lastID = result.insertId;

        let data = [];
        for (let index = 0; index < pelanggaran.length; index++) {
          data.push([lastID, pelanggaran[index].id_pelanggaran]);
        }

        let sql = "insert into detail_pelanggaran_siswa values ?";

        db.query(sql, [data], (error, result) => {
          if (error) {
            res.json({
              message: error.message
            });
          } else {
            res.json({
              message: "Data Has Been Inserted!"
            });
          }
        });
      }
    });
  });

  //ゲット一番
  app.get("/pelanggaran_siswa", validateToken(), (req, res) => {
    let sql = `select p.id_pelanggaran_siswa, p.id_siswa,p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user
        from pelanggaran_siswa p join siswa s on p.id_siswa = s.id_siswa
        join user u on p.id_user = u.id_user`;

    db.query(sql, (error, result) => {
      if (error) {
        res.json({
          message: error.message
        });
      } else {
        res.json({
          count: result.length,
          pelanggaran_siswa: result,
        });
      }
    });
  });

  //ゲットする:))
  app.get("/pelanggaran_siswa/:id", validateToken(), (req, res) => {
    let param = {
      id_pelanggaran_siswa: req.params.id
    }

    let sql = "select p.nama_pelanggaran, p.poin " +
      "from detail_pelanggaran_siswa dps join pelanggaran p " +
      "on p.id_pelanggaran = dps.id_pelanggaran " +
      "where ?"

    db.query(sql, param, (error, result) => {
      if (error) {
        res.json({
          message: error.message
        })
      } else {
        res.json({
          count: result.length,
          detail_pelanggaran_siswa: result
        })
      }
    })
  })

  //削除する

  app.delete("/pelanggaran_siswa/:id", validateToken(), (req, res) => {
    let param = {
      id_pelanggaran_siswa: req.params.id
    }

    let sql = "delete from detail_pelanggaran_siswa where ?"

    db.query(sql, param, (error, result) => {
      if (error) {
        res.json({
          message: error.message
        })
      } else {
        let param = {
          id_pelanggaran_siswa: req.params.id
        }
      }

      let sql = "delete from pelanggaran_siswa where ?"

      db.query(sql, param, (error, result) => {
        if (error) {
          res.json({
            message: error.message
          })
        } else {
          res.json({
            message: "Data Has Been Deleted!"
          })
        }
      })

    })
  })
};