// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

var CLIENT_ID = '50416297127-ue1qmlr5dslasknpgk6uv80fqls6nbja.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAJt_qH8cvqMmqe4diOMk0b4rxX-DHzZf8';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive';

var token = {};

function handleClientLoad() {
    postJWT(getJWT(), function(response, req) {
        token = JSON.parse(response);
        console.log(token);
        gapi.load('client:auth2', initServer);
    });
}

            function initServer() {
                gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES
                }).then(()=>{
                    gapi.auth.setToken(token);
                    init();
                },(e) => {
                    console.log(e);
                    //openError();
                });
            }

            function init() {}

            function getFileContent(f, c) {
                return gapi.client.drive.files.get({
                    'fileId': f,
                    'alt': 'media'
                }).then(c);
            }

            function fileIdFromName(name,c) {
                name = name.toLowerCase().split('/');
                var search = name.shift();
                console.log(name);
                
                if(name.length == 0) {
                    return gapi.client.drive.files.list({
                        "fields":"files(name,id)"
                    }).then(rs => rs.result.files.find(e => e.name.toLowerCase() == search)).then(c);
                }
                else {
                    gapi.client.drive.files.list({
                        "fields":"files(name,id)",
                        "q": "mimeType = 'application/vnd.google-apps.folder'"
                    }).then(rs => {
                        return rs.result.files.find(e => e.name.toLowerCase() == search)
                    }).then(rs => {
                        fileIdFromName(name.join("/"),c);
                    });
                }
            }