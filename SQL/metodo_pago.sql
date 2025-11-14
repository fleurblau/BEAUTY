CREATE TABLE metodo_pago (
    metodo_pago_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    billetera VARCHAR(20),
    celular VARCHAR(15),
    codigo_qr TEXT
);
