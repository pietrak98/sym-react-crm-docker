#!/bin/bash

OPENDISTRO_DN="/C=PL/ST=mazowieckie/L=Warszawa/O=ZAI"

if [[ ! -e ca ]]; then
  mkdir -p ca
  chmod 777 ca

  # Root CA
  openssl genrsa -out ca/root-ca.key 2048
  openssl req -new -x509 -sha256 -subj "$OPENDISTRO_DN/CN=zai-test.local" -key ca/root-ca.key -out ca/root-ca.crt -days 825

  chmod 666 ca/*
else
  echo "CA certificates have already been generated. If you want to generate a new one, delete the certificate folder"
fi

if [[ ! -e zai ]]; then
  mkdir -p zai
  chmod 777 zai

  openssl genrsa -out zai/zai.key 2048
  openssl req -new -subj "$OPENDISTRO_DN/CN=zai-test.local" -key zai/zai.key -out zai/zai.csr
  openssl x509 -req -in zai/zai.csr -CA ca/root-ca.crt -CAkey ca/root-ca.key -CAcreateserial -sha256 -out zai/zai.crt -days 825 -extfile /home/domains.cnf

  rm zai/zai.csr
  chmod 666 zai/*
else
  echo "zai certificates have already been generated. If you want to generate a new one, delete the certificate folder"
fi
