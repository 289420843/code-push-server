var express = require('express');
const path = require('path');
var fs = require('fs');
var models = require('../models');
var router = express.Router();
var multer = require('multer');

let apkDiskTemp = '../apkFiles/temp';
let apkDisk = '../apkFiles';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, apkDiskTemp)
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    var fileName = file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1];
    cb(null, fileName);
    if (req.body.files) {
      req.body.files.push(fileName);
    } else {
      req.body.files = [fileName];
    }

  }
});
var multer = multer({
  storage: storage
});
var upload = multer.single('file');
router.post('/uploadApk', (req, res) => {
  let fileName = "";
  upload(req, res, function (err) {
    //添加错误处理
    if (err) {
      return console.log(err);
    }
    // 转移文件
    let fileFormat = (req.body.files[0]).split(".");
    var fileExt = fileFormat[fileFormat.length - 1];
    var appName = req.body.appName;
    var appVersion = req.body.appVersion;
    var latest = req.body.latest;

    var readStream = fs.createReadStream(path.resolve(__dirname, apkDiskTemp, req.body.files[0]));
    var writeStream = fs.createWriteStream(path.resolve(__dirname, apkDisk, appName + "." + appVersion + "." + fileExt));
    readStream.pipe(writeStream);
    if (latest) {
      var latestStream = fs.createWriteStream(path.resolve(__dirname, apkDisk, appName + ".latest." + fileExt));
      readStream.pipe(latestStream);
    }
    readStream.destroy();
    fs.unlinkSync(path.resolve(__dirname, apkDiskTemp, req.body.files[0]));
    //文件信息在req.file或者req.files中显示。
    res.send({d: 123})
  });
});
router.post("/getLatestVersion", (req, res) => {
  var deploymentKey = req.body.deploymentKey;
  models.Deployments.findOne({where: {deployment_key: deploymentKey}}).then((data) => {
    if (data) {
      models.DeploymentsVersions.findOne({
        where: {deployment_id: data.dataValues.id},
        order: [["created_at", "DESC"]]
      }).then((deploymentsVersion) => {
        if (deploymentsVersion) {
          res.send({Data: deploymentsVersion.dataValues, Success: true,});
        } else {
          res.send({Data: null, Success: true,});
        }
      }).catch(() => {
        res.send({Data: null, Success: true,});
      })
    } else {
      res.send({Data: null, Success: true,});
    }
  }).catch(() => {
    res.send({Data: null, Success: true,});
  })
});


module.exports = router;
