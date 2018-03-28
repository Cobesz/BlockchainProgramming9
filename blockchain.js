const request = require('request');

let allBlocks;
let nextBlock;

function getAllBlocks() {
    request.get("http://programmeren9.cmgt.hr.nl:8000/api/blockchain", (error, response, body) => {
        allBlocks = JSON.parse(body);
        // console.log(allBlocks);

    });
}


function getNextBlock() {
    request.get("http://programmeren9.cmgt.hr.nl:8000/api/blockchain/next", (error, response, body) => {
        nextBlock = JSON.parse(body);
        // console.log(nextBlock.transactions);

        convertStringToAscii('met cijfer 2 erin');
        // console.log(response);
    });
}

getNextBlock();
getAllBlocks();



function convertStringToAscii(input) {

    // remove all spaces and place it in an array
    const stringArray = input.replace(/\s+/g, '');

    // create new empty array
    const charArray = [];

    //loop through original array
    for (let i = 0; i < stringArray.length; i++) {
        if (!isNaN(stringArray[i])) {
            charArray.push(stringArray[i]);
        } else {
            for (let item of stringArray[i].charCodeAt(0).toString().split('')) {
                charArray.push(item);
            }
        }
    }
    // console.log(charArray);
}



