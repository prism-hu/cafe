# PRISM-HU SUPPORT サイネージ試作

縦型ディスプレイ向けの約35秒ループアニメーションです。音声は使用しません。

## 確認方法

`index.html` をChromeで開くと自動再生します。クリックすると先頭から再生し直します。

- 通常ループ: `index.html`
- 1回だけ再生: `index.html?once=1`
- 指定秒を静止表示: `index.html?t=10.5`

## 画面仕様

- 縦9:16（1080×1920基準。横長の確認画面でも全体を等比縮小）
- 約35秒
- 無音
- QRコード: `https://prism-hu.med.hokudai.ac.jp/`
- SUPPORTサイトへの案内: `PRISM-HUウェブサイトの「PRISM SUPPORT」からアクセスできます`

## 収録内容

1. `PRISM-HU SUPPORTをご存じですか？`
2. PRISM-HU公式TOPページのグローバルナビを丸で強調
3. 研究支援ページへ遷移し、LLENSを強調
4. LLENSのタイプライター説明とアルファテスト募集
5. 講義動画翻訳・講義スライド変換・論文科研費リンク集
6. `役に立つ医療AIニュースをほぼ毎日更新中！`
7. `事務作業の自動化、ご相談ください！`
8. QRコード、アクセス案内、ブックマークの呼びかけ

## 素材

- `assets/prism-top-desktop.png`: 2026-08-05に公開TOPページから取得
- `assets/prism-support-research.png`: `prism-support-site/reserch-section.block.html` から取得
- `assets/medical-ai-news.png`: 2026-08-05に提供された医療AIニュース一覧の縦長スクリーンショット
- `assets/prism-hu-logo.png`: 共有ブランド正本 `brand/prism-hu/logo/H_en.png`
- `assets/qr-prism-top.svg`: 公開TOPページURLから生成

この段階では既存の `display.html` には組み込んでいません。内容と動きの承認後に、既存スライドショーの1枠として組み込みます。
