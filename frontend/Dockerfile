FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set default value for VITE_API_URL
ENV VITE_API_URL=http://localhost:3000

EXPOSE 5173
CMD ["npm", "run", "dev"]