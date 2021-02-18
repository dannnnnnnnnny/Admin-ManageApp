FROM node:14.15

WORKDIR /app
# WORKDIR에 복사
COPY package.json .   
RUN npm install
# 모든 파일 복사
COPY . .

CMD npm run start:dev