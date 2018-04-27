function drawX(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(window.innerWidth, window.innerHeight);
    ctx.moveTo(window.innerWidth, 0);
    ctx.lineTo(0, window.innerHeight);
    ctx.strokeStyle = "#888888";
    ctx.stroke();
}

function drawRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawTriangle(ctx, x, y, length, color) {
    var radius = length / 2;
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x - radius, y + radius);
    ctx.lineTo(x + radius, y + radius);
    ctx.fillStyle = color;
    ctx.fill();
}

function clearAll(ctx) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function randomBetween(min, max) {
    var value = Math.random() * (max - min);
    return value + min;
}

function randomElement(array) {
    var random = Math.floor(Math.random() * array.length);
    return array[random];
}


function randomPos(left, top, right, bottom, params) {
    var border = params.border;

    var x1 = left + border;
    var x2 = window.innerWidth - right - border;
    var x3 = window.innerWidth / 2;

    var y1 = top + border;
    var y2 = window.innerHeight - bottom - border;
    var y3 = window.innerHeight / 2;

    var pos = {
        x: randomElement([x1, x2 /*, x3 */ ]),
        y: randomElement([y1, y2 /*, y3 */ ])
    }
    return pos;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawRandomRect(ctx, params) {
    var size = randomBetween(params.sizeMin, params.sizeMax);
    var halfSize = size / 2;
    var pos = randomPos(halfSize, halfSize, halfSize, halfSize, params);
    drawRect(ctx, pos.x - halfSize, pos.y - halfSize, size, size, getRandomColor())
}

function drawRandomCircle(ctx, params) {
    var radius = randomBetween(params.sizeMin / 2, params.sizeMax / 2);
    var pos = randomPos(radius, radius, radius, radius, params);
    drawCircle(ctx, pos.x, pos.y, radius, getRandomColor())
}

function drawRandomTriangle(ctx, params) {
    var radius = randomBetween(params.sizeMin / 2, params.sizeMax / 2);
    var pos = randomPos(radius, radius, radius, radius, params);
    drawTriangle(ctx, pos.x, pos.y, radius * 2, getRandomColor());
}

function drawShape(ctx, params) {
    var draws = [
        () => drawRandomRect(ctx, params),
        () => drawRandomCircle(ctx, params),
        () => drawRandomTriangle(ctx, params)
    ];

    var func = randomElement(draws);
    func();
}

function drawLoop(ctx, params) {
    params = params || {};
    clearAll(ctx);
    if (params.drawX)
        drawX(ctx);

    drawShape(ctx, params);
    setTimeout(() => {
        drawLoop(ctx, params);
    }, randomBetween(params.sleepMin, params.sleepMax));
}

var global = {
    drawX: false,
    border: 50,
    sizeMin: 80,
    sizeMax: 120,
    sleepMin: 500,
    sleepMax: 2000
}

function mixParams(p, pkey, g, gkey, convert = (s) => parseInt(s)) {
    if (has(p, pkey)) {
        g[gkey] = convert(p[pkey]);
    }
}

function fetchParams(p) {
    var g = global;
    mixParams(p, 'b', g, 'border');
    mixParams(p, 'smin', g, 'sizeMin');
    mixParams(p, 'smax', g, 'sizeMax');
    mixParams(p, 'dmin', g, 'sleepMin');
    mixParams(p, 'dmax', g, 'sleepMax');
    mixParams(p, 'x', g, 'drawX', s => true);
    return g;
}

function main(canvas) {
    //Always check for properties and methods, to make sure your code doesn't break in other browsers.
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');

        // make draw area full page
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        // fetch params from url
        var params = parseURLParams();
        var g = fetchParams(params);

        // drawing code here 
        drawLoop(ctx, g);
    } else {
        // canvas-unsupported code here
    }
}