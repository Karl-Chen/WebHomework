const controlPanel = document.getElementById("controlPanel");
        const vAudioPlayer = document.getElementById("audioPlayer");
        const btnPlay = controlPanel.getElementsByTagName("span")[3];//document.getElementById("btnFunc");
        const btnMute = controlPanel.getElementsByTagName("span")[6];//document.getElementById("btnMute");
        // var isPlayPause = false;
        var isRepeate = 1;  //1是不重覆播放 2是重覆播放單首 3是整個歌單重覆播放 4隨機播放
        const musicList = controlPanel.getElementsByTagName("select")[0];//document.getElementById("songSelect");
        const input = controlPanel.getElementsByTagName("input");
        const volumeRange = input[0];//document.getElementById("volumeRange");
        const txtVol = input[3];//document.getElementById("volumeRange");
        const progressBar = input[4];
        const infoPanel = controlPanel.getElementsByTagName("div");
        const status = infoPanel[2];
        // const infoPanel = document.getElementById("pannel");
        volumeRange.value = vAudioPlayer.volume * 100;
        
        // infoPanel[0].innerText = getTimeFormat(vAudioPlayer.currentTime) + "/" + getTimeFormat(vAudioPlayer.duration);
        //判斷每首歌曲播完要做啥
        function musicState() {
            //如果不是最後一首歌，就播下一首，否則就停止播放
            //if (musicList.length == musicList.selectedIndex + 1)
            if (status.innerText == "單曲循環") {
                changeSong(0);
            }
            else if (status.innerText == "隨機播放"){
                let n = Math.floor(Math.random() * musicList.children.length);
                n -= musicList.selectedIndex;
                changeSong(n);
            }
            else if (status.innerText == "全曲循環" && musicList.length == musicList.selectedIndex + 1) {
                changeSong(0 - musicList.selectedIndex);
            }
            else if (musicList.length == musicList.selectedIndex + 1) {
                stopMusic();
            }
            else {
                changeSong(1);
            }

        }
        function setCircle() {
            status.innerText = status.innerText == "單曲循環" ? "正常" : "單曲循環";
        }
        function setRandom() {
            status.innerText = status.innerText == "隨機播放" ? "正常" : "隨機播放";
        }
        function setAllLoop() {
            status.innerText = status.innerText == "全曲循環" ? "正常" : "全曲循環";
        }

        function pauseMusic() {
            vAudioPlayer.pause();
            // btnPlay.innerText = "4";
            // btnPlay.onclick = playMusic;
            changeFunc(btnPlay, "4", playMusic);
            // document.write(typeof(playMusic));
            infoPanel[1].innerText = "音樂" + vAudioPlayer.title + "暫停中.....";
        }

        function playMusic() {
            vAudioPlayer.play();
            // btnPlay.innerText = ";";
            // btnPlay.onclick = pauseMusic;
            changeFunc(btnPlay, ";", pauseMusic);
            setInterval(() => getCurrentTime(), 0.1);
            infoPanel[1].innerText = "音樂播放" + vAudioPlayer.title + "中.....";
            progressBar.max = vAudioPlayer.duration * 10000;
        }

        function changeFunc(btn, inText, clickFunc) {
            btn.innerText = inText;
            btn.onclick = clickFunc;
        }

        function getTimeFormat(t) {
            let m = parseInt(t / 60);
            m = m < 10 ? "0" + parseInt(t / 60) : parseInt(t / 60);
            let s = parseInt(t % 60);
            s = s < 10 ? "0" + parseInt(t % 60) : parseInt(t % 60);
            return m + ":" + s;
        }

        function getCurrentTime() {
            infoPanel[0].innerText = getTimeFormat(vAudioPlayer.currentTime) + "/" + getTimeFormat(vAudioPlayer.duration);
            progressBar.value = vAudioPlayer.currentTime * 10000;
        }

        function setProgress() {
            vAudioPlayer.currentTime = parseInt(progressBar.value / 10000);
        }

        function stopMusic() {
            pauseMusic();
            vAudioPlayer.currentTime = 0; // 重置到開始
            infoPanel[1].innerText = "音樂" + vAudioPlayer.title + "停止.......";
        }

        // 直接在onclick裡面帶參數（神經病-.-）
        function funcChangeTime(sec) {
            vAudioPlayer.currentTime += sec;
        }
        function muteVolume() {
            controlmute("X", unmuteVolume);
        }
        function unmuteVolume() {
            controlmute("V", muteVolume);
        }
        function controlmute(text, click) {
            btnMute.innerText = text;
            vAudioPlayer.muted = !vAudioPlayer.muted;
            btnMute.onclick = click;
        }
        function setVolume(vol) {
            let val = vAudioPlayer.volume * 100 + vol;
            if (val > 100)
                val = 100;
            else if (val < 0)
                val = 0;
            volumeRange.value = val;
            changeVolumeValue();
        }
        //廢棄不使用
        function changeVolume(vol) {
            vAudioPlayer.volume = vol;
        }
        function changeVolumeValue() {
            // console.log(volumeRange.value);
            txtVol.value = volumeRange.value;
            vAudioPlayer.volume = volumeRange.value / 100;
        }

        function toEndMusic() {
            vAudioPlayer.currentTime = vAudioPlayer.ended;
        }
        function repeatMusic() {
            if (repeatMusic == 1) {
                //點了重覆播放
                vAudioPlayer.loop = true;
                repeatMusic = 2;
            }
            else if (repeatMusic == 2) {
                vAudioPlayer.loop = false;
                repeatMusic = 3;
                // TODO：整個曲單重覆播
            }
            else {
                vAudioPlayer.loop = false;
                repeatMusic = 1;
            }
        }
        function changeSong(n) {
            console.log(musicList.selectedIndex);
            let i = musicList.selectedIndex;//抓combobox選到的索引值
            vAudioPlayer.src = musicList.children[i + n].value;   //抓使用者選項value屬性值
            vAudioPlayer.title = musicList.children[i + n].innerText;
            musicList.selectedIndex = i + n;
            musicList.children.selected = true;
            if (btnPlay.innerText == ";")
                vAudioPlayer.onloadeddata = playMusic;
        }