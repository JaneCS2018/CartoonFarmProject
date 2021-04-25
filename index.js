const fs = require('fs')
const http=require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');


///////////////File

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn);

// const textOut = `This is what we know about the avocade: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written!')

//Non-blocking, asychronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=>{

//     if (err) return console.log('Error! 💥')

//     fs.readFile('./txt/${data1}.txt', 'utf-8', (err, data2)=>{
//         console.log(data2) // After the readfile function runs, callback function starts to read data
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=>{
//             console.log(data3)
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err=>{
//                 //Ctrl command + space
//                 console.log("Your file has been written 😊")
//             });
//         });
//     });
// });
// console.log('Will read file')

//only execute once ---- put it to global, readFileSync (Call one time, no need to wait for other function to call)

const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));

console.log(slugs)

// Create SERVER
const server = http.createServer((req, res) =>{
    const {query, pathname} =url.parse(req.url, true);
    
    //Overview  page
    if (pathname ==='/'|| pathname==='/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el=> replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    
    //Product page    
    }else if (pathname==='/product'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    
    //API
    }else if (pathname ==='/api'){  
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    
     //Not Found
    }else{
        res.writeHead(404, {
            'Content-type':'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
})

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to request on port 8000'); // event loop running
})




