# Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]


#RUN echo '#!/bin/sh' > /usr/src/app/start.sh && \
#    echo 'echo "Waiting for PostgreSQL to be ready..."' >> /usr/src/app/start.sh && \
#    echo 'sleep 5' >> /usr/src/app/start.sh && \
#    echo 'echo "Running database setup..."' >> /usr/src/app/start.sh && \
#    echo 'npm run setup-db || echo "Setup failed or already complete"' >> /usr/src/app/start.sh && \
#    echo 'echo "Starting application..."' >> /usr/src/app/start.sh && \
#    echo 'npm start' >> /usr/src/app/start.sh && \
#    chmod +x /usr/src/app/start.sh
#
#CMD ["/usr/src/app/start.sh"]