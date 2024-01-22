FROM alpine:latest

# Install OpenSSL
RUN apk update && \
  apk add --no-cache openssl && \
  rm -rf "/var/cache/apk/*"

COPY generate-certs.sh /home/generate-certs.sh
RUN chmod +x /home/generate-certs.sh

COPY domains.cnf /home/domains.cnf
RUN chmod +r /home/domains.cnf

WORKDIR /home/openssl-certs
ENTRYPOINT ["sh", "/home/generate-certs.sh"]
