CREATE OR REPLACE FUNCTION reporte_ventas(p_evento_id INT)
RETURNS TABLE (
    total_entradas INT,
    total_vendido NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(e.entrada_id) AS total_entradas,
        SUM(c.monto) AS total_vendido
    FROM entrada e
    JOIN entrada_especifica ee ON ee.entrada_id = e.entrada_id
    JOIN linea_boleta lb ON lb.linea_boleta_id = ee.linea_boleta_id
    JOIN compra c ON c.compra_id = lb.compra_id
    WHERE e.evento_id = p_evento_id
      AND c.estado = 'Aprobado';
END;
$$;
