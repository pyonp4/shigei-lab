---
name: research-image
description: 研究室サイトで、研究のイメージ画像（図や写真）を「研究紹介一覧のカード」と「トップの研究紹介パネル」の2か所に入れる。「研究の画像をカードに入れて」「トップのパネルにも図を出して」「イメージ画像が未入力」などのときに使う。
---

# 研究のイメージ画像を2か所に入れる

お手本は「AIによる手術手技スキルの推定」（research1）。最初に次の3か所を読み、同じ形で作る。

- `docs/research.html` の `<a class="card" href="research1.html">` と、`docs/css/style.css` の `.card-img`
- `docs/index.html` の `<a class="u389-p u389-p--fig u389-p--surgery" href="research1.html">`（分野のパネルの例は `u389-p--vision`・`u389-p--ee`）
- `docs/css/lucian.css` の `.u389-p--fig`（共通の仕組み）と、その下の「パネルごとの図」（`.u389-p--surgery` など）

## 0. 準備

1. 画像ファイルのパスを教えてもらう。カード用とパネル用で別の画像でもよい（research1 では、カードは色の帯の図、パネルは研究ページの図2）。どの画像をどちらに使うか、はっきりしなければ確認する。
2. 画像が手元にない場合（別のPCのパス、sftp で取ってきた、など）は、実際にファイルがある場所を探す。sftp の `get` は、sftp を起動したフォルダ（多くはユーザーフォルダ）に保存される。
3. 画像を `docs/images/researchN/` にコピーする。SVG の場合は、`<script>`・`on〇〇=`・外部 URL の読み込み・`<foreignObject>` がないことを確かめてから使う。

## 1. 研究紹介一覧のカード（`docs/research.html`）

枠は 16:9。カードの `<div class="placeholder">…</div>` を次に置き換える（カードの見出しで内容が伝わるので `alt` は空）。

```html
<img class="card-img" src="images/researchN/card_xxx.png" width="横" height="縦" alt="">
```

- 画像が 16:9 でないときは、大事な部分（凡例・文字など）が切れるなら**切り抜かず、白い余白を足して 16:9 にする**。写真のように切ってよいものは、`.card-img` の `object-fit: cover` に任せてよい。
- 余白を足すときは、このフォルダの `pad16x9.ps1` を使う（Python の画像ライブラリは入っていないため、PowerShell で処理する）。

```
powershell -NoProfile -ExecutionPolicy Bypass -File claude/skills/research-image/pad16x9.ps1 -Src 元の画像 -Out docs/images/researchN/card_xxx.png
```

## 2. トップの研究紹介パネル（`docs/index.html` と `docs/css/lucian.css`）

パネルは「横に開くパネル」（`.u389`）。開くと横長、閉じると細い縦の帯になる。個別の研究のパネルがない研究は、その研究が入っている分野のパネル（例：「画像・映像識別」）に画像を出すか、新しくパネルを足すかを確認する。分野のパネルにすでに別の研究の図が入っている場合は、差し替えるかどうかも確認する。

研究ページが1つもない分野は、図を入れずに「準備中」にする（`docs/index.html` のパネルの `<small>` を「準備中」に、`docs/research.html` の分野の欄を `.notice` の「この分野の研究紹介は準備中です．」に。お手本は IoT・自然言語処理）。

- **写真など暗めで文字が読める画像**：`index.html` のコメントのとおり、インラインの `--bg` を `url("images/…") center / cover` に差し替えるだけでよい。
- **白い背景の図**：そのまま敷くと白い文字が読めないので、research1 と同じ作りにする。
  1. `index.html`：パネルの `style="--bg:…"` を消し、`u389-p--fig` と `u389-p--研究の名前` の2つのクラスを付ける。
  2. `lucian.css`：「パネルごとの図」に2行を足す。1行目は図の縦横比（`--fig-r`：横÷縦）、2行目は `::before` の `background-image` に図のパスを書く。画像のパスは CSS からの相対パス（`../images/…`）にする。PC用・スマホ用の動きは `.u389-p--fig` が受け持つので、書き足さなくてよい。

     ```css
     .u389-p--名前 { --fig-r: 1.778; }   /* researchN：800×450 */
     .u389-p--名前::before { background-image: url("../images/researchN/card.png"); }
     ```
  3. 仕組み（`.u389-p--fig`）：図は `::before` に置き、パネルの大きさは `container-type: size` で `cqw`・`cqh` として使う。
     - 開いたとき：図を上側に置き、下側（タイトル・説明・ボタンの部分）は紺色。
     - 閉じた細い帯（PC）：図を90度回して横向きにし、帯いっぱいに拡大する。縦書きの名前が読めるよう、`::after` で紺色（濃さ 82%）を重ねる。
     - スマホ：パネルが横長なので図は回さない。閉じた帯では帯いっぱい、開いたときは図を小さくして上の部分だけに置く。
     - 紺色の重ね（`::after`）は、元の `.u389-p::after` より後ろで効くよう `.u389-p.u389-p--fig::after` と `.u389-p` を重ねて指定してある。

## 3. 確かめる

画面幅 1440px と 390px で、次をスクリーンショットで確かめて報告する。

- カード：16:9 に収まり、大事な部分が切れていない。
- パネル：開いた状態と閉じた状態の両方で、図とタイトル・説明が重ならず読める。

ヘッドレスの Edge で撮るときのコツ：

- `docs/index.html` を作業用フォルダにコピーし、`css/`・`js/` を `file:///C:/shigei-lab/docs/…` に書き換えて開く。
- 研究紹介だけを撮るには、`<style>main > *:not(:has(#research-title)){display:none!important}</style>` を足す（ページ内の位置へスクロールして撮ると画面が白くなる）。
- 閉じた状態を見るには、読み込み後にほかのパネルへ `mouseenter` を送るか `focus()` する。
- スクリーンショットが保存されないことがあるので、そのときは撮り直す。

## 4. 作業のルール

- `CLAUDE.md` のブランチ運用に従う（main で作業しない）。
- ページに表示する日本語（図の説明文を含む）は「，」「．」を使う。HTML・CSS のコメントは対象外（`CLAUDE.md`）。
- 画像は、ページに載せてよいもの（指導教員の掲載許可を得たもの）だけを使う（`RESEARCH_GUIDE.md`）。
