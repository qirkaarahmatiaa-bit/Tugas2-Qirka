new Vue({
    el: '#app',
    data: {
        pengirimanList: [
            { kode: "JNE Regular", nama: "JNE Regular (3-5 hari)" },
            { kode: "JNE Express", nama: "JNE Express (1-2 hari)" }
        ],
        paket: [
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
        ],
        listTracking: {
            "DO2026-001": {
                nim: "123456789",
                nama: "Rina Wulandari",
                status: "Dalam Perjalanan",
                ekspedisi: "JNE Regular",
                tanggalKirim: "2026-05-20",
                paket: "PAKET-UT-001",
                total: 120000,
                perjalanan: [
                    { waktu: "2026-05-20 10:12:20", keterangan: "Penerimaan di Loket Gudang UT Pusat" },
                    { waktu: "2026-05-21 08:44:01", keterangan: "Diteruskan ke Ekspedisi Hub Jakarta" }
                ]
            }
        },
        // Form Tracking DO
        formDo: {
            nim: '', nama: '', ekspedisi: '', paketKode: '',
            tanggalKirim: new Date().toISOString().split('T')[0], // Mengisi local time otomatis
            totalHarga: 0
        },
        selectedPaketDetail: null,
        sequenceCounter: 2, // Mulai dari urutan ke-2 (karena data pertama sudah terpakai di DO2026-001)
        errorDo: ''
    },
    watch: {
        // Watcher 3: Memantau perubahan input paket untuk mendeteksi log pencarian detail paket
        'formDo.paketKode'(newKode) {
            console.log(`Pengguna melihat spesifikasi paket: ${newKode || 'Kosong'}`);
        }
    },
    computed: {
        // Otomasi Generate Nomor DO Berjalan sesuai Tahun Aktual saat ini (2026)
        generatedDoNumber() {
            const tahun = new Date().getFullYear(); // Menghasilkan 2026
            const nomorUrut = String(this.sequenceCounter).padStart(3, '0');
            return `DO${tahun}-${nomorUrut}`;
        }
    },
    methods: {
        updatePaketDetail() {
            const pkt = this.paket.find(p => p.kode === this.formDo.paketKode);
            if (pkt) {
                this.selectedPaketDetail = pkt;
                this.formDo.totalHarga = pkt.harga; // Mengambil total harga otomatis dari objek paket
            } else {
                this.selectedPaketDetail = null;
                this.formDo.totalHarga = 0;
            }
        },
        simpanDO() {
            // Validasi Input
            if (!this.formDo.nim || !this.formDo.nama || !this.formDo.ekspedisi || !this.formDo.paketKode) {
                this.errorDo = "Mohon lengkapi semua data formulir tracking DO yang bertanda bintang (*)!";
                return;
            }

            const nomorDoBaru = this.generatedDoNumber;
            
            // Masukkan data baru ke dalam list object tracking
            Vue.set(this.listTracking, nomorDoBaru, {
                nim: this.formDo.nim,
                nama: this.formDo.nama,
                status: "Diproses di Gudang",
                ekspedisi: this.formDo.ekspedisi,
                tanggalKirim: this.formDo.tanggalKirim,
                paket: this.formDo.paketKode,
                total: this.formDo.totalHarga,
                perjalanan: [
                    { waktu: new Date().toLocaleString(), keterangan: "DO Baru Berhasil Dibuat. Menunggu Kurir Pick-up." }
                ]
            });

            alert(`Sukses! Nomor Transaksi ${nomorDoBaru} sukses diregistrasikan.`);
            
            // Increment sequence number untuk antrean berikutnya
            this.sequenceCounter++;
            this.errorDo = "";

            // Reset Form
            this.formDo = {
                nim: '', nama: '', ekspedisi: '', paketKode: '',
                tanggalKirim: new Date().toISOString().split('T')[0],
                totalHarga: 0
            };
            this.selectedPaketDetail = null;
        }
    }
});
