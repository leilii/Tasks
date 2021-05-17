const fs = require('fs');
const readline = require('readline')
const phantom = require('phantom');

async function scrape(url) {
    console.log(`Starting: ${url}`)
    return new Promise(async (resolve, reject) => {
        try {
            const instance = await phantom.create()
            const page = await instance.createPage()
            await page.on('onResourceRequested', function (requestData) {
                // console.info('Requesting', requestData.url);
            });
            const status = await page.open(url);
            if (status === 'success') {
                const content = await page.property('content');
                await instance.exit()
                return resolve(content)
            }
            return resolve(status)
        } catch (e) {
            reject(e)
        }
    })
}

// Achieve parallelism..
function websitePageDownload(filename, callbackFn) {
    const rI = readline.createInterface({
        input: fs.createReadStream(filename),
        output: null,
        console: false
    });
    rI.on('line', function (line) {
        if (!line || line === '')
            return
        let url = `http://${line}/`;
        url = url.replace(/\s+/g, '');
        scrape(url).then(data => {
            callbackFn(line, data)
        }).catch(console.err)
    });
}


// Saving pages to file..
function callbackFn(url, data) {
    console.log('Finished: ', url)
    fs.writeFileSync(`${url}.html`, data)
}


websitePageDownload('alexa_40to49.txt', callbackFn)






