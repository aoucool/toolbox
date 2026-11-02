// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// 一键复制命令
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.closest('.cmd-card')?.querySelector('.cmd-code')?.innerText;
        if (!code) return;
        navigator.clipboard.writeText(code).then(() => {
            btn.textContent = '✓ 已复制';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = '复制';
                btn.classList.remove('copied');
            }, 1500);
        });
    });
});

// 点击按键码复制 adb 命令
document.querySelectorAll('.keycode-item').forEach(item => {
    item.addEventListener('click', () => {
        const code = item.querySelector('.keycode-num').textContent;
        const cmd = `adb shell input keyevent ${code}`;
        navigator.clipboard.writeText(cmd).then(() => {
            const orig = item.querySelector('.keycode-name').textContent;
            item.querySelector('.keycode-name').textContent = '已复制!';
            setTimeout(() => {
                item.querySelector('.keycode-name').textContent = orig;
            }, 1200);
        });
    });
    item.title = '点击复制 adb shell input keyevent 命令';
});

// 搜索过滤
const searchInput = document.getElementById('search-input');
searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.cmd-card').forEach(card => {
        const name = card.querySelector('.cmd-name')?.textContent.toLowerCase() || '';
        const code = card.querySelector('.cmd-code')?.textContent.toLowerCase() || '';
        const tags = (card.dataset.tags || '').toLowerCase();
        card.classList.toggle('hidden', q !== '' && !name.includes(q) && !code.includes(q) && !tags.includes(q));
    });
});

// MD5 实现
function md5(buffer) {
    function safeAdd(x, y) {
        const lsw = (x & 0xffff) + (y & 0xffff);
        return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
    }
    function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
    function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
    function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
    function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
    function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

    const bytes = new Uint8Array(buffer);
    const len8 = bytes.length;
    const len32 = Math.ceil((len8 + 9) / 64) * 16;
    const M = new Int32Array(len32);
    for (let i = 0; i < len8; i++) M[i >> 2] |= bytes[i] << ((i % 4) * 8);
    M[len8 >> 2] |= 0x80 << ((len8 % 4) * 8);
    M[len32 - 2] = len8 * 8;

    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < len32; i += 16) {
        const [oa, ob, oc, od] = [a, b, c, d];
        a=md5ff(a,b,c,d,M[i],7,-680876936); d=md5ff(d,a,b,c,M[i+1],12,-389564586); c=md5ff(c,d,a,b,M[i+2],17,606105819); b=md5ff(b,c,d,a,M[i+3],22,-1044525330);
        a=md5ff(a,b,c,d,M[i+4],7,-176418897); d=md5ff(d,a,b,c,M[i+5],12,1200080426); c=md5ff(c,d,a,b,M[i+6],17,-1473231341); b=md5ff(b,c,d,a,M[i+7],22,-45705983);
        a=md5ff(a,b,c,d,M[i+8],7,1770035416); d=md5ff(d,a,b,c,M[i+9],12,-1958414417); c=md5ff(c,d,a,b,M[i+10],17,-42063); b=md5ff(b,c,d,a,M[i+11],22,-1990404162);
        a=md5ff(a,b,c,d,M[i+12],7,1804603682); d=md5ff(d,a,b,c,M[i+13],12,-40341101); c=md5ff(c,d,a,b,M[i+14],17,-1502002290); b=md5ff(b,c,d,a,M[i+15],22,1236535329);
        a=md5gg(a,b,c,d,M[i+1],5,-165796510); d=md5gg(d,a,b,c,M[i+6],9,-1069501632); c=md5gg(c,d,a,b,M[i+11],14,643717713); b=md5gg(b,c,d,a,M[i],20,-373897302);
        a=md5gg(a,b,c,d,M[i+5],5,-701558691); d=md5gg(d,a,b,c,M[i+10],9,38016083); c=md5gg(c,d,a,b,M[i+15],14,-660478335); b=md5gg(b,c,d,a,M[i+4],20,-405537848);
        a=md5gg(a,b,c,d,M[i+9],5,568446438); d=md5gg(d,a,b,c,M[i+14],9,-1019803690); c=md5gg(c,d,a,b,M[i+3],14,-187363961); b=md5gg(b,c,d,a,M[i+8],20,1163531501);
        a=md5gg(a,b,c,d,M[i+13],5,-1444681467); d=md5gg(d,a,b,c,M[i+2],9,-51403784); c=md5gg(c,d,a,b,M[i+7],14,1735328473); b=md5gg(b,c,d,a,M[i+12],20,-1926607734);
        a=md5hh(a,b,c,d,M[i+5],4,-378558); d=md5hh(d,a,b,c,M[i+8],11,-2022574463); c=md5hh(c,d,a,b,M[i+11],16,1839030562); b=md5hh(b,c,d,a,M[i+14],23,-35309556);
        a=md5hh(a,b,c,d,M[i+1],4,-1530992060); d=md5hh(d,a,b,c,M[i+4],11,1272893353); c=md5hh(c,d,a,b,M[i+7],16,-155497632); b=md5hh(b,c,d,a,M[i+10],23,-1094730640);
        a=md5hh(a,b,c,d,M[i+13],4,681279174); d=md5hh(d,a,b,c,M[i],11,-358537222); c=md5hh(c,d,a,b,M[i+3],16,-722521979); b=md5hh(b,c,d,a,M[i+6],23,76029189);
        a=md5hh(a,b,c,d,M[i+9],4,-640364487); d=md5hh(d,a,b,c,M[i+12],11,-421815835); c=md5hh(c,d,a,b,M[i+15],16,530742520); b=md5hh(b,c,d,a,M[i+2],23,-995338651);
        a=md5ii(a,b,c,d,M[i],6,-198630844); d=md5ii(d,a,b,c,M[i+7],10,1126891415); c=md5ii(c,d,a,b,M[i+14],15,-1416354905); b=md5ii(b,c,d,a,M[i+5],21,-57434055);
        a=md5ii(a,b,c,d,M[i+12],6,1700485571); d=md5ii(d,a,b,c,M[i+3],10,-1894986606); c=md5ii(c,d,a,b,M[i+10],15,-1051523); b=md5ii(b,c,d,a,M[i+1],21,-2054922799);
        a=md5ii(a,b,c,d,M[i+8],6,1873313359); d=md5ii(d,a,b,c,M[i+15],10,-30611744); c=md5ii(c,d,a,b,M[i+6],15,-1560198380); b=md5ii(b,c,d,a,M[i+13],21,1309151649);
        a=md5ii(a,b,c,d,M[i+4],6,-145523070); d=md5ii(d,a,b,c,M[i+11],10,-1120210379); c=md5ii(c,d,a,b,M[i+2],15,718787259); b=md5ii(b,c,d,a,M[i+9],21,-343485551);
        a=safeAdd(a,oa); b=safeAdd(b,ob); c=safeAdd(c,oc); d=safeAdd(d,od);
    }
    return [a, b, c, d].map(n => {
        let s = '';
        for (let j = 0; j < 4; j++) s += ('0' + ((n >> (j * 8)) & 0xff).toString(16)).slice(-2);
        return s;
    }).join('');
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function processFile(file) {
    const results = document.getElementById('md5-results');
    const item = document.createElement('div');
    item.className = 'md5-item loading';
    item.innerHTML = `
        <span class="file-name">📄 ${file.name}</span>
        <span class="file-size">${formatSize(file.size)}</span>
        <span class="md5-value">计算中...</span>
    `;
    results.prepend(item);
    const buffer = await file.arrayBuffer();
    const hash = md5(buffer);
    item.classList.remove('loading');
    item.querySelector('.md5-value').innerHTML = `
        <span>${hash}</span>
        <button class="copy-btn" onclick="navigator.clipboard.writeText('${hash}').then(()=>{this.textContent='✓ 已复制';this.classList.add('copied');setTimeout(()=>{this.textContent='复制';this.classList.remove('copied')},1500)})">复制</button>
    `;
}

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

dropZone?.addEventListener('click', () => fileInput.click());
fileInput?.addEventListener('change', e => [...e.target.files].forEach(processFile));
dropZone?.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone?.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    [...e.dataTransfer.files].forEach(processFile);
});

/* ============================================================
   设备代理：让工具箱网页直接操作投影仪
   前置条件：本机先运行 agent/server.py（双击「启动设备代理.bat」）
   链路：网页 → fetch → 127.0.0.1:8765 → adb → 设备
   ============================================================ */
const PROXY = 'http://127.0.0.1:8765';
const TOKEN_KEY = 'kiro_proxy_token';

const $id = id => document.getElementById(id);

function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}

function proxyHeaders() {
    const h = { 'Content-Type': 'application/json' };
    const t = getToken();
    if (t) h['X-Kiro-Token'] = t;
    return h;
}

async function proxyOnline() {
    try {
        const r = await fetch(PROXY + '/', { headers: proxyHeaders() });
        return r.ok;
    } catch { return false; }
}

async function refreshProxyStatus() {
    const dot = $id('proxy-status');
    const dev = $id('proxy-devices');
    const hint = $id('proxy-hint');
    if (!dot) return false;

    dot.className = 'proxy-status proxy-off';
    dot.textContent = '● 代理未启动';
    dev.textContent = '';
    if (hint) hint.style.display = '';

    if (!(await proxyOnline())) return false;

    dot.className = 'proxy-status proxy-on';
    dot.textContent = '● 代理已连接';
    if (hint) hint.style.display = 'none';
    try {
        const r = await fetch(PROXY + '/devices', { headers: proxyHeaders() });
        const j = await r.json();
        const list = (j.devices || []).filter(d => d.status === 'device');
        dev.textContent = list.length
            ? '设备：' + list.map(d => d.serial).join('、')
            : '未检测到设备';
    } catch {
        dev.textContent = '读取设备列表失败';
    }
    return true;
}

let JOB_ID = null;
let POLL_TIMER = null;

function stopPolling() {
    if (POLL_TIMER) { clearInterval(POLL_TIMER); POLL_TIMER = null; }
}

// 后台启动命令：立刻返回，输出靠轮询不断追加（logcat 这类不会自己结束的也行）
async function startCmd(cmd, name) {
    stopPolling();
    JOB_ID = null;

    const panel = $id('exec-panel');
    const out = $id('exec-output');
    const shot = $id('exec-shot');
    panel.classList.remove('hidden');
    shot.innerHTML = '';
    out.style.display = '';
    out.textContent = '$ ' + cmd + '\n\n启动中…';
    $id('exec-title').textContent = '● 启动中… ' + (name || '');

    try {
        const r = await fetch(PROXY + '/exec/start', {
            method: 'POST', headers: proxyHeaders(),
            body: JSON.stringify({ cmd })
        });
        const j = await r.json();
        if (!j.id) {
            $id('exec-title').textContent = '❌ 启动失败';
            out.textContent = '$ ' + cmd + '\n\n' + JSON.stringify(j);
            return;
        }
        JOB_ID = j.id;
        pollCmd();
        POLL_TIMER = setInterval(pollCmd, 800);
    } catch {
        $id('exec-title').textContent = '❌ 无法连接代理';
        out.textContent = '$ ' + cmd + '\n\n连不上 ' + PROXY +
            '\n请先双击运行「启动设备代理.bat」，再点「刷新」。';
    }
}

async function pollCmd() {
    if (!JOB_ID) return;
    let j;
    try {
        const r = await fetch(PROXY + '/exec/poll?id=' + JOB_ID + '&tail=300',
                              { headers: proxyHeaders() });
        j = await r.json();
    } catch {
        stopPolling();
        return;
    }
    if (!j || j.error) { stopPolling(); return; }

    const out = $id('exec-output');
    let head;
    if (j.done) head = j.stopped ? '■ 已停止' : '✅ 执行结束';
    else head = '● 执行中';
    $id('exec-title').textContent =
        head + ' — ' + j.elapsed + 's' + (j.done ? '' : '（点「关闭」即停止）');

    let body = j.output || '(暂无输出)';
    if (j.dropped_lines) body = '…（更早的 ' + j.dropped_lines + ' 行已丢弃）\n' + body;
    out.textContent = '$ ' + j.cmd + '\n累计 ' + j.total_lines + ' 行\n\n' + body;

    if (j.done) stopPolling();
}

// 停止：杀掉整棵进程树，已抓到的输出全部保留
async function stopCurrentJob() {
    if (JOB_ID) {
        try {
            await fetch(PROXY + '/exec/stop', {
                method: 'POST', headers: proxyHeaders(),
                body: JSON.stringify({ id: JOB_ID })
            });
        } catch {}
    }
    stopPolling();
    JOB_ID = null;
}

async function takeShot() {
    const panel = $id('exec-panel');
    const out = $id('exec-output');
    const shot = $id('exec-shot');
    panel.classList.remove('hidden');
    $id('exec-title').textContent = '设备截图';

    out.style.display = '';
    out.textContent = '正在从设备拉取截图…';
    shot.innerHTML = '';

    const img = new Image();
    img.alt = '设备截图';
    img.onload = () => { out.style.display = 'none'; };
    img.onerror = () => { out.textContent = '截图加载失败：代理没开，或设备没连上。'; };
    img.src = PROXY + '/screenshot/img?t=' + Date.now();
    shot.appendChild(img);
}

async function guardProxy() {
    if (await proxyOnline()) return true;
    alert('代理未启动。\n请先双击运行「启动设备代理.bat」，再回来点「刷新」。');
    return false;
}

// 给「单条命令」的卡片注入执行按钮（多行命令不注入，避免误执行）
document.querySelectorAll('.cmd-card').forEach(card => {
    const code = card.querySelector('.cmd-code')?.innerText || '';
    const lines = code.split('\n').map(s => s.trim()).filter(Boolean);
    if (lines.length !== 1) return;

    const btn = document.createElement('button');
    btn.className = 'copy-btn run-btn';
    btn.textContent = '执行';
    btn.title = '通过本机代理在设备上执行这条命令';
    btn.addEventListener('click', async () => {
        if (!(await guardProxy())) return;
        startCmd(lines[0], card.querySelector('.cmd-name')?.textContent || '');
    });
    card.appendChild(btn);
});

$id('proxy-refresh')?.addEventListener('click', refreshProxyStatus);
$id('proxy-shot')?.addEventListener('click', async () => {
    if (await guardProxy()) takeShot();
});
// 关闭 = 先停止正在跑的命令，再收起面板（跟关掉一个 cmd 窗口一样）
$id('exec-close')?.addEventListener('click', async () => {
    await stopCurrentJob();
    $id('exec-panel').classList.add('hidden');
});

refreshProxyStatus();
