CREATE OR REPLACE FUNCTION iniciar_sesion(
    p_correo VARCHAR,
    p_contraseña VARCHAR
)
RETURNS TABLE (
    usuario_id INT,
    nombre VARCHAR,
    apellido VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT usuario_id, nombre, apellido
    FROM usuario
    WHERE correo = p_correo
      AND contraseña = p_contraseña;
END;
$$;
