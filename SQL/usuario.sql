CREATE TABLE usuario (
    usuario_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    dni VARCHAR(15)
);