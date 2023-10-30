# Utilizar una imagen base de Node.js
FROM node:18
# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json al directorio de trabajo
COPY package*.json .
COPY src/config/db.config.js src/config/db.config.js



# Instalar las dependencias del proyecto
RUN npm install
RUN npm rebuild bcrypt --build-from-source


# Copiar el resto de los archivos de tu aplicación al contenedor
COPY . .

# Exponer el puerto en el que se ejecutará tu aplicación (por ejemplo, 3000 para una aplicación Express.js por defecto)
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["npm", "start"]
