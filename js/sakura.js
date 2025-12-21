// 樱花飘落效果
var sakuraStop, sakuraStaticx, sakuraImg = new Image();

function Sakura(x, y, s, r, fn) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.r = r;
    this.fn = fn;
}

function getRandom(type) {
    var ret, random;
    switch (type) {
        case "x":
            ret = Math.random() * window.innerWidth;
            break;
        case "y":
            ret = Math.random() * window.innerHeight;
            break;
        case "s":
            ret = Math.random();
            break;
        case "r":
            ret = 6 * Math.random();
            break;
        case "fnx":
            random = 1 * Math.random() - 0.5;
            ret = function (x, y) {
                return x + 0.5 * random - 1.7;
            };
            break;
        case "fny":
            random = 1.5 + 0.7 * Math.random();
            ret = function (x, y) {
                return y + random;
            };
            break;
        case "fnr":
            random = 0.03 * Math.random();
            ret = function (r) {
                return r + random;
            };
    }
    return ret;
}

function startSakura() {
    requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame;

    var canvas, ctx = document.createElement("canvas");
    sakuraStaticx = true;
    ctx.height = window.innerHeight;
    ctx.width = window.innerWidth;
    ctx.setAttribute("style", "position: fixed;left: 0;top: 0;pointer-events: none;z-index: 9999;");
    ctx.setAttribute("id", "canvas_sakura");
    document.getElementsByTagName("body")[0].appendChild(ctx);

    canvas = ctx.getContext("2d");

    var sakuraList = new SakuraList();
    for (var i = 0; i < 50; i++) {
        var sakura, x, y, s, r, fnx, fny, fnr;
        x = getRandom("x");
        y = getRandom("y");
        r = getRandom("r");
        s = getRandom("s");
        fnx = getRandom("fnx");
        fny = getRandom("fny");
        fnr = getRandom("fnr");
        sakura = new Sakura(x, y, s, r, { x: fnx, y: fny, r: fnr });
        sakura.draw(canvas);
        sakuraList.push(sakura);
    }

    sakuraStop = requestAnimationFrame(function callee() {
        canvas.clearRect(0, 0, ctx.width, ctx.height);
        sakuraList.update();
        sakuraList.draw(canvas);
        sakuraStop = requestAnimationFrame(callee);
    });
}

function stopSakura() {
    if (sakuraStaticx) {
        var canvas = document.getElementById("canvas_sakura");
        if (canvas) {
            canvas.parentNode.removeChild(canvas);
        }
        if (sakuraStop) {
            window.cancelAnimationFrame(sakuraStop);
        }
        sakuraStaticx = false;
    }
}

sakuraImg.src = "/img/flower.png";

Sakura.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);
    ctx.drawImage(sakuraImg, 0, 0, 40 * this.s, 40 * this.s);
    ctx.restore();
};

Sakura.prototype.update = function () {
    this.x = this.fn.x(this.x, this.y);
    this.y = this.fn.y(this.x, this.y);
    this.r = this.fn.r(this.r);

    if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
        this.r = getRandom("fnr");
        if (Math.random() > 0.4) {
            this.x = getRandom("x");
            this.y = 0;
            this.s = getRandom("s");
            this.r = getRandom("r");
        } else {
            this.x = window.innerWidth;
            this.y = getRandom("y");
            this.s = getRandom("s");
            this.r = getRandom("r");
        }
    }
};

SakuraList = function () {
    this.list = [];
};

SakuraList.prototype.push = function (sakura) {
    this.list.push(sakura);
};

SakuraList.prototype.update = function () {
    for (var i = 0, len = this.list.length; i < len; i++) {
        this.list[i].update();
    }
};

SakuraList.prototype.draw = function (ctx) {
    for (var i = 0, len = this.list.length; i < len; i++) {
        this.list[i].draw(ctx);
    }
};

SakuraList.prototype.get = function (index) {
    return this.list[index];
};

SakuraList.prototype.size = function () {
    return this.list.length;
};

window.addEventListener('resize', function () {
    var canvas = document.getElementById("canvas_sakura");
    if (canvas && sakuraStaticx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// 樱花效果控制
var sakuraEnabled = false;

function toggleSakura() {
    sakuraEnabled = !sakuraEnabled;
    localStorage.setItem('sakuraEnabled', sakuraEnabled);
    
    var btn = document.getElementById('sakura-toggle-btn');
    if (btn) {
        if (sakuraEnabled) {
            btn.classList.add('active');
            btn.setAttribute('aria-label', '关闭樱花效果');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-label', '开启樱花效果');
        }
    }
    
    if (sakuraEnabled) {
        if (sakuraImg.complete && sakuraImg.naturalHeight !== 0) {
            startSakura();
        } else {
            sakuraImg.onload = function () {
                startSakura();
            };
        }
    } else {
        stopSakura();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 从localStorage读取设置
    var saved = localStorage.getItem('sakuraEnabled');
    if (saved !== null) {
        sakuraEnabled = saved === 'true';
    }
    
    // 在导航栏添加控制按钮
    var navbar = document.querySelector('#navbarSupportedContent ul');
    if (navbar) {
        var btn = document.createElement('li');
        btn.className = 'nav-item';
        btn.id = 'sakura-toggle-btn-wrapper';
        btn.innerHTML = '<a class="nav-link sakura-toggle" href="javascript:;" id="sakura-toggle-btn" aria-label="' + (sakuraEnabled ? '关闭樱花效果' : '开启樱花效果') + '" title="' + (sakuraEnabled ? '关闭樱花效果' : '开启樱花效果') + '">🌸</a>';
        if (sakuraEnabled) {
            btn.querySelector('#sakura-toggle-btn').classList.add('active');
        }
        navbar.appendChild(btn);
        
        document.getElementById('sakura-toggle-btn').addEventListener('click', toggleSakura);
    }
    
    // 如果启用，启动樱花效果
    if (sakuraEnabled) {
        if (sakuraImg.complete && sakuraImg.naturalHeight !== 0) {
            startSakura();
        } else {
            sakuraImg.onload = function () {
                startSakura();
            };
        }
    }
});

