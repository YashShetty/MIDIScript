// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

var CLIENT_ID// = '50416297127-ue1qmlr5dslasknpgk6uv80fqls6nbja.apps.googleusercontent.com';
var API_KEY;// = 'AIzaSyAJt_qH8cvqMmqe4diOMk0b4rxX-DHzZf8';
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
    var cert = //your json key (downloaded earlier) goes here
        {
            "type": "service_account",
            "project_id": "quickstart-1579078001335",
            "private_key_id": "52c5540d79a770179236a6ba4b0eeca5622c1ffe",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCfK+Msko6Qg5wK\nLlRcIDQ87YldBBRvh+UF4T2K0wboQwpgueV6VJ0j1YbKibLWO1QpBwvouIqqszF0\n5vm151X4bvGbbOdpBvDHLKOdJBcoCwTnigFsQ4XYJXaLl5xwV5iRvg3BB8qFgT9V\nMideu5MGtXq7gAWRJuNuFMftKdh5cmveq+KnBxXCOmTbbMbxnVIAfGgUzYC2YrhT\n5bOujxTL2y7iJ0oXYKjrk8l8r70dD+v+9WCq7emB9rBZAZfo5EKAYzAg033XhSE6\n/AvgHCCN+34KhIoi79XDmX0zIVSWyquU+EwH1Md7IzwSN0sy75H0QCBjBq24kHQn\nVtb5NEzBAgMBAAECggEAP/7nvByCqFTZ8Hf3IAEsr5B7iYPh6YO0T5xjX4UAAnMt\n4XzsaDZL5cPsiVM6rYq2CDbWkW9dBUu9pzhUjs/fj16f0nNDSUVqmlH2yG/hxY5E\nnwksEEjHsAND+dTvp3V4mKRWqFUHFo1EFu9ux9ZXwztFCMzssBL4HuLJDTAlYpI9\nPrsjocLoGfUyxXpSBskMGfRWdXnqj22+WNGxlF81EkbEiTT5Ax4LONdge6zFwhhQ\njPX5yeUmLByLlscqFdjrsKSa7oAxufDQ1FhI02oGHGiJkhzS64waUcgCIEtX1Lb4\nH7nWSiKD8q6jG7yuEUjSTQmQCqPvku209rEkeoPm7wKBgQDaPyQXbdMURf0ttS8q\nm5ryNxQYJW83UnVsCq6C5fxELHW+2XC3RNRuPFxhW+TLte7ILGUDeBTLqdRxhTeq\nj/sdh7EnuA22fK3PuGOvHsarGjOxlkyTK/NHBGGe/P41dwBvOuJ1qPw6LkvBiOCZ\nPLzi4lXNvOmRKhGIPoazEAH6kwKBgQC6tKc3HFy14BU9Eb1tsMksyPEUNeFR7A7v\nd8Rr9JeFzaYRPBlB0+6DaovCRzmZU+lQHPDrb4M8O2P/k240M+Y1v+Z6CBoBaeeW\n3i/8iQidBj2ydWPuoA+vGJQm8G2q9afTJ6M+BWqHAKgHqTZsB40RHGtOR57WHsOh\nhzMo2Err2wKBgEKE8jQt5iMMvgEbczfSW6StwvMlHcPH30BB9TSycnQ49N5pmeBS\nG0lKHoISJycr2Y6rcVJgXD5DEhxTlUboQYqbnBRWFd/kGnnwYnmysKzf/JeJDufg\ngnLH1BVIWRbkoX5FfVaNXetBxxdC5+nsyEmC4NInXS1AnD1hiV60Z1X/AoGBAKdu\n4pYVpT6lWeaORiZcZ8z11tydBReGbk5qRYfarRedONQz5SKXgEnx/quXXBwYmB70\nFUnNkw8s45yLBkViVYzWL0Y4hbnG050EXFxIN6U5t5KWm6ufdvE7RYE2E+NAseQ2\no7o2+TVgbU+Re/CdRPCXX9Ovfs3egOoWaNa0QVwJAoGBANQarmrSIav2VCnupEK/\nR2FA52DBDD8CXxAOceUH7hllLpKDB2m6nWeAqEcUhNSJz6DEik76iVQq7xC4zZBY\ng91Ck7Lwzj4UNrkNv3Mp+arle5s7OJNv85/xw2TNQCP8tk6XAHfZlHWpGqZgEQGb\nEKJVY7hyBcG2zVxVMdRVuOTY\n-----END PRIVATE KEY-----\n",
            "client_email": "mystery-server@quickstart-1579078001335.iam.gserviceaccount.com",
            "client_id": "108093012583432259151",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            //"token_uri": "https://oauth2.googleapis.com/token",
            "token_uri": "https://accounts.google.com/o/oauth2/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mystery-server%40quickstart-1579078001335.iam.gserviceaccount.com"
        };      
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
