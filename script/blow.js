document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    const wishText = document.getElementById("wish");
    const instruction = document.getElementById("instruction");
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
  
    function updateCandleCount() {
      const activeCandles = candles.filter(
        (candle) => !candle.classList.contains("out")
      ).length;
      candleCountDisplay.textContent = activeCandles;
    }
  
    function addCandle(left, top) {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = left + "px";
      candle.style.top = top + "px";
  
      const flame = document.createElement("div");
      flame.className = "flame";
      candle.appendChild(flame);
  
      cake.appendChild(candle);
      candles.push(candle);
      updateCandleCount();
    }
  
    cake.addEventListener("click", function (event) {
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
    });
  
    function isBlowing() {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
  
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      let average = sum / bufferLength;
  
      return average > 40;
    }
  
    function blowOutCandles() {
        let blownOut = 0;
        if (isBlowing()) {
            candles.forEach((candle) => {
                if (!candle.classList.contains("out") && Math.random() > 0.5) {
                    candle.classList.add("out");
                    const flame = candle.querySelector(".flame");
                    if (flame) flame.classList.add("hide");
                    blownOut++;
                }
            });
        }

        if (blownOut > 0) {
            updateCandleCount();
            wishText.style.display = "block";
            launchConfetti();
        }}
  
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;
          setInterval(blowOutCandles, 200);
        })
        .catch(function (err) {
          console.log("Unable to access microphone: " + err);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  
    // const wishText = document.getElementById("wish");
    // const instruction = document.getElementById("instruction");
    
    function createCandles(count = 0) {
      for (let i = 0; i < count; i++) {
        const candle = document.createElement("div");
        candle.classList.add("candle");
  
        const flame = document.createElement("div");
        flame.classList.add("flame");
        candle.appendChild(flame);
  
        cake.appendChild(candle);
        candles.push(candle);
      }
      updateCandleCount();
      instruction.textContent = "Get ready to blow the candles!";
      startCountdown();
    }
  
    function startCountdown() {
      
      cake.appendChild(countdown);
  
      let number = 3;
      countdown.textContent = number;
      const interval = setInterval(() => {
        number--;
        if (number === 0) {
          countdown.textContent = "🎂";
          clearInterval(interval);
        } else {
          countdown.textContent = number;
        }
      }, 1000);
    }
  
    function launchConfetti() {
        const canvas = document.getElementById("confettiCanvas");
        canvas.style.display = "block"; // <- tambahkan ini!
      
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      
        const confetti = [];
        for (let i = 0; i < 100; i++) {
          confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 50 + 10,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          });
        }
      
        function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          confetti.forEach((p) => {
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            p.y += 2;
            p.x += Math.sin(p.d / 10);
            if (p.y > canvas.height) p.y = -10;
          });
          requestAnimationFrame(animate);
        }
      
        animate();
      }
      
      
  
    // Start the sequence
    setTimeout(() => {
      instruction.textContent = "Place the candles on the cake first 🎂";
      createCandles(5);
    }, 1000);
  });