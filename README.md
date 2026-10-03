# New Tab Boilerplate

A minimal Chrome extension that shows a custom page whenever you open a new tab.

## Get started

1. Clone this repository and open `chrome://extensions` in Google Chrome.
2. Turn on **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select this repository's folder (the one containing `manifest.json`).
4. Open a new tab to see **Hello, world!**

Edit `newtab.html` to customize the page. After changing a file, click the extension's **Reload** button on `chrome://extensions`, then open or refresh a new tab.

## Files

- `manifest.json` declares a Manifest V3 extension and points Chrome's new tab override to `newtab.html`.
- `newtab.html` contains the page's HTML and CSS.

No dependencies or build step are required.

---

# 日本語

新しいタブを開くたびにカスタムページを表示する、最小構成のChrome拡張機能です。

## はじめに

1. このリポジトリをクローンし、Google Chromeで `chrome://extensions` を開きます。
2. 右上の**デベロッパーモード**をオンにします。
3. **パッケージ化されていない拡張機能を読み込む**をクリックし、このリポジトリのフォルダ（`manifest.json` があるフォルダ）を選択します。
4. 新しいタブを開くと **Hello, world!** と表示されます。

ページをカスタマイズするには `newtab.html` を編集してください。ファイルを変更したら、`chrome://extensions` で拡張機能の**再読み込み**ボタンをクリックし、新しいタブを開くか更新してください。

## ファイル

- `manifest.json`: Manifest V3の拡張機能を宣言し、Chromeの新しいタブの上書き先を `newtab.html` に指定します。
- `newtab.html`: ページのHTMLとCSSが含まれています。

依存関係やビルド手順は不要です。
