var fs=require('fs');

fs.readFile('image.jpg', function(error, buffer){
    console.log('arquivo lido');

    fs.writeFile('image2.jpg', buffer, function(err){
        console.log('arquivo escrito');
    });
});