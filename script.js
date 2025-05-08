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

// Akor listesi ve transpozisyon fonksiyonu
const chords = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

function transposeChord(chord, steps) {
  const index = chords.indexOf(chord);
  if (index === -1) return chord; // Geçersiz akor
  const newIndex = (index + steps + chords.length) % chords.length; // Döngüsel kaydırma
  return chords[newIndex];
}

// Şarkı içeriğini transpoze etme
function transposeSong(songHtml, steps) {
  const chordRegex = /\b(A|A#|B|C|C#|D|D#|E|F|F#|G|G#)\b/g;
  return songHtml.replace(chordRegex, (match) => {
    return transposeChord(match, steps); // Bulunan akoru kaydır
  });
}

// Şarkıları Firebase'den al
function getSongs() {
  const songsRef = database.ref('Songs');
  songsRef.once('value', (snapshot) => {
    const songs = snapshot.val();
    const songsDropdown = document.getElementById('songsDropdown');
    
    // Dropdown menüsünü temizle
    songsDropdown.innerHTML = '<option value="" disabled selected>Bir şarkı seçin</option>';
    
    for (const songId in songs) {
      const song = songs[songId];
      const option = document.createElement('option');
      option.value = songId;
      option.textContent = song.Name.replace(/<\/?[^>]+(>|$)/g, ""); // HTML etiketlerini temizle
      songsDropdown.appendChild(option);
    }
  });
}

// Şarkı içeriğini göstermek
function showSongHtml(songId) {
  if (!songId) {
    document.getElementById('songHtmlContainer').innerHTML = ''; // Şarkı seçilmediyse içeriği temizle
    return;
  }

  const songRef = database.ref('Songs/' + songId);
  songRef.once('value', (snapshot) => {
    const song = snapshot.val();
    if (song && song.Html) {
      currentSongHtml = song.Html; // Şu anki şarkı HTML içeriğini sakla
      document.getElementById('songHtmlContainer').innerHTML = song.Html; // Şarkıyı göster
    } else {
      document.getElementById('songHtmlContainer').innerHTML = '<p>Şarkı içeriği bulunamadı.</p>';
    }
  });
}

// Şarkı seçildiğinde veriyi Firebase'e kaydet
document.getElementById('songsDropdown').addEventListener('change', (event) => {
  const selectedSongId = event.target.value;
  showSongHtml(selectedSongId);
});

// Butonları işle
document.getElementById('transposeUpButton').addEventListener('click', () => {
  const steps = 1; // 1 ses incele
  const transposedHtml = transposeSong(currentSongHtml, steps);
  document.getElementById('songHtmlContainer').innerHTML = transposedHtml; // Güncellenmiş içeriği göster
});

document.getElementById('transposeDownButton').addEventListener('click', () => {
  const steps = -1; // 1 ses kalınlaştır
  const transposedHtml = transposeSong(currentSongHtml, steps);
  document.getElementById('songHtmlContainer').innerHTML = transposedHtml; // Güncellenmiş içeriği göster
});

// 5 ses ileri
document.getElementById('transposeUp5Button').addEventListener('click', () => {
  const steps = 5; // 5 ses ileri
  const transposedHtml = transposeSong(currentSongHtml, steps);
  document.getElementById('songHtmlContainer').innerHTML = transposedHtml; // Güncellenmiş içeriği göster
});

// 5 ses geri
document.getElementById('transposeDown5Button').addEventListener('click', () => {
  const steps = -5; // 5 ses geri
  const transposedHtml = transposeSong(currentSongHtml, steps);
  document.getElementById('songHtmlContainer').innerHTML = transposedHtml; // Güncellenmiş içeriği göster
});

// Şarkıyı kaydetme
let currentSongHtml = ""; // Geçerli şarkı HTML içeriği

document.getElementById('saveButton').addEventListener('click', () => {
  const selectedSongId = document.getElementById('songsDropdown').value;
  if (selectedSongId && currentSongHtml) {
    const songRef = database.ref('Songs/' + selectedSongId);
    songRef.update({
      Html: currentSongHtml // Güncellenmiş şarkıyı kaydet
    }).then(() => {
      alert('Şarkı başarıyla kaydedildi!');
    }).catch((error) => {
      console.error('Kaydetme hatası:', error);
    });
  }
});

// Sayfa yüklendiğinde şarkıları çek
getSongs();
