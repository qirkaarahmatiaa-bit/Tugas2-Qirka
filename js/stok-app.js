new Vue({
    el: '#app',
    data: {
        // Mengambil template struktur data dari dataBahanAjar.js
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        stok: [
            {
                kode: "EKMA4116",
                judul: "Pengantar Manajemen",
                kategori: "MK Wajib",
                upbjj: "Jakarta",
                lokasiRak: "R1-A3",
                harga: 65000,
                qty: 28,
                safety: 20,
                catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
            },
            {
                kode: "EKMA4115",
                judul: "Pengantar Akuntansi",
                kategori: "MK Wajib",
                upbjj: "Jakarta",
                lokasiRak: "R1-A4",
                harga: 60000,
                qty: 7,
                safety: 15,
                catatanHTML: "<strong>Cover baru</strong>"
            },
            {
                kode: "BIOL4201",
                judul: "Biologi Umum (Praktikum)",
                kategori: "Praktikum",
                upbjj: "Surabaya",
                lokasiRak: "R3-B2",
                harga: 80000,
                qty: 12,
                safety: 10,
                catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
            },
            {
                kode: "FISIP4001",
                judul: "Dasar-Dasar Sosiologi",
                kategori: "MK Pilihan",
                upbjj: "Makassar",
                lokasiRak: "R2-C1",
                harga: 55000,
                qty: 2,
                safety: 8,
                catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
            }
        ],
        // State Filter dan Sort
        filterUpbjj: '',
        filterKategori: '',
        filterReorder: false,
        sortBy: 'judul',
        editingIndex: null,

        // State Form Data Baru
        formBaru: {
            kode: '', judul: '', kategori: '', upbjj: '',
            lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
        },
        errorMsg: '',
        successMsg: ''
    },
    // Watcher minimal 2 untuk memantau perubahan data (Kriteria 1.5)
    watch: {
        // Watcher 1: Meriset filter kategori jika pilihan UT Daerah berubah/dikosongkan
        filterUpbjj(newVal) {
            this.filterKategori = '';
            console.log(`UT Daerah diubah ke: ${newVal || 'Semua'}`);
        },
        // Watcher 2: Memberi notifikasi di log jika mendeteksi ada total stok yang kosong setelah diedit
        stok: {
            handler(newStok) {
                const adaYangKosong = newStok.some(item => item.qty === 0);
                if (adaYangKosong) {
                    console.warn("Peringatan: Terdapat item bahan ajar dengan stok kosong (0)!");
                }
            },
            deep: true
        }
    },
    computed: {
        // Mengolah Filter & Sort tanpa merusak array data asli (Kriteria 1.4)
        filteredAndSortedStok() {
            let result = [...this.stok];

            // 1. Filter UT-Daerah
            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }

            // 2. Filter Kategori (Hanya jalan jika filterUpbjj aktif)
            if (this.filterUpbjj && this.filterKategori) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }

            // 3. Filter Re-order Alert (qty < safety atau qty == 0)
            if (this.filterReorder) {
                result = result.filter(item => item.qty < item.safety || item.qty === 0);
            }

            // 4. Fitur Sort (judul, stok/qty, harga)
            result.sort((a, b) => {
                if (this.sortBy === 'judul') {
                    return a.judul.localeCompare(b.judul);
                } else if (this.sortBy === 'qty') {
                    return a.qty - b.qty;
                } else if (this.sortBy === 'harga') {
                    return a.harga - b.harga;
                }
                return 0;
            });

            return result;
        }
    },
    methods: {
        resetFilter() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterReorder = false;
            this.sortBy = 'judul';
        },
        editStok(index) {
            this.editingIndex = index;
        },
        saveStok() {
            this.editingIndex = null;
            alert("Perubahan stok berhasil disimpan!");
        },
        tambahBahanAjar() {
            // Validasi Input Sederhana (Kriteria 1.6)
            if (!this.formBaru.kode || !this.formBaru.judul || !this.formBaru.kategori || !this.formBaru.upbjj || !this.formBaru.lokasiRak) {
                this.errorMsg = "Semua field bertanda bintang (*) wajib diisi!";
                this.successMsg = "";
                return;
            }
            if (this.formBaru.harga < 0 || this.formBaru.qty < 0 || this.formBaru.safety < 0) {
                this.errorMsg = "Nilai Harga, Stok, dan Safety tidak boleh minus!";
                this.successMsg = "";
                return;
            }

            // Push data baru ke array stok
            this.stok.push({ ...this.formBaru });
            this.successMsg = "Data bahan ajar baru berhasil ditambahkan!";
            this.errorMsg = "";

            // Reset formulir
            this.formBaru = {
                kode: '', judul: '', kategori: '', upbjj: '',
                lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
            };
        }
    }
});
