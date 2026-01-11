# 1️⃣ Use lightweight Node image
FROM node:22-alpine

# 2️⃣ Set working directory inside container
WORKDIR /app

# 3️⃣ Copy dependency manifests
COPY package.json package-lock.json ./

# 4️⃣ Install production dependencies only
RUN npm install --omit=dev

# 5️⃣ Copy application source
COPY . .

# 6️⃣ Expose API port
EXPOSE 8000

# 7️⃣ Start application
CMD ["node", "src/index.js"]
