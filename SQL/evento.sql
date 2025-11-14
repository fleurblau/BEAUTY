CREATE TABLE evento (
    evento_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organizador_id INT NOT NULL REFERENCES organizador(organizador_id),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    ubicacion VARCHAR(150),
    aforo INT,
    estado estado_evento DEFAULT 'Programado'
);