const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// Fitur untuk membuat folder
app.makeFolder = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    const folderPath = path.resolve(__dirname, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log("Folder berhasil dibuat:", folderName);
    } else {
      console.log("Folder sudah ada.");
    }
    rl.close(); 
  });
};

// Fitur untuk membuat file baru di folder yang ditentukan
app.makeFile = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    const folderPath = path.resolve(__dirname, folderName);

    // Cek apakah folder yang diinputkan ada
    if (fs.existsSync(folderPath)) {
      rl.question("Masukkan Nama File (beserta ekstensinya): ", (fileName) => {
        const filePath = path.join(folderPath, fileName);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, "");
          console.log("File berhasil dibuat di folder:", folderName);
        } else {
          console.log("File sudah ada di folder:", folderName);
        }
        rl.close(); // Menutup readline setelah selesai
      });
    } else {
      console.log("Folder tidak ditemukan.");
      rl.close(); // Menutup readline jika folder tidak ada
    }
  });
};

// Fitur untuk merapikan file berdasarkan ekstensi
app.extSorter = () => {
  const unorganizedFolder = path.join(__dirname, "unorganize_folder");

  if (fs.existsSync(unorganizedFolder)) {
    const files = fs.readdirSync(unorganizedFolder);

    files.forEach((file) => {
      const ext = path.extname(file).slice(1).toLowerCase();
      let extFolder;

      if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
        extFolder = path.join(__dirname, "image");
      } else if (["txt", "md"].includes(ext)) {
        extFolder = path.join(__dirname, "text");
      } else if (["mp4", "mkv", "avi"].includes(ext)) {
        extFolder = path.join(__dirname, "video");
      } else {
        extFolder = path.join(__dirname, ext);
      }

      if (!fs.existsSync(extFolder)) {
        fs.mkdirSync(extFolder);
      }

      const oldPath = path.join(unorganizedFolder, file);
      const newPath = path.join(extFolder, file);

      fs.renameSync(oldPath, newPath);
      console.log(`File ${file} berhasil dipindahkan ke folder ${extFolder}.`);
    });
  } else {
    console.log("Folder 'unorganize_folder' tidak ditemukan.");
  }
};

// Fitur untuk membaca isi folder
app.readFolder = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    const folderPath = path.resolve(__dirname, folderName);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      const fileDetails = files.map((file) => {
        const stats = fs.statSync(path.join(folderPath, file));
        return {
          namaFile: file,
          ekstensi: path.extname(file).slice(1),
          jenisFile: stats.isFile() ? "file" : "folder",
          tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
          ukuranFile: `${(stats.size / 1024).toFixed(2)} KB`,
        };
      });
      console.log(JSON.stringify(fileDetails, null, 2));
    } else {
      console.log("Folder tidak ditemukan.");
    }
    rl.close();
  });
};

// Fitur untuk membaca isi file
app.readFile = () => {
  rl.question("Masukkan Nama File (beserta ekstensinya): ", (fileName) => {
    let filePath = path.resolve(__dirname, fileName);

    // Cek di folder utama (sebelum dipindahkan)
    if (!fs.existsSync(filePath)) {
      const fileExt = path.extname(fileName).slice(1).toLowerCase();

      // Cek di folder berdasarkan ekstensi file
      if (["txt", "md"].includes(fileExt)) {
        filePath = path.join(__dirname, "text", fileName);
      } else if (["jpg", "jpeg", "png", "gif"].includes(fileExt)) {
        filePath = path.join(__dirname, "image", fileName);
      } else {
        filePath = path.join(__dirname, fileExt, fileName);
      }
    }

    // Cek di folder 'unorganize_folder' (sebelum sorting)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, "unorganize_folder", fileName);
    }

    // Tambahan: Cek di semua folder yang telah dibuat oleh pengguna
    if (!fs.existsSync(filePath)) {
      const directories = fs.readdirSync(__dirname, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      directories.forEach(folder => {
        const possiblePath = path.join(__dirname, folder, fileName);
        if (fs.existsSync(possiblePath)) {
          filePath = possiblePath;
        }
      });
    }

    // Baca isi file jika ditemukan di salah satu lokasi
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      console.log("Isi file:", fileContent);
    } else {
      console.log("File tidak ditemukan.");
    }

    rl.close();
  });
};

module.exports = app;
