FROM node:20-bookworm-slim

# Install OpenSSL and ca-certificates for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Enable corepack and prepare pnpm
RUN npm install -g pnpm@9

# Copy package.json
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy prisma schema and generate native linux client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code and config
COPY tsconfig.json ./
COPY src ./src

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=development

CMD ["pnpm", "run", "dev"]

