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
