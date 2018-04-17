const chai = require('chai');

const request = require('request');

let allBlocks;
let nextBlock;
let blockString;

let nonce = -1;

let blockConfirmed = false;

let testArray = [['1', '0', '0', '1', '0', '1', '0', '1', '0', '1'],
                 ['6', '7', '7', '7', '7', '1', '8', '4', '7', '7'],
                 ['1', '0', '5', '1', '1', '0', '1', '0', '5', '1'],
                 ['1', '0', '1', '0', '3', '6', '7', '1', '1', '1'],
                 ['1', '1', '4', '1', '1', '2', '1', '1', '1', '1'],
                 ['1', '4', '9', '7', '1', '1', '6', '1', '0', '5'],
                 ['1', '1', '1', '1', '1', '0', '0', '9', '0', '5'],
                 ['3', '8', '6', '1', '1', '5', '2', '3', '8', '9'],
                 ['7', '4', '5', '0', '9', '1', '6', '1', '5', '2'],
                 ['3', '9', '0', '6', '6', '9', '3', '2', '8', '5'],
                 ['7', '1', '5']];


function getAllBlocks() {
    request.get("http://programmeren9.cmgt.hr.nl:8000/api/blockchain", (error, response, body) => {
        allBlocks = JSON.parse(body);
    });
}
//
// describe('fill array test', function () {
//     it('Last array should have 10 characters', function () {
//         chai.expect(fillChunks(testArray)[testArray.length -1]).to.have.lengthOf(10);
//     })
// });

// describe('Blockchain Tests', function () {
//     it('Should return an array', function () {

        getNextBlock();

        function getNextBlock() {
            request.get("http://programmeren9.cmgt.hr.nl:8000/api/blockchain/next", (error, response, body) => {
                nextBlock = JSON.parse(body);

                console.log(nextBlock.blockchain);

                blockString = nextBlock.blockchain.hash +
                    nextBlock.blockchain.data[0].from +
                    nextBlock.blockchain.data[0].to +
                    nextBlock.blockchain.data[0].amount +
                    nextBlock.blockchain.data[0].timestamp +
                    nextBlock.blockchain.timestamp +
                    nextBlock.blockchain.nonce;

                console.log(blockString);

                //to make blockstring immutable
                blockString = Object.freeze(blockString);

                convertStringToAscii(blockString);
                //actual unit test
                // chai.expect(convertStringToAscii(blockString)).to.be.a('array');
            });
        }
//     });
// });

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

    return charArray;
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
            let addedEntry = fillingz.toString();
            item.splice(item.length, 0, addedEntry);
            fillingz++;
        }
        filledArray.push(item);
    }

    // Tijdens testen dit uitvoeren
    // return filledArray;

    addUp(filledArray);
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

    console.log('calculatedArray = ', calculatedArray);

    let originalArray = calculatedArray.slice();

    let binaryArray = [];

    let placement = 0;

    let tail = [];

    for (let i = 1; i < calculatedArray.length; i++) {

        //starts at calculatedArray[0] and sums up with entries later in the collection
        if (calculatedArray[0] + calculatedArray[i] === 10) {

            // doing +1 so it ignores the first item in tail, we don't need that
            tail.push(calculatedArray.slice(i + 1, calculatedArray.length));

            if (calculatedArray[0] > calculatedArray[i]) {
                // copying for matching purposes
                binaryArray.splice(placement, 0, 1, 0);
            }
            // example: 1 + 9 = 10, so placement in array becomes [0, 1, etc]
            else {
                binaryArray.splice(placement, 0, 0, 1);
            }

            calculatedArray.splice(i, 1);
            calculatedArray.splice(0, 1);

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
            i = 1;
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
    if (calculatedArray.length > 0) {
        binaryArray.splice(placement, 0, calculatedArray[0]);
        calculatedArray.splice(0, 1);
    }


    console.log('Original array was: ', originalArray);
    console.log('binaryArray is: ', binaryArray);
    checkIfBinary(binaryArray);
}


function checkIfBinary(binaryArray) {

    for (let item of binaryArray) {

        if (item !== 1 && item !== 0) {
            nonce++;
            let newBlockString = blockString + nonce;
            console.log(newBlockString);
            setTimeout(() => {
                convertStringToAscii(newBlockString)
            }, 0);
            return false;
        }
    }


    console.log('binaryArray is: ', binaryArray);

    let oldHash = binaryArray.toString().replace(/,/g, "");

    if (blockConfirmed === true) {
        console.log('Block is found, carry on.');
        console.log('nonce is: ', nonce);
        postBlock();

    } else {
        console.log('parsing old hash');
        newBlock(oldHash);
    }
}


function newBlock(oldHash) {

    console.log(oldHash);
    request.get("http://programmeren9.cmgt.hr.nl:8000/api/blockchain/next", (error, response, body) => {
        nextBlock = JSON.parse(body);

        console.log(nextBlock);

        blockString = oldHash +
            nextBlock.transactions[0].from +
            nextBlock.transactions[0].to +
            nextBlock.transactions[0].amount +
            nextBlock.transactions[0].timestamp +
            nextBlock.timestamp;

        //to make blockstring immutable
        blockString = Object.freeze(blockString);

        console.log(blockString);

        blockConfirmed = true;

        convertStringToAscii(blockString);
    });
}

function postBlock() {

    console.log('nonce is: ', nonce);

    let formData = {
        user: '0905386',
        nonce: nonce
    };

    request.post({
            url: 'http://programmeren9.cmgt.hr.nl:8000/api/blockchain/',
            form: formData
        },
        function (err, httpResponse, body) {
            console.log(err, body);
        });
}


