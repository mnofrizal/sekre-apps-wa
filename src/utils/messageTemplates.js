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
    template: `*Pemesanan {requiredDate} #{id}*

*Sub Bidang         :*  {subBidang}
*Total Pesanan     :*  {totalEmployees} Porsi
*Judul Pekerjaan  :*  {judulPekerjaan}
*Drop Point          :*  {dropPoint}
*Waktu Pesan      :*  {requestDate}

Apabila Pesanan Sudah sesuai, silahkan klik link dibawah ini untuk konfirmasi

{approvalLink}`,
  },

  notifToGa: {
    template: `*Pemesanan {requiredDate} #{id}*

*Sub Bidang         :*  {subBidang}
*Total Pesanan     :*  {totalEmployees} Porsi
*Judul Pekerjaan  :*  {judulPekerjaan}
*Drop Point          :*  {dropPoint}
*Waktu Pesan      :*  {requestDate}

Apabila Pesanan Sudah sesuai, silahkan ADMIN klik link dibawah ini untuk *APPROVE*

{approvalLink}`,
  },
  completeNotif: {
    template: `Pemesanan {requiredDate} (#{id}) untuk {subBidang} sebanyak {totalEmployees} Porsi telah SUKSES terkirim ke {dropPoint} pada {nowDate}.

Terimakasih. 🙏
`,
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
