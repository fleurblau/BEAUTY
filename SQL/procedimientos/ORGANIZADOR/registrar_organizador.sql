CREATE OR REPLACE PROCEDURE registrar_organizador(
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_correo VARCHAR,
    p_contraseña VARCHAR,
    p_telefono VARCHAR,
    p_dni VARCHAR,
    p_foto TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id INT;
BEGIN
    INSERT INTO usuario (nombre, apellido, correo, contraseña, telefono, dni)
    VALUES (p_nombre, p_apellido, p_correo, p_contraseña, p_telefono, p_dni)
    RETURNING usuario_id INTO v_usuario_id;

    INSERT INTO organizador (usuario_id, foto, estado)
    VALUES (v_usuario_id, p_foto, 'Pendiente');
END;
$$;
