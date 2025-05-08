// Firebase'i başlat
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

// Firebase'i başlatmak
firebase.initializeApp(firebaseConfig);

// Database referansı
const database = firebase.database();

// Şarkı listesi ve içerik konteynerleri
const songsDropdown = document.getElementById('songsDropdown');
const songHtmlContainer = document.getElementById('songHtmlContainer');

// Şarkı listesini Firebase'den çekme
function getSongs() {
  const songsRef = database.ref('songs'); // Firebase'deki songs veritabanı
  songsRef.on('value', (snapshot) => {
    const songsData = snapshot.val(); // Veriyi al
    displaySongs(songsData); // Şarkıları dropdown'a ekle
  });
}

// Şarkı listelerini açılır menüye yazdırma
function displaySongs(songsData) {
  // Dropdown menüsünü temizle
  songsDropdown.innerHTML = '<option value="">Bir şarkı seçin</option>';

  for (const key in songsData) {
    if (songsData.hasOwnProperty(key)) {
      const song = songsData[key];
      const option = document.createElement('option');
      option.value = key; // songId'yi değeri olarak ayarla
      option.textContent = song.Name; // Şarkı adını metin olarak ayarla
      songsDropdown.appendChild(option);
    }
  }
}

// Şarkı içeriğini ekrana yazdırma
function showSongHtml(songId) {
  if (!songId) {
    songHtmlContainer.innerHTML = ''; // Şarkı seçilmediyse içeriği temizle
    return;
  }

  const songRef = database.ref('songs/' + songId);
  songRef.once('value', (snapshot) => {
    const song = snapshot.val();
    if (song && song.Html) {
      songHtmlContainer.innerHTML = song.Html; // HTML içeriğini göster
    } else {
      songHtmlContainer.innerHTML = '<p>Şarkı içeriği bulunamadı.</p>';
    }
  });
}

// Sayfa yüklendiğinde şarkıları çek
getSongs();

const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function transposeChord(chord, steps) {
  let suffix = "";
  const baseMatch = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!baseMatch) return chord;

  const base = baseMatch[1];
  suffix = baseMatch[2];

  let index = chords.indexOf(base);
  if (index === -1) return chord;

  let newIndex = (index + steps + chords.length) % chords.length;
  return chords[newIndex] + suffix;
}

function transposeLine(line, steps) {
  return line.replace(/\b[A-G][#b]?m?(7)?\b/g, chord => transposeChord(chord, steps));
}

let originalSong = "";
let transposedSong = "";

function transposeSelectedSong(steps) {
  const container = document.getElementById('songHtmlContainer');
  if (!originalSong) originalSong = container.innerText;

  const lines = originalSong.split('\n');
  const newLines = lines.map(line => transposeLine(line, steps));
  transposedSong = newLines.join('\n');
  container.innerHTML = `<pre>${transposedSong}</pre>`;
}

function saveTransposedSong() {
  const selectedSongId = document.getElementById('songsDropdown').value;
  if (!selectedSongId || !transposedSong) return alert("Önce bir şarkı seçin ve transpoze edin.");

  database.ref('Songs/' + selectedSongId).update({
    Html: `<pre>${transposedSong}</pre>`
  }).then(() => {
    alert("Transpoze edilmiş şarkı kaydedildi.");
  });
}

