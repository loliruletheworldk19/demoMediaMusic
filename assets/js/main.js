const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    //SongNumber, default: 0
    currentIndex: 0,
    //State of the songNow
    isPlaying: false,
    //State randomBtn
    isRandom: false,
    //State repeatBtn
    isRepeat: false,
    //String object-data song
    songs: [
        {
            name: 'Anh đánh rơi người yêu này',
            singer: 'BéIu',
            path: './assets/music/music_1.mp4',
            image: './assets/img/65362843_p4_master1200.jpg'
        },
        {
            name: 'Cứ Chill Thôi',
            singer: 'BéIu',
            path: './assets/music/music_2.mp3',
            image: './assets/img/65417260_p0_master1200.jpg'
        },
        {
            name: 'Hare hare ya',
            singer: 'BéIu',
            path: './assets/music/music_3.mp3',
            image: './assets/img/65569924_p0_master1200.jpg'
        },
        {
            name: 'Nandemonaiya',
            singer: 'BéIu',
            path: './assets/music/music_4.mp3',
            image: './assets/img/65569924_p2_master1200.jpg'
        },
        {
            name: 'Blank Space',
            singer: 'BéIu',
            path: './assets/music/music_5.mp3',
            image: './assets/img/65569924_p1_master1200.jpg'
        },
        {
            name: 'Yến Vô Hiết',
            singer: 'BéIu',
            path: './assets/music/music_6.mp3',
            image: './assets/img/65569924_p3_master1200.jpg'
        }
    ],
    //Render các bài hát ra .playlist
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index == this.currentIndex ? 'active': ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join(`\n`)
    },
    //define
    defineProperties: function() {
        //định nghĩa cho currentSong: chọc vào songs[] bằng currentIndex
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    //Event
    handleEvent: function() {
        const cdWidth = cd.offsetWidth
        //cdAnimation
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], 
        {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        //scrollEvent
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //clickAudioEvent
        playBtn.onclick = function() {
            if(app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //btn-play
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play();
        }
        //btn-pause
        audio.onpause = function() {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }
        //Progress display
        const onTimeUpdateProgress = audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        onTimeUpdateProgress()
        //Progress adjustment
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime.toFixed()
        }
        //btn-Next
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
            } else {
                app.nextSong()
            }
            audio.play()
        }
        //btn-Prev
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
            } else {
                app.prevSong()
            }
            audio.play()
        }
        //btn-Random
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }
        //btn-Repeat
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
        }
        //after end the song
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        //click to choose the song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode && !e.target.closest('.option')) {
                document.getElementsByClassName('song')[app.currentIndex].classList.toggle('active',false)
                app.currentIndex = songNode.dataset.index
                app.loadCurrentSong()
                document.getElementsByClassName('song')[app.currentIndex].classList.toggle('active',true)
                audio.play()
            }
            if(e.target.closest('.option')) {
                console.log(`you are click option ${e.target.closest('.song').dataset.index}, it will be soon...`)
            }
        }
    },
    //Upload current song interface into dashboard
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        document.getElementsByClassName('song')[this.currentIndex].classList.toggle('active',false)
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        document.getElementsByClassName('song')[this.currentIndex].classList.toggle('active',true)
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        document.getElementsByClassName('song')[this.currentIndex].classList.toggle('active',false)
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        document.getElementsByClassName('song')[this.currentIndex].classList.toggle('active',true)
        this.loadCurrentSong()
    },
    start: function() {
        this.render();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
    }
}

app.start();