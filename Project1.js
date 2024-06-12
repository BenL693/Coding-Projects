const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path')

const app = express(); 

//Serve static files from the ./img directory 
app.use('/img', express.static(path.join(__dirname, 'img')));

app.post('/fileupload', async function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {
      if (err) {
        console.error('Error parsing form', err); 
        res.writeHead(500, {'Content-Type': 'text/plain'});
        return res.end('Internal Server Error');
      }

      const file = files.filetoupload[0]

      const fileName = file.originalFilename;
      const uploadPath = path.join(__dirname, "img", fileName);

      fs.renameSync(file.filepath, uploadPath); 

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('File uploaded successfully'); 
    });
});
app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

const port = process.env.PORT || 8080; 
app.listen(port, () => {
  console.log('Server is running on port ${port}'); 
}); 

