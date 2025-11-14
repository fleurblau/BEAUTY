CREATE TABLE linea_boleta (
    linea_boleta_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    compra_id INT NOT NULL REFERENCES compra(compra_id),
    cantidad INT NOT NULL DEFAULT 1
);