CREATE TABLE compra (
    compra_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comprador_id INT NOT NULL REFERENCES comprador(comprador_id),
    fecha TIMESTAMP DEFAULT NOW(),
    monto NUMERIC(10,2) NOT NULL,
    estado estado_compra DEFAULT 'Pendiente'
);