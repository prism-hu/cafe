# cafe — サイエンスカフェ HP・サイネージ

北海道大学 大学院医学研究院 連携研究センター 医学研究AI支援部門（PRISM-HU）が整備する
フリー会議室「サイエンスカフェ」（医学部中研究棟2F）の HP とデジタルサイネージを管理する repo。

- 公開 URL: **https://cafe.prism-hu.org/**
- ホスティング: Cloudflare Pages（project `prism-cafe`）。`master` への push で自動デプロイ
  （`.github/workflows/deploy.yml`）。デプロイ後に Cloudflare のエッジキャッシュを全パージする
  （削除ファイルが最大4時間配信され続けた事故対策、2026-08-04）。

## ページ構成

```
public/
├── index.html                  # 案内LP（QRの飛び先。正本は WordPress 用断片、これはそのスタンドアロン版）
└── signage/
    ├── index.html              # サイネージシェル（ミニPC キオスクで24時間表示する本体）
    ├── door-notice.html        # 貸切中のドア掲示（全画面）
    ├── event-notice.html       # オープン開催中の掲示（全画面）
    ├── qr-cafe.png             # ヘッダー内 QR（→ cafe.prism-hu.org）
    ├── slides/                 # ポスター画像 001.jpg〜030.jpg（欠番可）+ playlist.json
    └── support-promo/          # PRISM SUPPORT 紹介アニメーション（HTML枠の実例）
```

### 案内LP（`/`）

利用案内・貸切形態（完全貸切／オープン開催／部分利用）・申込フォームリンク・開催予定カレンダーを掲載。
正本は学外公開サイト（prism-hu.med.hokudai.ac.jp）の WordPress 固定ページに貼るカスタム HTML 断片で、
文面・カレンダーはそれと揃える。

- 開催予定カレンダー: Google カレンダーの公開 embed
  - カレンダー ID: `ec495493d88f2b68db4d7f5c953e10a72a1e714ebf06666b829988e9dfee9626@group.calendar.google.com`
  - 日曜始まり（`wkst=1`）、月表示、Asia/Tokyo
- 申込: Google フォーム（LP 内リンク）→ 事務局承認で確定

### サイネージ（`/signage/`）

縦型ディスプレイ（1080×1920 想定）にブラウザ全画面（F11）で表示。動作モード:

| モード | 表示 |
|---|---|
| `normal` | `slides/` の画像 + `playlist.json` の HTML 枠をクロスフェードで巡回 |
| `private` | `door-notice.html` を全面 iframe（貸切中。当日予定があればヘッダー分縮む） |
| `open` | `event-notice.html` を全面 iframe（オープン開催中。同上） |
| `override` | 管理シート B3 の任意 URL を全画面 iframe（https のみ許可。ヘッダーも出さない） |

- モードは **GAS Web アプリ（doGet）を2分ごとにポーリング**して取得。既定で本番 GAS
  （コード内 `DEFAULT_API`）を見る。`?api=` で上書きできる（ローカルモック等）
- GAS と管理シートは **repo 外**（Google 側、同僚管理。コードのスナップショットは
  repo wiki「カレンダー取得用GAS」）。doGet の応答形式:
  - `mode` / `until` / `overrideUrl`
  - `today`: `[{ start: "HH:MM", end: "HH:MM", kind: "private"|"open"|"partial" }]`（終了済み除外。旧バナー互換用）
  - `todayFull`: `today` と同形 + `label`（団体名等）付き・**終了済みも含む**（ヘッダー用）
- スライド画像は枚数をコードに書かず起動時に `001.jpg`〜`030.jpg` を探す。
  **事務室が画像を置く・消すだけで差し替えられる**（現状は GitHub Web UI からのアップロード運用）
- HTML 枠は `slides/playlist.json` で宣言。実在確認として本文に `<!-- signage-slide -->`
  マーカーを含むものだけ採用（このサイトは 404 でも 200 で代替ページを返すため）
- 耐障害設計: fetch は10秒で打ち切り / ネット断・API 障害時は最後の表示を維持 /
  normal 中24時間ごとにリロードしてポスター差し替えを取り込む

### 上部ヘッダー（本日の予定タイムライン）

高さ 140px を常設。デザインは design_handoff_signage のモックが正。

- 左: 「サイエンスカフェ」・日付・現在時刻（毎分更新）
- 右上段: 7:30–20:00 のタイムライン。予定ブロックを色分け（貸切=アンバー / 部分利用=ティール /
  イベント=紫、文字なし）、終了済みは薄表示、現在時刻ライン（赤）
- 右下段: スライド切替に同期して予定を1件ずつ拡大表示（時間・種別バッジ・団体名・
  進行中/終了済みピル）。巡回は当日の全予定を各1周期、**進行中の予定のみ連続2周期**。
  これ以降の予定が無いときは「予約なし・利用可」カードを1周期追加。右端に QR
- データは `todayFull`（無ければ旧 `today` で代用）。一度も取得できていない間・override 中・
  掲示中で当日予定が空のときは非表示（安全側）
- レイアウトは 1080×1920 固定キャンバスを scale でウィンドウに収める（実機では等倍）。
  動作確認用に `?demo=HH:MM`（時刻固定）・`?date=YYYY-MM-DD`（対象日切替）・
  クリックで次の枠へ強制送り

## 運用メモ

- ポスター追加: `public/signage/slides/` に `NNN.jpg`（001–030）を置いて master へ push するだけ
- 掲示切替: 管理シート（GAS）側の操作。repo の変更は不要
- QR 再生成: 飛び先 URL を変える場合は door-notice / event-notice / qr-cafe.png を作り直す
- Cloudflare 側の secrets（GitHub environment `production`）:
  `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_ZONE_ID` /（任意）`CLOUDFLARE_PURGE_TOKEN`
