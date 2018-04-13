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

        //to make blockstring immutable
        blockString = Object.freeze(blockString);
        console.log(blockString);

        //actual string
        // convertStringToAscii(blockString);

        // test string
        // convertStringToAscii('1010010101CMGT Mining CorporationBas11517925926858151792655130223')
        convertStringToAscii('text')
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
    addUp(chunkedArray);
}


function addUp(formattedArrays) {

    // exit condition
    if (formattedArrays.length === 1) {
        checkForTens(formattedArrays[0]);
        return;
    }


    //first 2 entries of total package
    let arrayA = formattedArrays[0];
    let arrayB = formattedArrays[1];

    // place summed up arrays in this.
    let mergedArray = [];

    for (let i = 0; i < arrayA.length; i++) {
        let sum = (Number(arrayA[i]) + Number(arrayB[i])) % 10;
        mergedArray.push(sum);
    }

    formattedArrays.splice(0, 2);
    formattedArrays.splice(0, 0, mergedArray);

    return addUp(formattedArrays)
}

function checkForTens(calculatedArray) {

    let originalArray = calculatedArray.slice();

    let binaryArray = [];

    let placement = 0;

    let tail = [];

    for (let i = 0; i < calculatedArray.length; i++) {

        //starts at calculatedArray[0] and sums up with entries later in the collection
        if (calculatedArray[0] + calculatedArray[i] === 10) {

            // doing +1 so it ignores the first item in tail, we don't need that
            tail.push(calculatedArray.slice(i + 1, calculatedArray.length));

            calculatedArray.splice(i, 1);
            calculatedArray.splice(0, 1);

            if (calculatedArray[0] < calculatedArray[i]) {
                // copying for matching purposes
                binaryArray.splice(placement, 0, 1, 0);
            }
            // example: 1 + 9 = 10, so placement in array becomes [0, 1, etc]
            else {
                binaryArray.splice(placement, 0, 0, 1);
            }

            let n = 0;
            for (let item of tail[0]) {
                calculatedArray.splice(n, 0, item);
                n++
            }
            // removing tail from the end of the hash
            calculatedArray.splice(-tail[0].length, tail[0].length);

            //resetting tail to build the new one.
            tail = [];

            placement += 2;
            i = 0;
        } else {
            // No match found
            if (i === calculatedArray.length - 1) {

                binaryArray.splice(placement, 0, calculatedArray[0]);
                calculatedArray.splice(0, 1);

                placement++;
                // Resetting iterator to redo the loop.
                i = 0;
            }
        }
    }
    binaryArray.splice(placement, 0, calculatedArray[0]);
    calculatedArray.splice(0, 1);

    console.log('Original array was: ', originalArray);

    console.log('binaryArray is: ', binaryArray);
}




