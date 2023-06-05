// const express = require('express');
// const AWS = require('aws-sdk');
// const fs = require('fs');
// const bodyParser = require('body-parser');
// const app = express();
// const port = 5000;

// app.use(bodyParser.json());

// // Set up AWS S3 client
// const s3 = new AWS.S3({
//     accessKeyId: "AKIAXWEQD3QLRVOKH5WF",
//           secretAccessKey: "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",
// });

// app.post('/upload', (req, res) => {
//   const { filePath, fileName, bucketName } = req.body;
  
//   // Read the file from the local path
//   const fileContent = fs.readFileSync(filePath);
  
//   // Upload the file to S3 bucket
//   const uploadParams = {
//     Bucket: bucketName,
//     Key: fileName,
//     Body: fileContent
//   };
//   // console.log("fil",req.body);
//   s3.upload(uploadParams, (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Failed to upload file' });
//     }
    
//     // Get the public URL of the file
//     const urlParams = {
//       Bucket: bucketName,
//       Key: fileName,
//     };

//     s3.getSignedUrl('getObject', urlParams, (err, url) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Failed to get file URL' });
//       }
//       console.log(`File uploaded to S3: ${data.Location}`);
//       console.log(`Public URL of the file: ${url}`);
//       res.json({ message: 'File uploaded successfully', fileUrl: url });
//     });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`)
// });

const multer = require('multer');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });
const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const cors = require('cors');
const dotenv = require('dotenv')

app.use(cors());
dotenv.config();

app.use(bodyParser.json());

// Set up AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});


app.post('/upload', upload.single('file'), (req, res) => {
  const { filename, mimetype, path } = req.file;
  const bucketName = process.env.bName;

  // Upload the file to S3 bucket
  const uploadParams = {
    Bucket: process.env.bName,
    Key: filename,
    Body: fs.createReadStream(path),
    ContentType: mimetype
  };

  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to upload file' });
    }

    // Get the public URL of the file
    const urlParams = {
      Bucket: bucketName,
      Key: filename,
    };

    s3.getSignedUrl('getObject', urlParams, (err, url) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to get file URL' });
      }
      console.log(`File uploaded to S3: ${data.Location}`);
      console.log(`Public URL of the file: ${url}`);
      res.json({ message: 'File uploaded successfully', fileUrl: url });
    });
  });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  });

  app.use('/',(req,res) => res.send("Welcome to get the S3 bucket Url..."))