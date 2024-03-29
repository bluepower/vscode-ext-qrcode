import * as vscode from "vscode";
import qrcode from "v-qr-code-next";

export function activate(context: vscode.ExtensionContext) {
  let currPanel: vscode.WebviewPanel | null = null;

  context.subscriptions.push(
    vscode.commands.registerCommand("vpoc.qrcode", () => {
      const _getHtml = () => {
        const typeNumber = 8;
        const errorCorrectionLevel = "L";
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData("https://nikoni.top/rui-next/").make();

        return `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>vpoc.qrcode</title>
          </head>
          <body>
            <h1>RUI.next</h1>
            <h3>Please scan the QR code to access the examples on mobile/tablet device:</h3>
            <p>${qr.createImgTag()}</p><br /><br />
            <fieldset>
              <legend>Simple qr-code generator</legend>
              Mode: 
              <select id="mode-area">
                <option value="image">Image</option>
                <option value="svg">SVG</option>
                <option value="table">Table</option>
                <option value="dataurl">DataURL</option>
              </select><br /><br />
              <input id="input-area" type="text" placeholder="Please input content" style="width: 99%"/>
              <p id="target-area">-</p>
            </fieldset>

            <script type="module">
              import qrcode from "https://unpkg.com/v-qr-code-next@0.2.4/dist/v-qr-code-next.es.js";

              const modeNode = document.getElementById("mode-area");
              const inputNode = document.getElementById("input-area");
              const targetNode = document.getElementById("target-area");
              if (modeNode && inputNode && targetNode) {
                const modeMap = {
                  "image": "createImgTag",
                  "svg": "createSvgTag",
                  "table": "createTableTag",
                  "dataurl": "createDataURL",
                };
                const typeNumber = 8;
                const errorCorrectionLevel = "L";  
                
                inputNode.addEventListener("keyup", (e) => {
                  const val = e.target.value.trim() || "";
                  if (val) {
                    const qr = qrcode(typeNumber, errorCorrectionLevel);
                    qr.addData(val).make();
                    const mode = modeNode[modeNode.selectedIndex].value;
                    const prefix = mode === "dataurl" ? '<img src="' : "";
                    const suffix = mode === "dataurl" ? '" />' : "";
                    targetNode.innerHTML = prefix + qr[modeMap[mode]]() + suffix;
                  } else {
                    targetNode.innerHTML = "-";
                  }
                });
              }
            </script>
          </body>
          </html>`;
      };

      const currColumn = vscode.window.activeTextEditor?.viewColumn;

      if (currPanel) {
        currPanel.reveal(currColumn);
      } else {
        // Create and show a new webview
        currPanel = vscode.window.createWebviewPanel(
          "vpoc",
          "Vite POC - QR Code",
          currColumn || vscode.ViewColumn.One,
          {
            enableScripts: true,
          }
        );
        currPanel.webview.html = _getHtml();

        currPanel.onDidDispose(
          () => {
            currPanel = null;
          },
          null,
          context.subscriptions
        );
      }
    })
  );
}

export function deactivate() {
  // deactivate - do nothing
}
