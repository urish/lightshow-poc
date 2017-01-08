function sum(arr) {
    return arr.reduce((x, y) => x + y);
}

function min(arr) {
    return arr.reduce((x, y) => Math.min(x, y));
}

function max(arr) {
    return arr.reduce((x, y) => Math.max(x, y));
}

function avg(arr) {
    return sum(arr) / arr.length;
}

async function lightShow() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const socket = io();
    socket.binaryType = 'arraybuffer';
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    const nodes = [];
    for (let i = 0; i < 144; i++) {
        let node = document.createElement('span');
        node.className = 'led-node';
        document.querySelector('#container').appendChild(node);
        nodes.push(node);
    }

    const colors = [];
    let sampleWindow = [];
    let cindex = 0;
    setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        let bass = avg(Array.from(dataArray).slice(0, 20));
        let black = false;
        let maxBeat = false;
        
        if (sampleWindow.length > 5) {
            sampleWindow.pop();
            let sampleMin = min(sampleWindow);
            maxBeat = bass > max(sampleWindow);
            if (!black && bass < sampleMin) {
                cindex = (cindex + 2 % 360);
                black = true;
            } else {
                black = false;
            }
        }
        sampleWindow.unshift(bass);

        colors.unshift(`hsl(${cindex % 360}, 100%, ${black ? 0 : (bass / 2.5)}%)`);
        if (colors.length > nodes.length) {
            colors.pop();
        }

        const ab = new ArrayBuffer(colors.length * 3);
        const dv = new Uint8Array(ab);
        for (let i = 0; i < colors.length; i++) {
            let color = tinycolor(colors[i]);
            if (maxBeat) {
                color = tinycolor(`hsl(${cindex % 360}, 100%, ${black ? 0 : (bass / 2.5)}%)`);
            }
            nodes[i].style.backgroundColor = color.toRgbString();
            let rgb = color.toRgb();
            dv[i*3] = rgb.r;
            dv[i*3+1] = rgb.g;
            dv[i*3+2] = rgb.b;
        }
        socket.emit('message', ab);
    }, 20);
}

lightShow();