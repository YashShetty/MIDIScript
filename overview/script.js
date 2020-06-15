// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

var CLIENT_ID;
var API_KEY;
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

function postJWT(jwt, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200 && callback) {
                callback(this.responseText);
                return;
            }
            if (console) console.log(this.responseText);
        }
    };
    var parameters = "grant_type=" + encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer") + "&assertion=" + encodeURIComponent(jwt);
    xhttp.open("POST", "https://www.googleapis.com/oauth2/v4/token", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(parameters);
}

function getCert() {
    var cert = {};      
    return cert;
}
function getJWT() {
    var cert = getCert();
    var key = KEYUTIL.getKey(cert.private_key);
    var headers = { "alg": "RS256", "typ": "JWT" };
    var issued = Math.floor(new Date().getTime()/1000);

    var claims = {
        "iss": cert.client_email,
        "scope": "https://www.googleapis.com/auth/drive",
        "aud": "https://www.googleapis.com/oauth2/v4/token",
        "exp": issued + 3600,
        "iat": issued
    };

    var jwt = KJUR.jws.JWS.sign(headers.alg, headers, JSON.stringify(claims), key);
    return jwt;
}
