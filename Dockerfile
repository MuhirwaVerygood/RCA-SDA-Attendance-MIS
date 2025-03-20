FROM node:alpine

WORKDIR /verygood/RCA_Attendance_backend

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build 

EXPOSE 8080

CMD [ "node","dist/main" ]

