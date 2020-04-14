function init() {
    var urlq = new URLSearchParams(location.search);

    if (urlq.get("app") == "weather") {
        document.querySelector("#load").innerHTML = "";
        document.querySelector("#heading").innerHTML = "Weather";
        document.querySelector("#description").innerHTML = "Check the weather";
        document.querySelector("#butInstall").style.display = "block";

        var e = [["apple-mobile-web-app-capable", "yes"], ["apple-mobile-web-app-status-bar-style", "black"], ["apple-mobile-web-app-title", "Weather PWA"], ["description", "A sample weather app"], ["theme-color", "#2F3BA2"]];
        for (var i = 0, a; i < e.length; i++) {
            a = document.createElement("meta");
            a.name = e[i][0];
            a.content = e[i][1];
            document.head.appendChild(a);
        }
        var ios = document.createElement("link");
        ios.rel = "apple-touch-icon";
        ios.href = "/icon-152x152.png";
        document.head.appendChild(ios);

        var manifest = document.createElement("link");
        manifest.rel = "manifest";
        manifest.href = "/manifest.json";
        document.head.appendChild(manifest);
        /*getManifest("weather", c=>{
            manifest.href = c;
            document.head.appendChild(manifest);
        });*/

        //getSWURL("weather", c=>{
        if ("serviceWorker"in navigator) {
            navigator.serviceWorker.register("/sw.js").then(reg=>{
                console.log("Service worker registered.", reg);
                reg.active && reg.active.postMessage(["hello"]);
            }
            );
        }
        //});
    } else {
        window.open("/", "_self");
    }
}

function getSWURL(name, func) {
    fileIdFromName("apps/" + name + "/sw.js", c=>{
        func("https://drive.google.com/uc?id=" + c.id);
    }
    );
}

function getManifest(name, func) {
    fileIdFromName("apps/" + name + "/manifest.json", c=>{
        getFileContent(c.id, f=>{
            func(URL.createObjectURL(new Blob([f.body],{
                type: "application/json"
            })));
        }
        );
    }
    );
}

/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */

let deferredInstallPrompt = null;
const installButton = document.getElementById("butInstall");
installButton.addEventListener("click", installPWA);

// CODELAB: Add event listener for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent);

/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
    // CODELAB: Add code to save event & show the install button.
    deferredInstallPrompt = evt;
    installButton.removeAttribute("hidden");
}

/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
    if (deferredInstallPrompt) {
        // CODELAB: Add code show install prompt & hide the install button.
        deferredInstallPrompt.prompt();
        // Hide the install button, it can't be called twice.
        evt.srcElement.setAttribute("hidden", true);
        // CODELAB: Log user response to prompt.
        deferredInstallPrompt.userChoice.then(choice=>{
            if (choice.outcome === "accepted") {
                console.log("User accepted the A2HS prompt", choice);
            } else {
                console.log("User dismissed the A2HS prompt", choice);
            }
            deferredInstallPrompt = null;
        }
        );
    }
}

// CODELAB: Add event listener for appinstalled event
window.addEventListener('appinstalled', logAppInstalled);

/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
    // CODELAB: Add code to log the event
    console.log('Weather App was installed.', evt);
}
