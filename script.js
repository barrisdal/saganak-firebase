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

// Akor listesi
const chords = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

// Transpozeyi gerçekleştiren fonksiyon
function transposeChord(chord, steps) {
    const index = chords.indexOf(chord);
    if (index === -1) {
        return chord; // Geçersiz akor, olduğu gibi döndür
    }
    let newIndex = (index + steps) % chords.length;
    if (newIndex < 0) {
        newIndex += chords.length; // Negatif indexler için döngüsel geçiş
    }
    return chords[newIndex];
}

// Transpozeyi uygulama fonksiyonu
function transposeSong(songHtml, steps) {
    // Şarkı içeriğinde geçerli akorları bul ve her birini transpoze et
    let transposedHtml = songHtml;
    chords.forEach(chord => {
        const regex = new RegExp(`\\b${chord}\\b`, 'g'); // Akorları bulmak için regex
        transposedHtml = transposedHtml.replace(regex, match => transposeChord(match, steps));
    });
    return transposedHtml;
}

// Şarkıyı Firebase'e kaydetme
function saveTransposedSong(songId, transposedHtml) {
    const songRef = database.ref('songs/' + songId);
    songRef.update({
        Html: transposedHtml
    });
}

// Ton değiştirme butonları
document.getElementById('transposeUpButton').addEventListener('click', () => {
    const selectedSongId = document.getElementById('songsDropdown').value;
    if (!selectedSongId) return;

    // Şarkıyı al
    const songRef = database.ref('songs/' + selectedSongId);
    songRef.once('value', (snapshot) => {
        const song = snapshot.val();
        const transposedHtml = transposeSong(song.Html, 1); // 1 ton yukarı
        saveTransposedSong(selectedSongId, transposedHtml);
        document.getElementById('songHtmlContainer').innerHTML = transposedHtml; // Güncellenmiş şarkıyı göster
    });
});

document.getElementById('transposeDownButton').addEventListener('click', () => {
    const selectedSongId = document.getElementById('songsDropdown').value;
    if (!selectedSongId) return;

    // Şarkıyı al
    const songRef = database.ref('songs/' + selectedSongId);
    songRef.once('value', (snapshot) => {
        const song = snapshot.val();
        const transposedHtml = transposeSong(song.Html, -1); // 1 ton aşağı
        saveTransposedSong(selectedSongId, transposedHtml);
        document.getElementById('songHtmlContainer').innerHTML = transposedHtml; // Güncellenmiş şarkıyı göster
    });
});
