var fs = require('fs');

fs.createReadStream('image.jpg')
.pipe(fs.createWriteStream('imagem-com-stream.jpg'))
.on('finish',function(){
    console.log('acabou');
});