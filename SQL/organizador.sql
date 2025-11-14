CREATE TABLE organizador (
    organizador_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuario(usuario_id),
    foto TEXT,
    estado estado_organizador DEFAULT 'Pendiente'
);