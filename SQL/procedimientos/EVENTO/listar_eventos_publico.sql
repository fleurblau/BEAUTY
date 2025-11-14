CREATE OR REPLACE FUNCTION listar_eventos_publico()
RETURNS TABLE (
    evento_id INT,
    nombre VARCHAR,
    categoria VARCHAR,
    fecha DATE,
    estado estado_evento
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT evento_id, nombre, categoria, fecha, estado
    FROM evento
    WHERE estado != 'Finalizado';
END;
$$;
