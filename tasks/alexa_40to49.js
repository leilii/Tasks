const fs = require('fs');
const fetch = require('node-fetch');
const unzipper = require('unzipper');
const csv2 = require('csv2');
const AbortController = require('abort-controller');

const URL = 'http://s3.amazonaws.com/alexa-static/top-1m.csv.zip';

async function download(destFileName,f,l) { 
   const controller = new AbortController();
   fetch(URL, { signal: controller.signal }) 
       .then(res => { 
           let counter = 1; 
           const dest = fs.createWriteStream(destFileName); 
              res.body 
                 .pipe(unzipper.ParseOne()) 
                 .pipe(csv2()) 
                 .on('data', (d) => { 
                 if (counter <= l) {
                    if (counter>=f){
                     dest.write(d[1] + '\n'); }
                     counter++; 
                    if (counter > l) { 
                        dest.close(); 
                        return controller.abort() 
                        } 
                      
                      }
                    }) 
               }) 
               .catch(console.err) 
               .finally(_ => { 
                        // Cleanup 
                 })
 }
// Download top 10.. and save it in websites.txt
download('alexa_40to49.txt',40, 49)



