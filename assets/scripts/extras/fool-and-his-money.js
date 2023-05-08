// Check password formatting.
const keyPass = document.getElementById('keyPass');
keyPass.oninput = (e) => { e.target.value = keyCheck(e.target.value); };
const keyCheck = (v) => {
  const m = v.replace(/\W/g, '').match(/^([a-zA-Z]{0,3})?(\d{0,3})?([a-zA-Z]{0,3})?/);
  let r = ''; if (m[1]) {
    r += m[1];
    if (m[2] && m[1].length == 3) {
      r += `-${m[2]}`;
      if (m[3] && m[2].length == 3) {
        r += `-${m[3]}`;
      }
    }
  } return r.toUpperCase();
}

const keyGenerate = () => {
  // Get inputs text.
  const keyName = document.getElementById('keyName').value;
  // Set default password if the field is left empty.
  if (keyName.length > 0 && keyPass.value.length == 0) {
    keyPass.value = 'OOO-000-OOO';
  } // Remove dashes from password input.
  let $keyPass = keyPass.value.replace(/\W/g, '');
  // Return if inputs are empty or incorrect.
  if (keyName.length == 0 || $keyPass.length != 9) { return; }
  // Define and encode key name and password.
  const keyData = `|${$keyPass}|${keyName}|`;
  const keyEncoded = encodeZip(keyData);
  // Store key file locally.
  keySave(keyEncoded);
}

const keySave = (key) => {
  // Create valid format for the key file generation.
  const k = `   ${key}`.padEnd(1000, ' ');
  const f = new Blob([k], { type: 'text/plain' });
  // Create URL object for file storage.
  const l = document.createElement('a');
  l.href = URL.createObjectURL(f);
  // Store file with generated key locally.
  l.download = 'PassKey.txt'; l.click();
  // Remove URL object.
  URL.revokeObjectURL(l.href);
}

// Define 'zip-code' and 'zip-mark' cast member data.
const zipCode = [37, 28, 52, 88, 65, 20, 92, 49, 67, 11, 5, 44, 2, 29, 3, 93, 60, 22, 69, 56, 35, 81, 83, 68, 24, 13, 31, 80, 26, 8, 85, 19, 94, 77, 90, 41, 66, 79, 58, 30, 17, 73, 34, 15, 75, 27, 91, 43, 50, 48, 25, 53, 23, 72, 55, 42, 82, 51, 39, 4, 32, 46, 36, 74, 33, 70, 1, 84, 59, 14, 38, 64, 7, 71, 16, 40, 57, 61, 10, 86, 63, 45, 78, 76, 47, 87, 54, 62, 89, 21, 12, 9, 6, 18];
const ZM = '*&^%$#@!?=({[/|\\]})+<>:;,.”’';

const encodeZip = (S) => {
  // Get character at random.
  let ct = Math.floor(Math.random() * ZM.length);
  // Store character for later decoding.
  let SS = ZM[ct];
  // Loop through all input characters.
  for (let x = 0; x < S.length; x++) {
    // Get current character keycode.
    let N = S[x].charCodeAt();
    // Check if the current is a valid ASCII printable character.
    if (N >= 32 && N <= 126) {
      ct++;
      if (ct >= 94) { ct = 0; }
      N = S[x].charCodeAt() + zipCode[ct];
      if (N > 126) { N -= 94; }
      SS += String.fromCharCode(N);
    } // Invalid character, leave it as is.
    else { SS += S[x]; }
  } // Return final encoded string.
  return SS;
}

const decodeZip = (S) => {
  let ct = 0;
  // Find random character used for encoding.
  for (let x = 0; x < ZM.length; x++) {
    if (S[0] == ZM[x]) { ct = x; }
  } // Initialize empty decoded string.
  let SS = '';
  // Loop through all input characters.
  for (let x = 1; x < S.length; x++) {
    // Get current character keycode.
    let N = S[x].charCodeAt();
    // Check if the current is a valid ASCII printable character.
    if (N >= 32 && N <= 126) {
      ct++;
      if (ct >= 94) { ct = 0; }
      N = S[x].charCodeAt() - zipCode[ct];
      if (N < 32) { N += 94; }
      SS += String.fromCharCode(N);
    } // Invalid character, leave it as is.
    else { SS += S[x]; }
  } // Return final decoded string.
  return SS;
}