import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import { google } from 'googleapis';
import credentials from './credentials.json' assert { type: "json" };

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


app.post('/submit', (req, res) => {

// const SPREADSHEET_ID = '1ATd1WADHqtdmiLCskKsflSMChBN6G2WBkCccgAoUxak';
// const FOLDER_ID = '1cRNxDhDAvPzpNkuFkSjkgbAZD_1KfWgq';
// // Set up the Google Sheets API and Google Drive API
// gapi.load('client:auth2', () => {
//   gapi.client.init({
//     apiKey: 'AIzaSyAthc-yuRDyiPka1AMq8HVAH2AiuXHclDs',
//     clientId: '742786498545-680ivnoitq0h9vhp3l1c2ibm8f7t7d7s.apps.googleusercontent.com',
//     discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4', 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
//     scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
//   }).then(() => {
//     // Parse the form data and store in a dictionary
//     const form_data = {
//         'name': req.body.name,
//         'email': req.body.email,
//         'contact_info': req.body.contact_info,
//         'resume_path': req.body.resume,
//         'cover_letter_path': req.body.cover_letter,
//         'work_experience': req.body.work_experience,
//         'education': req.body.education,
//         'skills': req.body.skills,
//         'date': req.body.date,
//     };
//     // Add the form data to a new row in the Google Sheets spreadsheet
//     const values = [Object.values(form_data)];
//     const sheet_name = 'Integral';  // Replace with your sheet name
//     gapi.client.sheets.spreadsheets.values.append({
//       spreadsheetId: SPREADSHEET_ID,
//       range: sheet_name,
//       valueInputOption: 'USER_ENTERED',
//       insertDataOption: 'INSERT_ROWS',
//       resource: { values },
//     }).then((response) => {
//       console.log(`${response.result.updates.updatedCells} cells appended to the sheet.`);
//     }, (error) => {
//       console.error(`Error appending to the sheet: ${error.result.error.message}`);
//     });
  
//     // Save the resume and cover letter to Google Drive
//     const resume_file = resume_path.files[0];
//     const cover_letter_file = cover_letter_path.files[0];
  
//     // Create a new folder for each job application and store the files in that folder
//     const file_metadata = {
//       name: form_data['name'],
//       parents: [FOLDER_ID],
//       mimeType: 'application/vnd.google-apps.folder',
//     };
//     gapi.client.drive.files.create({
//       resource: file_metadata,
//       fields: 'id',
//     }).then((folder) => {
//       console.log(`Folder created with ID: ${folder.result.id}`);
  
//       // Upload the resume file to the new folder
//       const resume_path = 'uploads/' + form_data['resume_path'];
//       const resume_upload = new MediaFileUpload(resume_path, { mimeType: 'application/pdf' });
//       gapi.client.drive.files.create({
//         resource: { name: resume_file.name, parents: [folder.result.id] },
//         media: resume_upload,
//         fields: 'id',
//       }).then((resume) => {
//         console.log(`Resume file uploaded with ID: ${resume.result.id}`);
//       }, (error) => {
//         console.error(`Error uploading the resume file: ${error.result.error.message}`);
//       });
  
//       // Upload the cover letter file to the new folder
//       const cover_letter_path = 'uploads/' + form_data['cover_letter_path'];
//       const cover_letter_upload = new MediaFileUpload(cover_letter_path, {
//         mimeType: 'application/pdf',
//       });
//         gapi.client.drive.files.create({
//             resource: { name: cover_letter_file.name, parents: [folder.result.id] },
//             media: cover_letter_upload,
//             fields: 'id',
//             }).then((cover_letter) => {
//             console.log(`Cover letter file uploaded with ID: ${cover_letter.result.id}`);
//             }, (error) => {
//             console.error(`Error uploading the cover letter file: ${error.result.error.message}`);
//             });
//     }, (error) => {
//         console.error(`Error creating the folder: ${error.result.error.message}`);
//         }
//     );
//     });
// });

// Set up the Google Sheets API and Google Drive API
const auth = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);
auth.setCredentials({ access_token: 'ylSkZIjbdWybfs4fUQe9BqP0LH5Z', refresh_token: 'ylSkZIjbdWybfs4fUQe9BqP0LH5Z' });
const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

// Define the data to be posted to Sheets
    const data = [
      {
        'name': req.body.name,
        'email': req.body.email,
        'contact_info': req.body.contact_info,
        'resume_path': req.body.resume,
        'cover_letter_path': req.body.cover_letter,
        'work_experience': req.body.work_experience,
        'education': req.body.education,
        'skills': req.body.skills,
        'date': req.body.date,
}
]

// Define the range and sheet ID where the data will be posted
const range = 'Sheet1!A1:H1';
const sheetId = '1ATd1WADHqtdmiLCskKsflSMChBN6G2WBkCccgAoUxak';

// Define the metadata for the new file in Drive
const fileMetadata = {
  name: 'Job Application - John Doe',
  mimeType: 'application/vnd.google-apps.spreadsheet'
};

// Create a new file in Drive and post the data to Sheets
drive.files.create({ resource: fileMetadata, fields: 'id' }, (err, file) => {
  if (err) {
    console.error(err);
  } else {
    const fileId = file.data.id;
    sheets.spreadsheets.values.update({
      spreadsheetId: fileId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: data }
    }, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Data posted to Sheets: ${res.data.updatedCells} cells updated.`);
      }
    });
  }
});

});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});