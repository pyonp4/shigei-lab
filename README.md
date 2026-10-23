# 重井研究室 研究紹介サイト

公開URL: https://pyonp4.github.io/shigei-lab/

情報科学実践演習Ⅱ チーム DragonicKing（江藤・山下）

## ファイル構成と担当

サイトのファイルはすべて `docs/` に置く（GitHub Pages は `main` ブランチの `/docs` を公開する）。

| ファイル | ページ | 担当 | 優先度 |
|---|---|---|---|
| docs/index.html | ホーム | 山下 | Must |
| docs/research1.html | 手術手技スキルの推定 | 江藤 | Must |
| docs/research2.html | 災害危険個所の推定 | 山下 | Must |
| docs/events.html | 行事紹介 | 江藤 | Must |
| docs/seminar.html | ゼミ紹介 | 山下 | Should |
| docs/about.html | 研究室について | 未定 | - |
| docs/members.html | メンバー | 未定 | - |
| docs/contact.html | お問い合わせ | 未定 | - |
| docs/news.html | ニュース一覧 | 未定 | - |
| docs/news-lab-visit.html | ニュース：研究室見学の案内 | 未定 | - |
| docs/research.html | 研究紹介（分野別一覧） | 未定 | - |
| docs/careers.html | 就職先 | 未定 | - |
| docs/css/style.css | 全ページ共通のデザイン | 変更時は相談 | - |
| docs/js/main.js | スマホ用メニュー、日英の言語切り替え | - | - |
| docs/images/ | 画像置き場（`qr.png` は公開URLのQRコード） | - | - |

## 作業ルール

- 自分の担当ページのファイルだけを編集する
- `docs/css/style.css` を変えるときはひと声かける
- 黄色の `【原稿待ち】`（`class="todo"`）は公開前にすべて消す
- 研究の図や文章は、指導教員の掲載許可を得てから push する
- 画像は `docs/images/` に入れて `<img src="images/ファイル名.png" alt="説明">` で表示する

## 残りのタスク（11月の研究室紹介まで）

原稿や画像が用意できない枠は、`【原稿待ち】` のまま公開せず枠ごと消す。

### ① 先生へのお願い（返事待ちになるので最初に送る）

- [ ] research1（手術手技スキルの推定）の図と文章の掲載許可をもらう（江藤）
- [ ] research2（災害危険個所の推定）の図と文章の掲載許可をもらう（山下）
- [ ] 研究室見学の Google フォームの URL をもらう（または自分たちで作る）
- [ ] 研究室の WordPress（https://neuro.ibe.kagoshima-u.ac.jp/wp-lab/）からこのサイトへのリンク追加をお願いする
- [ ] WordPress の SSL 証明書が切れている（2025年11月29日まで）ことを伝える
- [ ] 公開前に研究内容を確認してもらう日を決めておく

### ② 原稿（`【原稿待ち】` を埋めるか、枠ごと消す）

- [ ] index.html：研究室の紹介文（2〜3行）、研究①②の概要、ニュース2件（山下）
- [ ] research1.html：一言要約、背景、手法、図の説明、面白さ①②、身につくスキル、本人コメント（江藤）
- [ ] research2.html：同上（山下）
- [ ] events.html：イベント9件の名前と内容（実際に行う数だけ残す）、写真の説明（江藤）
- [ ] seminar.html：頻度・曜日、形式、参加メンバー、雰囲気、身につく力2つ（山下）
- [ ] about.html：研究室の紹介文（3〜4文）、メンバー数
- [ ] members.html：学生4人分の学年、2人分の氏名と研究テーマ
- [ ] news-lab-visit.html：Google フォームの URL（ボタンの `href="#"` も差し替える）
- [ ] news.html：ニュース6件のタイトル（実際にある分だけ残す）
- [ ] careers.html：対象期間、就職先の企業名（最大8件）、就活ゼミの説明
- [ ] research.html：4分野の説明、各テーマ名と概要（分かる分だけ載せて残りは消す）

WordPress の RESEARCH や MEMBER のページ、トップページのニュース欄（学会発表の実績）は原稿の材料に使える。

### ③ 画像（`docs/images/` に入れる。用意できない枠は消す）

- [ ] research1・research2 の研究全体像の図（掲載許可をもらってから）（江藤・山下）
- [ ] index の研究①②のイメージ画像（16:9）（山下）
- [ ] research の研究イメージ画像（9枠）
- [ ] events のイベント写真（写っている人の許可をもらう）（江藤）
- [ ] members の教員写真
- [ ] 研究室見学フォームの QR コード `images/lab-visit-form-qr.png`（フォームの URL が決まってから作る）

### ④ その他

- [ ] 担当が「未定」のページの担当を決める
- [ ] 全ページで `【原稿待ち】` が0件になっていることを確認する

## 公開前チェック（受入基準）

- [ ] 指導教員が研究内容に相違ないことを確認した
- [ ] 学部生3人が重井研究室にポジティブな印象を持った
- [ ] QRコードで正しく飛べる（3つのデバイスで確認）
- [ ] スマートフォン（幅375px）で横スクロールが発生しない
