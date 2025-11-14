CREATE OR REPLACE FUNCTION info_organizador(p_organizador_id INT)
RETURNS TABLE (
    organizador_id INT,
    nombre VARCHAR,
    apellido VARCHAR,
    correo VARCHAR,
    estado estado_organizador,
    foto TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT o.organizador_id, u.nombre, u.apellido, u.correo, o.estado, o.foto
    FROM organizador o
    JOIN usuario u ON o.usuario_id = u.usuario_id
    WHERE o.organizador_id = p_organizador_id;
END;
$$;
