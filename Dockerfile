FROM node:20

WORKDIR /var/www/web-client

# Accept a build argument for the .npmrc content.
ARG NPMRC_CONTENT
# If NPMRC_CONTENT is provided, create /root/.npmrc with its contents.
RUN if [ -n "$NPMRC_CONTENT" ]; then echo "$NPMRC_CONTENT" > /root/.npmrc; fi

COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

RUN npm run build

EXPOSE 5173

# Run your development server
CMD ["npm", "run", "dev", "--", "--host"]