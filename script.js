
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const resultContainer = document.getElementById('resultContainer');
  const messageBox = document.getElementById('messageBox');

  function showMessage(msg, type = 'info') {
    messageBox.textContent = msg;
    messageBox.className = `message ${type}`;
    messageBox.style.display = 'block';
  }

  function hideMessage() {
    messageBox.style.display = 'none';
  }

  function displayParticipantData(data) {
  resultContainer.innerHTML = `
    <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Data Racepack Peserta</h2>
    <div class="space-y-1 text-sm">
      <div class="grid grid-cols-3 gap-2">
        <div class="font-semibold">ID Pendaftar:</div>
        <div class="col-span-2">${data.id_pendaftar}</div>

        <div class="font-semibold">Nama:</div>
        <div class="col-span-2">${data.nama}</div>

        <div class="font-semibold">Jenis Kelamin:</div>
        <div class="col-span-2">${data.jenis_kelamin}</div>

        <div class="font-semibold">Ukuran Jersey:</div>
        <div class="col-span-2">${data.ukuran_jersey}</div>

        <div class="font-semibold">Nomor BIB:</div>
        <div class="col-span-2">${data.nomor_bib}</div>

        <div class="font-semibold">Kategori:</div>
        <div class="col-span-2">${data.kategori}</div>
      </div>
    </div>
  `;
}

  searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    resultContainer.style.display = 'none';

    if (!searchTerm) {
      showMessage('Mohon masukkan ID Pendaftar atau Nama.', 'info');
      return;
    }

    showMessage('Mencari data...', 'info');
    searchButton.disabled = true;

    try {
   const apiUrl = `https://racepak-backend-production.up.railway.app/api/peserta?query=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        if (data && data.id_pendaftar) {
          displayParticipantData(data);
          resultContainer.style.display = 'block';
          showMessage('Data ditemukan!', 'success');
        } else {
          showMessage('Data tidak ditemukan. Pastikan ID atau nama benar.', 'error');
        }
      } else if (response.status === 404) {
        showMessage('Data tidak ditemukan. Periksa kembali nama atau ID.', 'error');
      } else {
        const errorText = await response.text();
        showMessage(`Kesalahan server: ${response.status} - ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage(`Gagal menghubungi server: ${error.message}`, 'error');
    } finally {
      searchButton.disabled = false;
      setTimeout(hideMessage, 5000);
    }
  });

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') searchButton.click();
  });
