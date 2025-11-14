CREATE TABLE comprador (
    comprador_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuario(usuario_id)
);