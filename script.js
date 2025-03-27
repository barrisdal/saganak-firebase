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
const songsList = document.getElementById('songsList');
const songHtmlContainer = document.getElementById('songHtmlContainer');

// Şarkı listesini Firebase'den çekme
function getSongs() {
  const songsRef = database.ref('songs'); // Firebase'deki songs veritabanı
  songsRef.on('value', (snapshot) => {
    const songsData = snapshot.val(); // Veriyi al
    displaySongs(songsData); // Şarkıları ekrana yazdır
  });
}

// Şarkı listelerini ekrana yazdırma
function displaySongs(songsData) {
  songsList.innerHTML = ''; // Önceki listeyi temizle
  for (const key in songsData) {
    if (songsData.hasOwnProperty(key)) {
      const song = songsData[key];
      const songItem = document.createElement('li');
      songItem.textContent = song.Name;
      songItem.onclick = () => showSongHtml(song.Html); // Şarkı tıklandığında içerik göster
      songsList.appendChild(songItem);
    }
  }
}

// Şarkı içeriğini ekrana yazdırma
function showSongHtml(htmlContent) {
  songHtmlContainer.innerHTML = htmlContent;
}

// Sayfa yüklendiğinde şarkıları çek
getSongs();
