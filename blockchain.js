function convertStringToAscii(input) {

    // remove all spaces and place it in an array
    const stringArray = input.replace(/\s+/g, '');

    // create new empty array
    const charArray = [];

    //loop through original array
    for (let i = 0; i < stringArray.length; i++) {
        if (!isNaN(stringArray[i])) {
            charArray.push(Number(stringArray[i]));
        } else {
            for (let item of stringArray[i].charCodeAt(0).toString().split('')) {
                charArray.push(item);
            }
        }
    }
    console.log(charArray);
}

convertStringToAscii('met cijfer 2 erin');