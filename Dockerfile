# Menggunakan base image Python resmi yang ringan
FROM python:3.10-slim

# Instal FFmpeg dan alat pendukung sistem di dalam Linux Render
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Tentukan folder kerja di dalam server
WORKDIR /app

# Salin semua file dari GitHub ke dalam server
COPY . /app

# Instal pustaka Python yang ada di requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Buka port khusus untuk Streamlit
EXPOSE 8501

# Perintah untuk menjalankan aplikasi Streamlit saat server aktif
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
