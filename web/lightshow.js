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
    setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < 20; i++) {
            sum = Math.max(sum, dataArray[i]);
        }

        colors.unshift(`rgb(${sum > 150 ? (sum - 150) * 5 : 0}, 0, 0)`);
        if (colors.length > nodes.length) {
            colors.pop();
        }

        for (let i = 0; i < colors.length; i++) {
            nodes[i].style.backgroundColor = colors[i];
        }
        console.log('sampl', sum);
    }, 100);
}

lightShow();