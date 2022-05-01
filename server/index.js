require('dotenv').config();
const express = require('express')
const cors = require('cors')
const {
    uploadFile, upload
} = require("./DropboxApi");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.post("/upload", upload.single('file'), (req, res) => {
    uploadFile(req.file.path, req.file.filename, res);
});