FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

# Copy ALL frontend into nginx
COPY . /usr/share/nginx/html

# Remove Dockerfile and null files from web root
RUN rm -f /usr/share/nginx/html/Dockerfile
