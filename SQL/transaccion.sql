CREATE TABLE transaccion (
    transaccion_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    compra_id INT NOT NULL REFERENCES compra(compra_id),
    metodo_pago_id INT REFERENCES metodo_pago(metodo_pago_id),
    fecha TIMESTAMP DEFAULT NOW(),
    total NUMERIC(10,2)
);