# Imagen base con Java 17
FROM openjdk:17-jdk-slim

# Instalar Maven dentro del contenedor
RUN apt-get update && apt-get install -y maven

# Directorio de trabajo
WORKDIR /app

# Copiar el pom.xml y descargar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn package -DskipTests

# Exponer el puerto 9000
EXPOSE 9000

# Comando para ejecutar la app
CMD ["java", "-jar", "target/ImmuneApp-1.0-SNAPSHOT.jar"]