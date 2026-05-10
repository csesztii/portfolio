FROM node:20-alpine

WORKDIR /app

# Copy only the package files first
COPY package*.json ./

# Install with the flag to bypass the Tailwind conflict
RUN npm install --legacy-peer-deps

# Now copy the rest of your project files
COPY . .

# Astro usually builds to a 'dist' folder, but for dev:
CMD ["npm", "run", "dev", "--", "--host"]