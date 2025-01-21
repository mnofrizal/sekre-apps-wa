const templates = {
  fitAndProper: {
    template: `Selamat Siang Bapak/Ibu {name}
Sehubungan dengan pelaksanaan Fit and Proper Test untuk memotret Kompetensi maupun Potensi Pegawai ke jenjang {grade}.

Berikut kami sampaikan link aplikasi Talent Tune untuk melihat Jadwal, Evaluator dan konfirmasi kehadiran:

{link}

Demikian disampaikan, atas perhatian dan kerja samanya diucapkan terima kasih.                                          

Salam,
Administrasi Perencanaan & Evaluasi SDM SLA PGU`,
  },
  pemesananMakanan: {
    template: `*PEMESANAN BARU #{id}*

> *Waktu Pesan   :*  {requestDate}
> *Perihal             :*  {judulPekerjaan}
> *Tipe Pesanan   :*  {requiredDate}

> *Sub Bidang          :*  {subBidang}
> *Jumlah Pesanan   :*  {totalEmployees} Porsi
> *IP          :*  {ipPortion} Porsi
> *IPS        :*  {ipsPortion} Porsi
> *KOP      :*  {kopPortion} Porsi
> *RSU      :*  {rsuPortion} Porsi
> *MITRA   :*  {mitraPortion} Porsi

> *Drop Point  :*  {dropPoint}
> *PIC              :*  {pic}
> *PIC Phone   :*  {picPhone}

Apabila Pesanan Sudah sesuai, silahkan klik link dibawah ini untuk konfirmasi.
Link hanya berlaku selama 30 menit.

{approvalLink}`,
  },

  notifToGa: {
    template: `*[ADMIN] PEMESANAN BARU #{id}*

> *Waktu Pesan   :*  {requestDate}
> *Perihal             :*  {judulPekerjaan}
> *Tipe Pesanan   :*  {requiredDate}

> *Sub Bidang          :*  {subBidang}
> *Jumlah Pesanan   :*  {totalEmployees} Porsi
> *IP          :*  {ipPortion} Porsi
> *IPS        :*  {ipsPortion} Porsi
> *KOP      :*  {kopPortion} Porsi
> *RSU      :*  {rsuPortion} Porsi
> *MITRA   :*  {mitraPortion} Porsi

> *Drop Point  :*  {dropPoint}
> *PIC              :*  {pic}
> *PIC Phone   :*  {picPhone}

Apabila Pesanan Sudah sesuai, silahkan klik link dibawah ini untuk konfirmasi.
Link hanya berlaku selama 30 menit.

{approvalLink}`,
  },
  notifToKitchen: {
    template: `*PEMESANAN BARU #{id}*

> *Waktu Pesan   :*  {requestDate}
> *Perihal             :*  {judulPekerjaan}
> *Tipe Pesanan   :*  {requiredDate}

> *Sub Bidang          :*  {subBidang}
> *Jumlah Pesanan   :*  {totalEmployees} Porsi
> *IP          :*  {ipPortion} Porsi
> *IPS        :*  {ipsPortion} Porsi
> *KOP      :*  {kopPortion} Porsi
> *RSU      :*  {rsuPortion} Porsi
> *MITRA   :*  {mitraPortion} Porsi

> *Drop Point  :*  {dropPoint}
> *PIC              :*  {pic}
> *PIC Phone   :*  {picPhone}

Mohon tim dapur untuk dapat memproses pesanan ini.
Apabila Pesanan Sudah terkirim, silahkan klik link dibawah ini untuk menyelesaiakan pesanan.

{approvalLink}`,
  },
  notifStart: {
    template: `*[PROSES] PEMESANAN #{id}*

Tim dapur telah memproses pesanan:

> *Perihal                  :*  {judulPekerjaan}
> *Sub Bidang          :*  {subBidang}
> *Tipe Pesanan       :*  {requiredDate}
> *Jumlah Pesanan   :*  {totalEmployees} Porsi
> *Drop Point            :*  {dropPoint}
> *PIC                        :*  {pic}
`,
  },
  notifFinish: {
    template: `*[SELESAI] PEMESANAN #{id}*

Tim dapur telah menyelesaikan pesanan:

> *Perihal                  :*  {judulPekerjaan}
> *Sub Bidang          :*  {subBidang}
> *Tipe Pesanan       :*  {requiredDate}
> *Jumlah Pesanan   :*  {totalEmployees} Porsi
> *Drop Point            :*  {dropPoint}
> *PIC                        :*  {pic}

Pesanan telah dikirimkan ke lokasi drop point.`,
  },
};

function compileTemplate(templateName, data) {
  let message = templates[templateName]?.template;

  if (!message) {
    throw new Error(`Template '${templateName}' not found`);
  }

  // Replace all placeholders with actual data
  Object.entries(data).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, "g"), value);
  });

  return message;
}

module.exports = {
  templates,
  compileTemplate,
};
