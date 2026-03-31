/**curl
 * iKuai-Optimized GFW Blacklist Tool (v6.4.1 - Bugfix)
 *
 * This version fixes a syntax error in the DOMAIN_CATEGORY_MAP array.
 */

// --- Configuration ---
const GFWLIST_URL = 'https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt';
const DOMAINS_PER_CSV_ROW = 50;


// =================================================================
//  GLOBAL UI COMPONENTS & UTILITIES
// =================================================================
const newGlobalStyle = `
html { font-size: 87.5%; }
body, html { margin: 0; padding: 0; min-height: 100%; background-color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
}
.content-group {
  width: 100%;
  max-width: 700px;
  text-align: center;
  z-index: 10;
  box-sizing: border-box;
}
.profile-name { font-size: 2.2rem; color: #3d474d; margin-bottom: 10px; font-weight: bold;}
.profile-quote { color: #89949B; margin-bottom: 27px; min-height: 1.2em; }
.nav-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 27px; }
.nav-btn {
  padding: 8px 16px; text-align: center; background: #E8EBED; border: 2px solid #89949B;
  border-radius: 4px; color: #5a666d; text-decoration: none; font-weight: 500;
  font-size: 0.95rem; transition: all 0.3s; white-space: nowrap; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
}
.nav-btn:hover:not(:disabled) { background: #89949B; color: white; }
.nav-btn:disabled { opacity: 0.6; cursor: not-allowed;}
.nav-btn.primary { background-color: #5a666d; color: white; border-color: #5a666d;}
.nav-btn.primary:hover:not(:disabled) { background-color: #3d474d; }
.card {
  background: #f8f9fa; border: 1px solid #E8EBED; border-radius: 8px;
  padding: 24px; margin-bottom: 24px; text-align: left;
}
.card h2 { font-size: 1.5rem; color: #3d474d; margin-top: 0; margin-bottom: 20px; text-align: center;}
.form-group { margin-bottom: 16px; }
.form-group label { display: block; color: #5a666d; font-weight: 500; margin-bottom: 8px; font-size: 0.9rem;}
textarea, input[type="text"], input[type="number"], select {
  width: 100%; padding: 10px; border: 2px solid #89949B; border-radius: 4px;
  background: #fff; font-family: 'SF Mono', 'Courier New', monospace; font-size: 0.9rem;
  box-sizing: border-box; resize: vertical;
}
textarea:focus, input[type="text"]:focus, input[type="number"]:focus, select:focus { outline: none; border-color: #3d474d; }
.info-box, .config-link-box {
  background-color: #e8ebed; color: #5a666d; border-left: 4px solid #89949B;
  padding: 12px 16px; border-radius: 4px; font-size: 0.85rem; text-align: left;
  line-height: 1.5; margin: 16px 0;
}
.info-box a, .config-link-box a { color: #3d474d; font-weight: bold; text-decoration: none; word-break: break-all; }
.info-box a:hover, .config-link-box a:hover { text-decoration: underline; }
.config-link-box button { padding: 4px 8px; font-size: 0.8rem; height: auto; border-radius: 3px; margin-left:10px; vertical-align: middle;}
.footer {
  margin-top: 40px; text-align: center; color: #89949B; font-size: 0.8rem;
}
.footer a { color: #89949B; text-decoration: none; }
.footer a:hover { text-decoration: underline; }
.hidden { display: none; }
#toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
.toast {
    display: flex; align-items: center; padding: 12px 18px; border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-weight: 500; font-size: 0.9rem;
    border: 2px solid #89949B; background: #fff; color: #3d474d;
    opacity: 0; transform: translateX(100%);
    animation: slideIn 0.5s forwards, fadeOut 0.5s 4.5s forwards;
}
.toast svg { margin-right: 10px; width: 20px; height: 20px; }
@keyframes slideIn { to { opacity: 1; transform: translateX(0); } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateX(100%); } }
.loader {
    width: 16px; height: 16px; border: 2px solid white;
    border-bottom-color: transparent; border-radius: 50%;
    display: inline-block; box-sizing: border-box;
    animation: rotation 1s linear infinite; margin-right: 8px;
}
@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@media (max-width: 768px) {
    html { font-size: 100%; }
    .container { padding: 20px 15px; justify-content: flex-start; }
    .profile-name { font-size: 1.8rem; }
    .profile-quote { font-size: 0.95rem; margin-bottom: 20px; }
    .card { padding: 20px 15px; margin-bottom: 20px; }
    .card h2 { font-size: 1.3rem; }
    .nav-btn { padding: 9px 12px; font-size: 0.9rem; }
    .table-container th, .table-container td { padding: 8px 10px; font-size: 0.8rem; }
    .config-data-cell { max-width: 150px; }
    #toast-container { top: 10px; left: 10px; right: 10px; width: auto; transform: translateX(0); align-items: center; }
    .toast { width: 100%; max-width: 400px; animation: slideDown 0.5s forwards, fadeOut 0.5s 4.5s forwards; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-20px); } }
}
`;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/') {
            return this.serveHtml(env);
        }
        if (url.pathname === '/api/gfwlist_processed') {
            const categorizedDomains = await this.getCleanGfwDomains(false);
            const flatDomains = categorizedDomains.flatMap(cat => cat.domains).sort();
            return new Response(flatDomains.join('\n'), { headers: { 'Content-Type': 'text/plain;charset=UTF-8', 'Cache-Control': 'public, max-age=1800' } });
        }
        if (url.pathname === '/api/gfwlist_raw') {
            return this.serveRawGfwlistContent();
        }
        if (url.pathname === '/api/gfwlist.csv') {
            return this.serveIkuaiCsv(request);
        }
        return new Response('Not Found', { status: 404 });
    },

    async serveHtml(env) {
        const htmlContent = `
            <h1 class="profile-name">GFW 域名工具</h1>
            <p class="profile-quote">本工具提供两种格式的 GFW 黑名单、原始列表<strong>及相关 API 服务</strong>。</p>
            <div class="nav-grid">
                <a href="/" class="nav-btn primary">首页</a>
                <a href="https://bbs.yangzihome.space/archives/gfw-domain-api" target="_blank" rel="noopener noreferrer" class="nav-btn">API 文档</a>
            </div>
            <div class="card">
                <h2>1. CSV 批量导入 (推荐)</h2>
                <div class="form-group">
                    <label for="start_id">起始 ID:</label>
                    <input type="number" id="start_id" value="1" min="1">
                </div>
                <div class="form-group">
                    <label for="interface">线路端口:</label>
                    <input type="text" id="interface" value="wan3">
                </div>
                <div class="form-group">
                    <label for="src_addr">源地址:</label>
                    <input type="text" id="src_addr" value="内网">
                </div>
                <button id="download-csv-button" class="nav-btn primary" style="width:100%; padding: 12px;">生成并下载 CSV</button>
            </div>
            <div class="card">
                <h2>2. 纯文本域名列表</h2>
                <div style="display: flex; justify-content: flex-end; margin-bottom: 15px;">
                    <button id="copy-all-button" class="nav-btn">一键复制全部</button>
                </div>
                <div id="processed-list-container">
                    <textarea id="output" readonly rows="10" placeholder="正在加载预览..." style="min-height: 200px;"></textarea>
                </div>
            </div>
            <div class="card">
                <h2>3. 原始 GFWList (Base64 解码)</h2>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-weight: 500; font-size: 0.9rem; color: #5a666d;">完整原始列表预览</label>
                    <button id="copy-raw-gfwlist-button" class="nav-btn">一键复制</button>
                </div>
                <textarea id="raw-gfwlist-content" readonly rows="10" placeholder="正在加载原始 GFWList 内容..." style="min-height: 200px;"></textarea>
            </div>
            <footer class="footer">
                <p>Powered by YZFN | <a href="https://www.yangzihome.space/security.html" target="_blank" rel="noopener noreferrer">安全声明</a></p>
            </footer>
        `;

        const fullHtml = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GFW 域名工具</title>
        <link rel="icon" href="https://s3.yangzifun.org/logo.ico" type="image/x-icon">
        <style>${newGlobalStyle}</style>
      </head>
      <body>
        <div id="toast-container"></div>
        <div class="container">
          <div class="content-group">
            ${htmlContent}
          </div>
        </div>
        <script>
          const toastIcons = {
              success: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.293-6.293a1 1 0 011.414 0L12 13.414l2.879-2.88a1 1 0 111.414 1.415l-3.586 3.586a1 1 0 01-1.414 0L8.707 13.121a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>\`,
              error: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>\`,
              info: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>\`
          };
          function showToast(message, type = 'info') {
              const container = document.getElementById('toast-container');
              if(!container) { console.warn('Toast container not found, logging:', message); return;}
              const toast = document.createElement('div');
              toast.className = 'toast';
              toast.innerHTML = \`\${toastIcons[type] || toastIcons.info}<span>\${message}</span>\`;
              container.appendChild(toast);
              setTimeout(() => toast.remove(), 5000);
          }
          function setButtonLoading(button, isLoading, originalText = '') {
              if (isLoading) {
                  button.disabled = true;
                  button.dataset.originalText = button.innerHTML;
                  button.innerHTML = \`<span class="loader"></span><span>处理中...</span>\`;
              } else {
                  button.disabled = false;
                  button.innerHTML = originalText || button.dataset.originalText;
              }
          }
          (async () => {
            const processedListContainer = document.getElementById('processed-list-container');
            const copyAllButton = document.getElementById('copy-all-button');
            const startIdInput = document.getElementById('start_id');
            const interfaceInput = document.getElementById('interface');
            const srcAddrInput = document.getElementById('src_addr');
            const downloadCsvButton = document.getElementById('download-csv-button');
            const rawGfwlistContentElement = document.getElementById('raw-gfwlist-content');
            const copyRawGfwlistButton = document.getElementById('copy-raw-gfwlist-button');
            let originalRawGfwlistText = '';
            let processedRawText = '';
            setButtonLoading(copyAllButton, true);
            setButtonLoading(downloadCsvButton, true);
            setButtonLoading(copyRawGfwlistButton, true);
            try {
                const fetchProcessedDomains = (async () => {
                    const response = await fetch('/api/gfwlist_processed');
                    if (!response.ok) throw new Error('Failed to load processed list.');
                    processedRawText = await response.text();
                    const lines = processedRawText.trim().split('\\n');
                    
                    processedListContainer.innerHTML = '';
                    const chunkSize = 1000;
                    for (let i = 0; i < lines.length; i += chunkSize) {
                        const chunk = lines.slice(i, i + chunkSize);
                        const startIdx = i + 1;
                        const endIdx = i + chunk.length;
                        
                        const numberedText = chunk.map((line, index) => \`\${String(startIdx + index).padStart(5, ' ')}  \${line}\`).join('\\n');
                        const chunkRawText = chunk.join('\\n');
                        
                        const wrapper = document.createElement('div');
                        wrapper.style.marginBottom = i + chunkSize < lines.length ? '20px' : '0';
                        
                        const headerDiv = document.createElement('div');
                        headerDiv.style = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';
                        
                        const label = document.createElement('label');
                        label.style = 'font-weight: 500; font-size: 0.9rem; color: #5a666d; margin: 0;';
                        label.textContent = \`域名列表 (第 \${startIdx} - \${endIdx} 条)\`;
                        
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'nav-btn';
                        copyBtn.textContent = '复制此区域';
                        copyBtn.onclick = async () => {
                            const originalText = copyBtn.innerHTML;
                            setButtonLoading(copyBtn, true);
                            try {
                                await navigator.clipboard.writeText(chunkRawText);
                                showToast(\`已复制第 \${startIdx} - \${endIdx} 条到剪贴板！\`, 'success');
                                setButtonLoading(copyBtn, false, '已复制! ✅');
                                setTimeout(() => setButtonLoading(copyBtn, false, originalText), 2000);
                            } catch (err) {
                                showToast('复制失败，请手动操作。', 'error');
                                setButtonLoading(copyBtn, false, originalText);
                            }
                        };
                        
                        const textarea = document.createElement('textarea');
                        textarea.readOnly = true;
                        textarea.rows = 10;
                        textarea.style.minHeight = '200px';
                        textarea.value = numberedText;
                        
                        headerDiv.appendChild(label);
                        headerDiv.appendChild(copyBtn);
                        wrapper.appendChild(headerDiv);
                        wrapper.appendChild(textarea);
                        
                        processedListContainer.appendChild(wrapper);
                    }
                    
                    showToast('GFW 加工列表加载成功！', 'success');
                    setButtonLoading(copyAllButton, false, '一键复制全部');
                    setButtonLoading(downloadCsvButton, false, '生成并下载 CSV');
                })();
                const fetchOriginalGfwlist = (async () => {
                    const rawResponse = await fetch('/api/gfwlist_raw');
                    if (!rawResponse.ok) throw new Error('Failed to load original GFWList.');
                    const base64Content = await rawResponse.text();
                    originalRawGfwlistText = atob(base64Content);
                    rawGfwlistContentElement.textContent = originalRawGfwlistText;
                    showToast('原始 GFWList (Base64 解码) 加载成功！', 'success');
                    setButtonLoading(copyRawGfwlistButton, false, '一键复制');
                })();
                await Promise.all([fetchProcessedDomains, fetchOriginalGfwlist]);
            } catch (error) {
                if (!processedRawText) {
                    processedListContainer.innerHTML = \`<textarea readonly rows="10" style="min-height: 200px;">加载加工列表失败: \${error.message}</textarea>\`;
                    showToast('GFW 加工列表加载失败!', 'error');
                }
                if (!originalRawGfwlistText) {
                    rawGfwlistContentElement.textContent = '加载原始 GFWList 失败: ' + error.message;
                    showToast('原始 GFWList 加载失败!', 'error');
                }
                setButtonLoading(copyAllButton, true);
                setButtonLoading(downloadCsvButton, true);
                setButtonLoading(copyRawGfwlistButton, true);
            }
            copyAllButton.addEventListener('click', async () => {
              if (!processedRawText) return;
              const originalText = copyAllButton.innerHTML;
              setButtonLoading(copyAllButton, true);
              try {
                await navigator.clipboard.writeText(processedRawText);
                showToast('已复制全部加工内容到剪贴板！', 'success');
                setButtonLoading(copyAllButton, false, '已复制! ✅');
                setTimeout(() => setButtonLoading(copyAllButton, false, originalText), 2000);
              } catch (err) {
                showToast('复制失败，请手动操作。', 'error');
                setButtonLoading(copyAllButton, false, originalText);
              }
            });
            downloadCsvButton.addEventListener('click', () => {
              const originalText = downloadCsvButton.innerHTML;
              setButtonLoading(downloadCsvButton, true);
              try {
                const params = new URLSearchParams({
                  start_id: startIdInput.value || '1',
                  interface: interfaceInput.value || 'wan3',
                  src_addr: srcAddrInput.value || '内网'
                });
                window.location.href = \`/api/gfwlist.csv?\${params.toString()}\`;
                showToast('CSV 文件已开始下载！', 'success');
              } catch (err) {
                showToast('下载 CSV 失败: ' + err.message, 'error');
              } finally {
                setButtonLoading(downloadCsvButton, false, originalText);
              }
            });
            copyRawGfwlistButton.addEventListener('click', async () => {
                if (!originalRawGfwlistText) return;
                const originalButtonText = copyRawGfwlistButton.innerHTML;
                setButtonLoading(copyRawGfwlistButton, true);
                try {
                    await navigator.clipboard.writeText(originalRawGfwlistText);
                    showToast('已复制原始 GFWList 内容到剪贴板！', 'success');
                    setButtonLoading(copyRawGfwlistButton, false, '已复制! ✅');
                    setTimeout(() => setButtonLoading(copyRawGfwlistButton, false, originalButtonText), 2000);
                } catch (err) {
                    showToast('复制失败，请手动操作。', 'error');
                    setButtonLoading(copyRawGfwlistButton, false, originalButtonText);
                }
            });
          })();
        </script>
      </body>
      </html>
    `;
        return new Response(fullHtml, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    },
    
    DOMAIN_CATEGORY_MAP: [
        { name: "Google 服务", keywords:["google", "youtube", "blogspot", "gvt1", "goo.gl", "gtimg", "gstatic"] },
        { name: "Facebook/Meta", keywords:["facebook", "fbcdn", "instagram", "messenger", "meta", "oculus", "whatsapp", "threads"] },
        { name: "Twitter/X", keywords:["twitter", "t.co", "twimg", "periscope", "pscp", "tweetdeck", "x.com"] },
        { name: "Telegram", keywords:["telegram", "t.me", "tg.dev", "graph.org", "telegra.ph", "cdn-telegram"] },
        { name: "TikTok", keywords: ["tiktok", "tiktokv", "tiktokcdn"] },
        { name: "加密货币", keywords:["binance", "coinbase", "huobi", "okex", "okx", "bitfinex", "bitmex", "bybit", "gate.io", "kraken", "kucoin", "etherscan", "opensea", "pool", "c3pool", "unmineable", "antpool", "sparkpool", "nanopool", "hiveon", "solana", "pancakeswap", "tronscan", "solscan", "tokenlon", "trustwallet", "metamask", "bitcoinworld"] },
        { name: "新闻媒体", keywords:["nytimes", "bbc", "reuters", "epochtimes", "voa", "rfa", "dw", "wsj", "bloomberg", "huffingtonpost", "newsmax", "theatlantic", "forbes", "cnn", "aljazeera", "apnews", "independent.co.uk", "ft.com", "channelnewsasia", "jiji.com", "nikkei.com", "japantimes.co.jp", "dailymail.co.uk", "washingtonpost.com", "bnn.co", "businessinsider.com", "techcrunch.com"] },
        { name: "社交媒体", keywords:["mastodon", "bsky.app", "bsky.social", "gettr.com", "reddit", "redditstatic", "redd.it", "redditspace", "quora", "pinterest", "tumblr", "imgur", "gab.com", "counter.social", "v2ex.com", "doosho.com", "line.me", "line-apps.com", "discord", "discordapp", "mewe.com", "myspace.com", "mixi.jp", "plurk.com", "tapatalk.com"] },
        { name: "论坛/博客", keywords:["blogspot.com", "mitbbs.com", "backchina.com", "wenxuecity.com", "blogblog.com", "ameblo.jp", "fc2.com", "medium.com", "wordpress.com", "github.io", "buzzorange.com", "matters.news", "pincong.rocks", "teddysun.com", "freewechat.com", "freeweibo.com", "blogtd.org", "programthink"] },
        { name: "娱乐/流媒体", keywords:["youtube", "netflix", "crunchyroll", "hulu", "vimeo", "twitch", "jtvnw", "ttvnw", "spotify", "deezer", "pandora", "primevideo", "vevo", "nflximg", "abematv", "bitchute", "odysee", "rumble", "dailymotion", "nicovideo.jp", "youmaker.com", "viu.tv", "mgoon.com", "radiko.jp", "tvmost.com.hk", "soundon.fm", "podbean.com", "overcast.fm", "castbox.fm", "soundcloud.com", "audiomack.com"] },
        { name: "成人内容", keywords:["porn", "sex", "avmo", "jav", "e-hentai", "exhentai", "fakku", "beeg.com", "91porn", "youjizz", "pornhub", "xvideos", "tnaflix", "brazzers", "redtube", "nudevista", "xhamster", "hitomi.la", "pixiv.net", "danbooru.donmai.us", "rule34.*", "e621.net", "gelbooru.com", "wnacg.com", "madthumbs.com", "motherless.com", "g-area.org", "javdb.com", "jable.tv", "missav.com", "sehuatang.org", "adult-sex-games.com", "erodaizensyu.com", "erodoujinlog.com", "erodoujinworld.com", "eromanga-kingdom.com", "hanime.tv"] },
        { name: "VPN/代理工具", keywords:["vpn", "shadowsocks", "psiphon", "freess", "expressvpn", "nordvpn", "surfshark", "clash", "v2ray", "trojan", "tunnel", "ikuai", "gfwlist", "autoproxy", "getlantern", "gol", "goagent", "sstm.moe", "proxpn", "hidemyass", "ivpn", "strongvpn", "purevpn", "zenmate", "openvpn", "wingy", "potatso", "vnet.link", "betaclouds.net", "vpsxb.net", "justmysocks", "cloudcone.com", "onevps.com", "ramnode.com", "bandwagonhost.com", "shadowsky.xyz", "v2fly.org", "radmin-vpn.com", "tunsafe.com", "azirevpn.com", "mullvad.net", "hideme.nl", "safervpn.com", "tigervpn.com", "switchvpn.net", "routeros.org"] },
        { name: "技术/编程", keywords:["github", "gitlab", "docker", "goproxy", "golang", "tensorflow", "pytorch", "archlinux", "kernel.org", "opensuse.org", "ubuntu.com", "manjaro.org", "debian.org", "gentoo.org", "freedesktop.org", "gnome.org", "kde.org", "mozilla.org", "chromium.org", "android.com", "apple.com", "microsoft.com", "cloudflare", "duckduckgo", "stackexchange", "stackoverflow", "superuser.com", "serverfault.com", "askubuntu.com", "segmentfault.com", "cnblogs.com", "v2ray.com", "psiphon3.com", "shadowsocks.org", "getlantern.org", "openvpn.net", "wireguard.com", "haproxy.org", "proxifier.com", "squid-cache.org", "nginx.org", "apache.org", "ietf.org", "w3.org", "developer.mozilla.org"] },
        { name: "人权/政治敏感", keywords:["tibet", "falun", "dalailama", "amnesty.org", "hrw.org", "freedomhouse.org", "chrdnet.com", "humanrights", "ng", "64", "tiananmen", "uyghur", "eastturkestan", "hongkongfp", "g0v", "lhakar", "boxun", "peacefire", "chinachange", "chinadigitaltimes", "greatfire", "badiucao", "victomsofcommunism", "taiwanjustice", "freehongkong", "demosisto", "lih.kg", "pixelqi.com", "citizenlab.ca", "safeguarddefenders.com", "bitterwinter.org", "cipfg.org", "rthk.hk", "appledaily.com", "theinitium.com", "pincong.rocks", "2047.one", "mohu.club"] },
        // ================== FIXED LINE BELOW ==================
        { name: "影音/图片", keywords:["gettyimages", "unsplash", "shutterstock", "giphy", "imgur", "deviantart", "artstation", "pixiv.net", "bilibili.tv", "dmhy.org", "dlsite.com", "mangafox", "mangabz", "doujincafe.com", "eromanga", "animecrazy.net", "acg.rip", "bangumi.moe", "mikanani.me", "nyaa.si", "torrentgalaxy", "rarbgprx", "1337x.to", "btbtt"] },
        // ================== FIXED LINE ABOVE ==================
        { name: "军事/政府/国际组织", keywords:["mil", "gov", "nasa", "cia", "fbi", "darpa", "state.gov", "un.org", "who.int", "interpol.int", "whitehouse.gov", "usembassy.gov", "pentagon.mil", "dma.mil"] },
        { name: "台湾地区", keywords:["tw", "taiwan", "moj.gov", "ey.gov", "ly.gov", "ndc.gov", "pchome.com.tw", "udn.com.tw", "ltn.com.tw", "appledaily.com.tw", "ettoday.net", "thenewslens.com", "ftv.com.tw", "taiwannews.com.tw", "taipeitimes.com", "news.ebc.net.tw", "ctitv.com.tw", "tbsn.org", "ntdtv.com.tw", "hinet.net", "yam.com", "kobo.com", "readmoo.com", "books.com.tw", "kingstone.com.tw", "ruten.com.tw", "shopee.tw", "dcard.tw", "mobile01.com"] },
        { name: "香港地区", keywords:["hk", "hongkong", "hket.com", "rthk.hk", "hk01.com", "inmediahk.net", "theinitium.com", "mingpao.com", "appledaily.com.hk", "bastillepost.com", "hkgalden.com", "lihkg.com", "hkfront.org", "teco-hk.org", "tmdn.org", "tvmost.com.hk", "memehk.com", "jbtalks.cc", "uwants.com"] },
        { name: "云服务/CDN/存储", keywords:["s3.amazonaws.com", "cloudfront.net", "azurewebsites.net", "digitaloceanspaces.com", "linode.com", "vultr.com", "cdn.jsdelivr.net", "netlify.app", "vercel.app", "static.ly", "fastly.net", "cachefly.com", "akamaized.net", "akamaitech.net", "cloudflare-ipfs.com", "ipfs.io", "storj.io", "arvancloud.net", "arvanstorage.ir", "yadi.sk", "mail.ru", "dubox.com", "terabox.com"] },
        { name: "博客/个人网站", keywords: ["blogspot", "wordpress", "tumblr", "weebly", "carrd.co"] },
        { name: "游戏相关", keywords:["steamcommunity.com", "steampowered.com", "twitch.tv", "gamestorrents.com", "gamejolt.com", "play-asia.com", "bangdream.space", "mahjongsoul.com", "nikke.hotcool.tw", "paimon.moe", "tanks.gg", "wowhead.com"] },
        { name: "购物/电商", keywords:["amazon", "ebay", "etsy", "flipkart", "nordstrom", "costco", "target", "macys.com", "walmart.com", "aliexpress.com", "rakuten.co.jp", "mercari.com", "carousell.com.hk"] },
        { name: "学术/教育", keywords:["wikipedia", "wikimedia", "wikileaks", "scholar.google.com", "edx-cdn.org", "openvpn.org", "pytorch.org", "tensorflow.org", "archive.org", "annas-archive.org", "z-lib.org", "library.nu", "doaj.org", "ssrn.com"] }
    ],
    async getCleanGfwDomains(groupByCategory = true) {
        const response = await fetch(GFWLIST_URL, { cf: { cacheTtl: 3600, cacheEverything: true } });
        if (!response.ok) throw new Error(`Failed to fetch GFWList. Status: ${response.status}`);
        const base64Content = await response.text();
        const decodedContent = atob(base64Content);
        const lines = decodedContent.split('\n');
        const domainSet = new Set();
        const ipAddressRegex = /^\d{1,3}(\.\d{1,3}){3}$/;
        for (const line of lines) {
            let candidate = line.trim();
            if (!candidate || candidate.startsWith('!') || candidate.startsWith('[') || candidate.startsWith('@@')) continue;
            if (candidate.startsWith('||')) candidate = candidate.substring(2);
            else if (candidate.startsWith('|')) candidate = candidate.substring(1);
            else if (candidate.startsWith('.')) candidate = candidate.substring(1);
            const separatorIndex = candidate.search(/[/:]/);
            if (separatorIndex !== -1) candidate = candidate.substring(0, separatorIndex);
            if (candidate.startsWith('/') && candidate.endsWith('/')) {
                const domainMatch = candidate.slice(1, -1).match(/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}/);
                if (domainMatch) candidate = domainMatch[0]; else continue;
            }
            if (candidate.startsWith('*.')) candidate = candidate.substring(2);
            if (candidate && candidate.includes('.') && !ipAddressRegex.test(candidate)) domainSet.add(candidate.toLowerCase());
        }
        const uniqueDomains = Array.from(domainSet).sort();
        if (!groupByCategory) return [{ category: "通用", domains: uniqueDomains }];

        const categorizedResult = {};
        const uncategorizedDomains =[];
        for (const domain of uniqueDomains) {
            let foundCategory = false;
            for (const categoryDef of this.DOMAIN_CATEGORY_MAP) {
                if (categoryDef.keywords.some(keyword => domain === keyword || domain.endsWith('.' + keyword) || domain.includes(keyword + '.'))) {
                    if (!categorizedResult[categoryDef.name]) categorizedResult[categoryDef.name] = [];
                    categorizedResult[categoryDef.name].push(domain);
                    foundCategory = true;
                    break;
                }
            }
            if (!foundCategory) uncategorizedDomains.push(domain);
        }
        if (uncategorizedDomains.length > 0) {
            categorizedResult["通用服务"] = [...(categorizedResult["通用服务"] ||[]), ...uncategorizedDomains];
        }
        return Object.keys(categorizedResult).sort().map(categoryName => ({
            category: categoryName,
            domains: categorizedResult[categoryName].sort()
        }));
    },
    async serveIkuaiCsv(request) {
        try {
            const url = new URL(request.url);
            let currentId = parseInt(url.searchParams.get('start_id'), 10) || 1;
            const interfacePort = url.searchParams.get('interface') || 'wan3';
            const sourceAddress = url.searchParams.get('src_addr') || '内网';
            
            const categorizedDomains = await this.getCleanGfwDomains(true);
            const csvRows = ['id,enabled,comment,domain,interface,src_addr,week,time'];
            
            for (const { category, domains } of categorizedDomains) {
                for (let i = 0; i < domains.length; i += DOMAINS_PER_CSV_ROW) {
                    const chunk = domains.slice(i, i + DOMAINS_PER_CSV_ROW);
                    const domainCell = chunk.join(',');
                    const comment = `${category} (${Math.floor(i / DOMAINS_PER_CSV_ROW) + 1})`;
                    const row =[
                        currentId++, 'yes', `"${comment}"`, `"${domainCell}"`,
                        interfacePort, `"${sourceAddress}"`, '1234567', '00:00-23:59'
                    ];
                    csvRows.push(row.join(','));
                }
            }
            const csvContent = '\uFEFF' + csvRows.join('\n');
            return new Response(csvContent, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="gfwlist_ikuai_grouped.csv"'
                }
            });
        } catch (error) {
            console.error('CSV Generation Error:', error);
            return new Response(`Error generating CSV: ${error.message}`, { status: 500 });
        }
    },
    async serveRawGfwlistContent() {
        try {
            const response = await fetch(GFWLIST_URL, { cf: { cacheTtl: 3600, cacheEverything: true } });
            if (!response.ok) throw new Error(`Failed to fetch raw GFWList. Status: ${response.status}`);
            const base64Content = await response.text();
            return new Response(base64Content, { headers: { 'Content-Type': 'text/plain;charset=UTF-8', 'Cache-Control': 'public, max-age=3600' } });
        } catch (error) {
            console.error('Raw GFWList API Error:', error);
            return new Response(`Error fetching raw GFWList: ${error.message}`, { status: 500 });
        }
    },
};