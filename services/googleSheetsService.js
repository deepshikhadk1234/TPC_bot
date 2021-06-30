const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const spreadsheetId = "1pxHmS0Igyr6unWgmcnr7ekEfxwCjxvbheGrs163Rf-8";
const sheetName = "Sheet1";

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    keyFile:'gs-config.json' // path to the goog-sheets.json key file
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({spreadsheetId, auth}) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({spreadsheetId, auth, sheetName}) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}


module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  spreadsheetId,
  sheetName,
}