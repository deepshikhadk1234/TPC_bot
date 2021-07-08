const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const spreadsheetId = "1pxHmS0Igyr6unWgmcnr7ekEfxwCjxvbheGrs163Rf-8";
const sheetName = "Sheet1";

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    keyFile: 'gs-config.json' // path to the goog-sheets.json key file
  });
  const authToken = await auth.getClient();
  google.options({auth:authToken});
  return authToken;
}

async function getSpreadSheet({ spreadsheetId, auth }) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

const appendRow = async (spreadsheetId, sheetName, values) => {
  const auth = await getAuthToken();
  // console.log(values[0][0]);
  try {
    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: sheetName,
      insertDataOption: "INSERT_ROWS",

      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });

    console.log(response.data);
    console.log('success');
    return response;
  }
  catch (err) {
    console.error(err);
  }
}

async function createSpreadSheet() {
  /* const appendOption = {
    "spreadsheetId": spreadsheetId, //You will insert this later
    "range": "A:A",
    "valueInputOption": "USER_ENTERED",
    "resource": {
      "values": [
        [
          "a"
        ]
      ]
    }
  } */
  const resource = {
    properties: {
      title: "SpreadSheet 1",
    },
  };
  sheets.spreadsheets.create({
    resource,
    fields: 'spreadsheetId',
  }, (err, spreadsheet) =>{
    if (err) {
      // Handle error.
      console.log(err);
    } else {
      console.log(`Spreadsheet ID: ${spreadsheet.spreadsheetId}`);
    }
  });

  /* sheets.spreadsheets.create(createOption, function (err, response) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`SpreadSheetid: ${response.spreadsheetId}`);
    //response contains the `Spreadsheet` resource we want, with it's fileId
    appendOption.spreadsheetId = response.spreadsheetId; //Set the spreadsheet Id to insert the values on.
    sheets.spreadsheets.values.append(appendOption, function (err, response) {
      if (err) {
        console.error(err);
        return;
      }

      //response contains the structure detailed on: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append#response-body

    });
  }); */
}


module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  appendRow,
  createSpreadSheet,
  spreadsheetId,
  sheetName,
}