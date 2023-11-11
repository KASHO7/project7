var randomBytes = require("crypto").randomBytes;
var createHash = require("crypto").createHash;


function makePasswordEntry(clearTextPassword) {
    let passwordEntry = {};
    passwordEntry.salt = randomBytes(16).toString('binary');
    let salted = clearTextPassword.concat(passwordEntry.salt);
    let input = createHash("sha1");
    input.update(salted);
    passwordEntry.hash = input.digest("hex");
    return passwordEntry;
}


function doesPasswordMatch(hash, salt, clearTextPassword) {
    let input = createHash("sha1");
    let salted = clearTextPassword.concat(salt);
    input.update(salted);
    let digest = input.digest("hex");
    if (digest === hash) {
        return true;
    } else {
        return false;
    }
}

module.exports =  {makePasswordEntry,doesPasswordMatch};