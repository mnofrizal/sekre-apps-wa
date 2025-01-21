const templates = {
  pemesananMakanan: {
    template: `*PEMESANAN BARU #{id}*

> *Waktu Pesan   :*  {requestDate}
> *Perihal             :*  {judulPekerjaan}
> *Tipe Pesanan   :*  {requiredDate}

> *Sub Bidang          :*  {subBidang}
> *Jumlah Pesanan   :*  {totalEmployees} Orang
> *Menu    :*  {menuPesanan}
> *IP          :*  {ipPortion} 
> *IPS        :*  {ipsPortion} 
> *KOP      :*  {kopPortion} 
> *RSU      :*  {rsuPortion} 
> *MITRA   :*  {mitraPortion} 

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
> *Jumlah Pesanan   :*  {totalEmployees} Orang
> *Menu    :*  {menuPesanan}
> *IP          :*  {ipPortion} 
> *IPS        :*  {ipsPortion} 
> *KOP      :*  {kopPortion} 
> *RSU      :*  {rsuPortion} 
> *MITRA   :*  {mitraPortion} 

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
> *Jumlah Pesanan   :*  {totalEmployees} Orang
> *Menu    :*  {menuPesanan}
> *IP          :*  {ipPortion} 
> *IPS        :*  {ipsPortion} 
> *KOP      :*  {kopPortion} 
> *RSU      :*  {rsuPortion} 
> *MITRA   :*  {mitraPortion} 

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
> *Jumlah Pesanan   :*  {totalEmployees} Orang
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
> *Jumlah Pesanan   :*  {totalEmployees} Orang
> *Drop Point            :*  {dropPoint}
> *PIC                        :*  {pic}

Pesanan telah dikirimkan ke lokasi drop point.`,
  },
  notifReject: {
    template: `*[CANCEL] PEMESANAN #{id}*

Pesanan dengan detil:

> *Perihal                  :*  {judulPekerjaan}
> *Sub Bidang          :*  {subBidang}
> *Tipe Pesanan       :*  {requiredDate}
> *Jumlah Pesanan   :*  {totalEmployees} Orang

Telah dibatalkan. Mohon hubungi Sekretaris untuk pemesanan kembali.`,
  },
};

function compileTemplate(templateName, data) {
  let message = templates[templateName]?.template;

  if (!message) {
    throw new Error(`Template '${templateName}' not found`);
  }

  // Remove lines with 0 portions first
  const portions = [
    "ipPortion",
    "ipsPortion",
    "kopPortion",
    "rsuPortion",
    "mitraPortion",
  ];
  portions.forEach((portion) => {
    const entityName = portion.replace("Portion", "");
    if (data[portion] === 0) {
      // Create exact line patterns based on template format
      const patterns = {
        ipPortion: "> \\*IP          :\\*  {ipPortion} \\n",
        ipsPortion: "> \\*IPS        :\\*  {ipsPortion} \\n",
        kopPortion: "> \\*KOP      :\\*  {kopPortion} \\n",
        rsuPortion: "> \\*RSU      :\\*  {rsuPortion} \\n",
        mitraPortion: "> \\*MITRA   :\\*  {mitraPortion} \\n",
      };
      const pattern = patterns[portion];
      if (pattern) {
        message = message.replace(new RegExp(pattern, "g"), "");
      }
    }
  });

  // Then replace all placeholders with actual data
  Object.entries(data).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, "g"), value);
  });

  return message;
}

module.exports = {
  templates,
  compileTemplate,
};
