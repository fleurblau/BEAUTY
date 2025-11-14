CREATE TABLE entrada_especifica (
    entrada_especifica_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    linea_boleta_id INT NOT NULL REFERENCES linea_boleta(linea_boleta_id),
    entrada_id INT NOT NULL REFERENCES entrada(entrada_id)
);