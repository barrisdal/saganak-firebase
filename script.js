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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const songsDropdown = document.getElementById('songsDropdown');
const songHtmlContainer = document.getElementById('songHtmlContainer');
const songsRef = database.ref('Songs');
const selectedSongRef = database.ref('selectedSong');

let originalSong = "";  // Orijinal şarkı HTML
let transposedSong = ""; // Transpoze edilmiş hali

// Şarkı listesini çek
songsRef.once('value', (snapshot) => {
  const songs = snapshot.val();
  songsDropdown.innerHTML = '<option value="" disabled selected>Bir şarkı seçin</option>';
  for (const songId in songs) {
    const song = songs[songId];
    const option = document.createElement('option');
    option.value = songId;
    option.textContent = song.Name.replace(/<\/?[^>]+(>|$)/g, "");
    songsDropdown.appendChild(option);
  }
});

// Şarkı seçilince Firebase'e yaz
songsDropdown.addEventListener('change', (event) => {
  const selectedSongId = event.target.value;
  selectedSongRef.set(selectedSongId);
});

// Yeni şarkı seçilince HTML'i göster ve transpoze sıfırla
selectedSongRef.on('value', (snapshot) => {
  const selectedSongId = snapshot.val();
  songsRef.child(selectedSongId).once('value', (songSnapshot) => {
    const song = songSnapshot.val();
    if (song && song.Html) {
      originalSong = song.Html;
      transposedSong = song.Html;
      songHtmlContainer.innerHTML = transposedSong;
    } else {
      songHtmlContainer.innerHTML = '<p>Şarkı içeriği bulunamadı.</p>';
    }
  });
});

// Akorları transpoze et
function transpose(step) {
  const chords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatMap = {'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'};

  function shiftChord(chord) {
    let match = chord.match(/^([A-G][b#]?)(.*)/);
    if (!match) return chord;
    let base = match[1];
    let rest = match[2] || "";
    if (flatMap[base]) base = flatMap[base];
    let index = chords.indexOf(base);
    if (index === -1) return chord;
    let newIndex = (index + step + 12) % 12;
    return chords[newIndex] + rest;
  }

  transposedSong = originalSong.replace(/\b[A-G][b#]?(m|dim|aug|sus[24]?|add\d*|\d*)?\b/g, shiftChord);
  songHtmlContainer.innerHTML = transposedSong;
}

// Transpozeyi sıfırla
function resetTranspose() {
  transposedSong = originalSong;
  songHtmlContainer.innerHTML = originalSong;
}

// Kaydet butonu (transpoze edilmiş hali Firebase'e yazar)
function saveBestVersion() {
  const selectedSongId = songsDropdown.value;
  if (!selectedSongId) return alert("Lütfen önce bir şarkı seçin.");
  database.ref('Songs/' + selectedSongId).update({
    Html: transposedSong
  }).then(() => {
    alert("Şarkının bu versiyonu kaydedildi.");
  }).catch((error) => {
    console.error("Kaydetme hatası:", error);
    alert("Bir hata oluştu.");
  });
}
