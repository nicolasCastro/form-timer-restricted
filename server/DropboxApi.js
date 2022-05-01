require('dotenv').config();
const https = require("https");
const JSONbig = require('json-bigint');
const multer = require('multer');
fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'test/')
    },
    filename: (req, file, cb) => {
        var filename = `${req.body.username}_${Date.now()}_${file.originalname}`;
        cb(null, filename)
    },
})

const upload = multer({ storage: storage })

const uploadFile = (filePath, fileName, response) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) response.status(500).json({ message: "File not found" });
        const req = https.request('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
                'Dropbox-API-Arg': JSON.stringify({
                    'path': `/Aplicaciones/Technical Test Repository/${fileName}`,
                    'mode': 'overwrite',
                    'autorename': true,
                    'mute': false,
                    'strict_conflict': false
                }),
                'Content-Type': 'application/octet-stream',
            }
        }, (res) => {
            console.log("statusCode: ", res.statusCode);

            res.on('data', function (d) {
                process.stdout.write(d);
            });

            fs.unlink(filePath, function (err, data) {
                if (err) response.status(500).json({ message: "File not found" });
                else response.json({ message: "Upload successfully!" });
            })
        });

        req.write(data);
        req.end();
    });
}

module.exports = {
    upload,
    uploadFile
}