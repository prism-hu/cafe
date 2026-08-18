// サイネージのスライド一覧 API（GAS Web アプリ）。
// Drive フォルダ内のファイル名と id をそのまま返すだけの箱。
// ファイル名規約 {slot}_{name}_{style}_{period}.{ext} の解釈は表示側
// （public/signage/index.html）が一手に持つ — ここでは選別しない。
// デプロイ・更新は clasp（リポジトリの gas/slides/ が正）。
var FOLDER_ID = '1b_iQEGOOK3nR4g3dLVZh3v_vIimdtAOh';

function doGet() {
  var it = DriveApp.getFolderById(FOLDER_ID).getFiles();
  var files = [];
  while (it.hasNext()) {
    var f = it.next();
    files.push({ name: f.getName(), id: f.getId() });
  }
  return ContentService.createTextOutput(JSON.stringify({ files: files }))
    .setMimeType(ContentService.MimeType.JSON);
}
