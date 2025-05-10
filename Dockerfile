FROM node:20

WORKDIR /var/www/web-client

EXPOSE 5173

# Run your development server
CMD ["yarn", "dev", "--host"]