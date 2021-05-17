// var page = require('webpage').create();
// //var webdomain='http://example.org/';
// var fs = require('fs');

// filedata = fs.read('websites.txt'); // read the file into a single string
// arrdata = filedata.split(/[\r\n]/); // split the string on newline and store in array


// for (var i = 0; i < arrdata.length - 1; i++) {

//     // show each line 
//     var newurl = 'http://' + arrdata[i] + '/';
//     newurl = newurl.replace(/\s+/g, '');
//     arrdata[i] = newurl;
//     webdomain = arrdata[i];
//     var page = require('webpage').create();
//     page.open(webdomain, function (status) {

//         console.log("Status:" + status);
//         if (status === "success") {
//             page.render('ttttxt.png');
//             var mytext = page.plainText;
//             console.log(webdomain);
//         }
//         console.log(mytext);
//         phantom.exit();
//     });

// }


const fs = require('fs');
const phantom = require('phantom');

async function scrape() {
    //read the file into a single string
    // Not optimised for a large file..
    const filedata = fs.readFileSync('websites.txt', 'utf-8');

    // split the string on newline and store in array
    const arrdata = filedata.split(/[\r\n]/);
    // console.log(arrdata)

    const instance = await phantom.create()
    for (var i = 0; i < arrdata.length - 1; i++) {

        // show each line 
        var newurl = 'http://' + arrdata[i] + '/';
        newurl = newurl.replace(/\s+/g, '');
        arrdata[i] = newurl;
        webdomain = arrdata[i];
        console.log(webdomain)

        const page = await instance.createPage()

        await page.on('onResourceRequested', function (requestData) {
            // console.info('Requesting', requestData.url);
        });

        const status = await page.open(webdomain);
        if (status === 'success') {
            const content = await page.property('content');
            fs.writeFileSync(`${i}.html`, content)
            console.log(content);
        }
    }
    await instance.exit()
}


scrape()