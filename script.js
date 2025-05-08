// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyDAhFPe_j750iRzfv96xHAMX488sj6xBTs",
    authDomain: "saganak-24ec8.firebaseapp.com",
    databaseURL: "https://saganak-24ec8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "saganak-24ec8",
    storageBucket: "saganak-24ec8.firebasestorage.app",
    messagingSenderId: "394236997954",
    appId: "1:394236997954:web:c49ebc99d98722e31b98db",
    measurementId: "G-S1C78RYR9Z"
};

// Firebase'i başlat
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const songsRef = database.ref('Songs');
const selectedSongRef = database.ref('selectedSong');
const transposedSongRef = database.ref('transposedSong'); // Transpoze edilen şarkı

const chords = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

let currentSongHtml = "";
let currentSongId = "";

// Akorları ton olarak transpoze etme fonksiyonu
function transposeChord(chord, steps) {
    const index = chords.indexOf(chord);
    if (index === -1) return chord;
    const newIndex = (index + steps + chords.length) % chords.length;
    return chords[newIndex];
}

// Şarkı HTML içeriğindeki akorları transpoze etme fonksiyonu
function transposeSong(songHtml, steps) {
    const chordRegex = /\b(A|A#|B|C|C#|D|D#|E|F|F#|G|G#)\b/g;
    return songHtml.replace(chordRegex, (match) => {
        return transposeChord(match, steps);
    });
}

// Firebase'den şarkıları al
function getSongs() {
    songsRef.once('value', (snapshot) => {
        const songs = snapshot.val();
        const songsDropdown = document.getElementById('songsDropdown');
        songsDropdown.innerHTML = '<option value="" disabled selected>Bir şarkı seçin</option>';

        for (const songId in songs) {
            const song = songs[songId];
            const option = document.createElement('option');
            option.value = songId;
            option.textContent = song.Name;
            songsDropdown.appendChild(option);
        }
    });
}

// Şarkı seçildiğinde işlemleri başlat
document.getElementById('songsDropdown').addEventListener('change', (event) => {
    currentSongId = event.target.value;
    selectedSongRef.set(currentSongId);
});

// Firebase'deki seçilen şarkıyı al
selectedSongRef.on('value', (snapshot) => {
    const selectedSongId = snapshot.val();
    const songRef = database.ref('Songs/' + selectedSongId);
    songRef.once('value', (songSnapshot) => {
        const song = songSnapshot.val();
        currentSongHtml = song.Html;
        document.getElementById('songHtmlContainer').innerHTML = song.Html;
    });
});

// Ton yukarı butonuna tıklanması
document.getElementById('transposeUpButton').addEventListener('click', () => {
    currentSongHtml = transposeSong(currentSongHtml, 1);
    document.getElementById('songHtmlContainer').innerHTML = currentSongHtml;
});

// Ton aşağı butonuna tıklanması
document.getElementById('transposeDownButton').addEventListener('click', () => {
    currentSongHtml = transposeSong(currentSongHtml, -1);
    document.getElementById('songHtmlContainer').innerHTML = currentSongHtml;
});

// Kaydetme butonuna tıklanması
document.getElementById('saveButton').addEventListener('click', () => {
    transposedSongRef.set(currentSongHtml);
    alert('Şarkı kaydedildi!');
});

// Sayfa yüklendiğinde şarkıları çek
getSongs();
