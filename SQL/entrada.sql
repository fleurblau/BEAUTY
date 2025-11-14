CREATE TABLE entrada (
    entrada_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    evento_id INT NOT NULL REFERENCES evento(evento_id),
    codigo_qr VARCHAR(200) UNIQUE NOT NULL,
    estado estado_entrada DEFAULT 'Disponible'
);