// ==========================================
// ⚙️ Hide Portal Generator - JavaScript Logic
// ==========================================

// 初期設定用の今日の日付を取得
const today = new Date().toISOString().split("T")[0];

// 状態管理
let diaries = [
  {
    title: "今日から新しいポータルサイトを作り始めた！",
    date: today,
    body: "今日からあんちゃんと一緒に新しいポータルサイトを作り始めたよ。一から作ると仕組みがよく分かって面白い！"
  }
];

let cards = [
  {
    title: "あんちゃん相棒エディターの紹介",
    url: "https://example.com",
    desc: "ひでとあんちゃんが作った最初のポータルサイト作成アプリだよ！",
    type: "tool"
  }
];

// HTML要素の取得
const diaryTitleInput = document.getElementById("diary-title");
const diaryDateInput = document.getElementById("diary-date");
const diaryBodyInput = document.getElementById("diary-body");
const btnAddDiary = document.getElementById("btn-add-diary");
const addedDiariesList = document.getElementById("added-diaries-list");

const cardTitleInput = document.getElementById("card-title");
const cardUrlInput = document.getElementById("card-url");
const cardDescInput = document.getElementById("card-desc");
const cardTypeInput = document.getElementById("card-type");
const btnAddCard = document.getElementById("btn-add-card");
const addedLinksList = document.getElementById("added-links-list");

const btnSave = document.getElementById("btn-save");
const portalPreview = document.getElementById("portal-preview");
const saveStatus = document.getElementById("save-status");

// 初期化：日付入力を今日に設定
diaryDateInput.value = today;

// イベントリスナーの登録
[diaryTitleInput, diaryDateInput, diaryBodyInput].forEach(input => {
  input.addEventListener("input", renderPreview);
});

btnAddDiary.addEventListener("click", handleAddDiary);
btnAddCard.addEventListener("click", handleAddCard);
btnSave.addEventListener("click", handleSaveLocal);

// --- ⚙️ 関数定義 ---

// 1. 日記の追加処理
function handleAddDiary() {
  const title = diaryTitleInput.value.trim();
  const date = diaryDateInput.value;
  const body = diaryBodyInput.value.trim();

  if (!title || !body) {
    alert("日記のタイトルと本文は必ず入力してね！");
    return;
  }

  // 配列に追加
  diaries.push({ title, date, body });

  // 入力欄をクリア（日付は今日に戻す）
  diaryTitleInput.value = "";
  diaryDateInput.value = today;
  diaryBodyInput.value = "";

  // 再描画
  renderAddedDiariesList();
  renderPreview();
}

// 2. 日記の削除処理
function handleRemoveDiary(index) {
  diaries.splice(index, 1);
  renderAddedDiariesList();
  renderPreview();
}

// 3. エディタ内での「追加済み日記」のリスト表示
function renderAddedDiariesList() {
  addedDiariesList.innerHTML = "";
  diaries.forEach((diary, index) => {
    const li = document.createElement("li");
    
    const label = document.createElement("span");
    label.textContent = `📝 [${diary.date}] ${diary.title}`;
    label.style.overflow = "hidden";
    label.style.textOverflow = "ellipsis";
    label.style.whiteSpace = "nowrap";
    label.style.maxWidth = "280px";
    
    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.textContent = "削除";
    btnRemove.addEventListener("click", () => handleRemoveDiary(index));

    li.appendChild(label);
    li.appendChild(btnRemove);
    addedDiariesList.appendChild(li);
  });
}

// 4. リンクカードの追加処理
function handleAddCard() {
  const title = cardTitleInput.value.trim();
  const url = cardUrlInput.value.trim();
  const desc = cardDescInput.value.trim();
  const type = cardTypeInput.value;

  if (!title || !url) {
    alert("タイトルとURLは必ず入力してね！");
    return;
  }

  // カード配列に追加
  cards.push({ title, url, desc, type });

  // 入力欄をクリア
  cardTitleInput.value = "";
  cardUrlInput.value = "";
  cardDescInput.value = "";
  cardTypeInput.value = "video";

  // 再描画
  renderAddedLinksList();
  renderPreview();
}

// 5. リンクカードの削除処理
function handleRemoveCard(index) {
  cards.splice(index, 1);
  renderAddedLinksList();
  renderPreview();
}

// 6. エディタ内での「追加済みリンク」のリスト表示
function renderAddedLinksList() {
  addedLinksList.innerHTML = "";
  cards.forEach((card, index) => {
    const li = document.createElement("li");
    
    const label = document.createElement("span");
    const icons = { video: "🎥", blog: "📝", tool: "🛠️" };
    label.textContent = `${icons[card.type] || "🔗"} ${card.title}`;
    label.style.overflow = "hidden";
    label.style.textOverflow = "ellipsis";
    label.style.whiteSpace = "nowrap";
    label.style.maxWidth = "280px";
    
    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.textContent = "削除";
    btnRemove.addEventListener("click", () => handleRemoveCard(index));

    li.appendChild(label);
    li.appendChild(btnRemove);
    addedLinksList.appendChild(li);
  });
}

// YouTubeのURLから動画IDを抽出するヘルパー関数
function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// 7. ポータルサイトのHTML部分を組み立てる共通関数
function generatePortalHtml(includeDrafts = true) {
  // 日記リストのディープコピー
  let allDiaries = [...diaries];
  
  // 入力中の下書きがあれば、プレビュー用に追加する
  if (includeDrafts) {
    const currentTitle = diaryTitleInput.value.trim();
    const currentBody = diaryBodyInput.value.trim();
    const currentDate = diaryDateInput.value;
    
    if (currentTitle || currentBody) {
      allDiaries.push({
        title: currentTitle || "無題の日記（入力中...）",
        date: currentDate || today,
        body: currentBody || "本文を入力中...",
        isDraft: true
      });
    }
  }

  // 日付の新しい順（降順）にソート
  allDiaries.sort((a, b) => new Date(b.date) - new Date(a.date));

  let html = `
    <div class="portal-container">
      <header class="portal-header">
        <h1>Hide's Portal 🌟</h1>
        <p class="portal-subtitle">ひでの日記とリンク集</p>
      </header>
  `;

  // 日記セクションの出力
  if (allDiaries.length > 0) {
    html += `
      <section class="portal-diaries-section">
        <h2>日記 📝</h2>
        <div class="diaries-list">
    `;
    allDiaries.forEach(diary => {
      html += `
        <article class="portal-diary-card${diary.isDraft ? ' draft' : ''}">
          <header class="diary-header">
            <h3>${escapeHtml(diary.title)}${diary.isDraft ? '<span class="draft-badge">作成中</span>' : ''}</h3>
            <span class="diary-date">${escapeHtml(diary.date)}</span>
          </header>
          <div class="diary-body">${escapeHtml(diary.body)}</div>
        </article>
      `;
    });
    html += `
        </div>
      </section>
    `;
  }

  // リンクカードセクションの出力
  if (cards.length > 0) {
    html += `
      <section class="portal-links-section">
        <h2>お気に入りリンク 🔗</h2>
        <div class="portal-grid">
    `;

    cards.forEach(card => {
      const youtubeId = getYouTubeId(card.url);
      
      if (card.type === "video" && youtubeId) {
        // YouTube動画の埋め込みプレイヤー
        html += `
          <div class="portal-card video-card">
            <div class="video-container">
              <iframe src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.desc)}</p>
            <a href="${escapeHtml(card.url)}" target="_blank" rel="noopener noreferrer" class="card-arrow">YouTubeで開く ➔</a>
          </div>
        `;
      } else {
        // 通常のリンクカード
        const icons = { video: "🎥", blog: "📝", tool: "🛠️" };
        const arrowTexts = { video: "動画を見る ➔", blog: "記事を読む ➔", tool: "ツールを開く ➔" };
        
        html += `
          <a href="${escapeHtml(card.url)}" class="portal-card ${escapeHtml(card.type)}" target="_blank" rel="noopener noreferrer">
            <span class="card-icon">${icons[card.type] || "🔗"}</span>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.desc)}</p>
            <span class="card-arrow">${arrowTexts[card.type] || "リンクを開く ➔"}</span>
          </a>
        `;
      }
    });

    html += `
        </div>
      </section>
    `;
  }

  // フッター
  html += `
      <footer class="portal-footer">
        <p>© ${new Date().getFullYear()} ひでのAI学び直しラボ - Powered by Hide Portal Generator 🎀</p>
      </footer>
    </div>
  `;

  return html;
}

// 8. 右側のプレビュー画面のレンダリング
function renderPreview() {
  portalPreview.innerHTML = generatePortalHtml(true);
}

// 9. ローカルにHTMLファイルをダウンロード（保存）する処理
async function handleSaveLocal() {
  saveStatus.style.display = "block";
  saveStatus.style.backgroundColor = "#ffe3e3";
  saveStatus.style.color = "#ff5555";
  saveStatus.textContent = "保存中...";

  try {
    // ポータル用のデザインCSS（グラスモルフィズム）を直接定義
    const portalCss = `
      :root {
        --accent-pink: #ff79c6;
        --accent-blue: #8be9fd;
        --accent-green: #50fa7b;
        --portal-bg: radial-gradient(circle at top left, #2b1842, #0d0614);
        --portal-card-bg: rgba(255, 255, 255, 0.05);
        --portal-card-border: rgba(255, 255, 255, 0.1);
        --portal-text: #e0d5eb;
        --portal-text-bright: #ffffff;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Outfit', 'Noto Sans JP', sans-serif;
        background: var(--portal-bg) !important;
        color: var(--portal-text);
        overflow-y: auto !important;
      }
      .portal-container {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 48px;
        padding: 48px;
      }
      .portal-header {
        border-bottom: 1px solid var(--portal-card-border);
        padding-bottom: 24px;
      }
      .portal-header h1 {
        font-size: 36px;
        color: var(--portal-text-bright);
        font-weight: 800;
        letter-spacing: -1px;
        margin: 0;
      }
      .portal-subtitle {
        font-size: 14px;
        color: var(--accent-pink);
        font-weight: 600;
        margin-top: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .portal-diaries-section h2 {
        font-size: 20px;
        color: var(--portal-text-bright);
        margin-bottom: 24px;
        border-left: 4px solid var(--accent-pink);
        padding-left: 12px;
        margin-top: 0;
      }
      .diaries-list {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .portal-diary-card {
        background: var(--portal-card-bg);
        border: 1px solid var(--portal-card-border);
        border-radius: 16px;
        padding: 24px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        position: relative;
      }
      .portal-diary-card.draft {
        border-style: dashed;
        border-color: var(--accent-pink);
      }
      .diary-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        border-bottom: 1px solid var(--portal-card-border);
        padding-bottom: 12px;
        margin-bottom: 16px;
        gap: 16px;
        flex-wrap: wrap;
      }
      .diary-header h3 {
        font-size: 18px;
        color: var(--portal-text-bright);
        margin: 0;
      }
      .draft-badge {
        background-color: var(--accent-pink);
        color: #111;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 8px;
        vertical-align: middle;
      }
      .diary-date {
        font-size: 14px;
        color: var(--accent-pink);
        font-weight: 600;
      }
      .diary-body {
        font-size: 15px;
        line-height: 1.8;
        white-space: pre-wrap;
      }
      .portal-links-section h2 {
        font-size: 20px;
        color: var(--portal-text-bright);
        margin-bottom: 24px;
        border-left: 4px solid var(--accent-blue);
        padding-left: 12px;
        margin-top: 0;
      }
      .portal-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 20px;
      }
      .portal-card {
        background: var(--portal-card-bg);
        border: 1px solid var(--portal-card-border);
        border-radius: 16px;
        padding: 24px;
        text-decoration: none;
        color: var(--portal-text);
        display: flex;
        flex-direction: column;
        gap: 12px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                    box-shadow 0.3s, 
                    border-color 0.3s;
      }
      .portal-card:hover {
        transform: translateY(-8px);
        border-color: var(--accent-blue);
        box-shadow: 0 10px 20px rgba(139, 233, 253, 0.15),
                    0 0 20px rgba(139, 233, 253, 0.05);
        color: var(--portal-text-bright);
      }
      .portal-card.video:hover {
        border-color: var(--accent-pink);
        box-shadow: 0 10px 20px rgba(255, 121, 198, 0.15),
                    0 0 20px rgba(255, 121, 198, 0.05);
      }
      .portal-card.tool:hover {
        border-color: var(--accent-green);
        box-shadow: 0 10px 20px rgba(80, 250, 123, 0.15),
                    0 0 20px rgba(80, 250, 123, 0.05);
      }
      .portal-card.video-card {
        cursor: default;
        text-decoration: none;
      }
      .portal-card.video-card:hover {
        transform: translateY(-4px);
        border-color: var(--accent-pink);
        box-shadow: 0 6px 12px rgba(255, 121, 198, 0.1);
      }
      .video-container {
        position: relative;
        width: 100%;
        padding-top: 56.25%; /* 16:9 ratio */
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 8px;
        background: #000;
        border: 1px solid var(--portal-card-border);
      }
      .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }
      .card-icon {
        font-size: 24px;
      }
      .portal-card h3 {
        font-size: 16px;
        font-weight: 700;
        color: var(--portal-text-bright);
        margin: 0;
      }
      .portal-card p {
        font-size: 13px;
        line-height: 1.5;
        color: #a496b8;
        margin: 0;
      }
      .card-arrow {
        margin-top: auto;
        font-size: 12px;
        font-weight: 600;
        color: var(--accent-blue);
        display: flex;
        align-items: center;
        gap: 4px;
        text-decoration: none;
      }
      .portal-card.video .card-arrow, .portal-card.video-card .card-arrow { color: var(--accent-pink); }
      .portal-card.tool .card-arrow { color: var(--accent-green); }
      .portal-footer {
        margin-top: 48px;
        border-top: 1px solid var(--portal-card-border);
        padding-top: 24px;
        text-align: center;
        font-size: 12px;
        color: #6272a4;
      }
    `;

    // 下書き（現在入力中の日記）を排除して、純粋な保存用HTMLを生成
    const portalInnerContent = generatePortalHtml(false);

    // 完全なHTMLを組み立てる
    const fullHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hide's Portal 🌟</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Noto+Sans+JP:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    ${portalCss}
  </style>
</head>
<body>
  ${portalInnerContent}
</body>
</html>`;

    // 従来型の安全なダウンロード処理
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html"; // そのままGitHub Pages等にアップできるように index.html をデフォルトにする！
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    saveStatus.style.backgroundColor = "#e1f5fe";
    saveStatus.style.color = "#0288d1";
    saveStatus.textContent = "✅ index.htmlのダウンロードに成功しました！このファイルをそのまま公開用フォルダに保存してね。";
  } catch (err) {
    console.error(err);
    saveStatus.textContent = "❌ エラーが発生しました: " + err.message;
  }
}

// エッセージ処理（セキュリティ用）
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 初回レンダリング
renderAddedDiariesList();
renderAddedLinksList();
renderPreview();
