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
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        
        if (sampleWindow.length > 5) {
            sampleWindow.pop();
            let sampleMin = min(sampleWindow);
            if (!black && bass < sampleMin) {
                cindex = (cindex + 36 % 360);
                black = true;
            } else {
                black = false;
            }
        }
        sampleWindow.unshift(bass);

        colors.unshift(`hsl(${cindex}, 50%, ${black ? 0 : (bass / 2.5)}%)`);
        if (colors.length > nodes.length) {
            colors.pop();
        }

        for (let i = 0; i < colors.length; i++) {
            nodes[i].style.backgroundColor = colors[i];
        }
    }, 50);
}

lightShow();