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

        let blockString = nextBlock.blockchain.hash +
            nextBlock.transactions[0].from +
            nextBlock.transactions[0].to +
            nextBlock.transactions[0].amount +
            nextBlock.transactions[0].timestamp +
            nextBlock.blockchain.timestamp +
            nextBlock.blockchain.nonce;

        console.log(blockString);

        //actual string
        // convertStringToAscii(blockString);

        // test string
        convertStringToAscii('1010010101CMGT Mining CorporationBas11517925926858151792655130223')
        // convertStringToAscii('test')
    });
}

getNextBlock();

// getAllBlocks();

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

    splitInTen(charArray);
}

function splitInTen(charArray) {

    let chunk = 10;
    let chunkedArray = [];

    if (charArray.length === 10) {
        return charArray;
    }

    for (let i = 0; i < charArray.length; i += chunk) {
        let tempArray = charArray.slice(i, i + chunk);
        chunkedArray.push(tempArray);
    }
    fillChunks(chunkedArray);
}

function fillChunks(chunkedArray) {

    let fillingz = 0;
    let filledArray = [];

    // if array is smaller than 10 items, fill it.
    for (let item of chunkedArray) {
        while (item.length !== 10) {
            // let addedEntry = fillingz.toString();
            let addedEntry = fillingz.toString();
            item.splice(item.length, 0, addedEntry);
            fillingz++;
        }
        filledArray.push(item);
    }
    // console.log(chunkedArray);
    addUp(chunkedArray);
}


function addUp(formattedArrays) {
    console.log('new loop');

    // exit condition
    if (formattedArrays.length === 1) return;

    //first 2 entries of total package
    let arrayA = formattedArrays[0];
    let arrayB = formattedArrays[1];

    // place summed up arrays in this.
    let mergedArray = [];

    for (let i = 0; i < arrayA.length; i++) {
        let sum = Number(arrayA[i]) + Number(arrayB[i]);
        mergedArray.push(sum.toString());
    }
    // console.log(mergedArray);

    formattedArrays.splice(0, 2);
    formattedArrays.splice(0,0, mergedArray);

    console.log(formattedArrays);
    return addUp(formattedArrays)

}




