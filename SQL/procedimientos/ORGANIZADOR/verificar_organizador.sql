CREATE OR REPLACE PROCEDURE verificar_organizador(
    p_organizador_id INT,
    p_estado estado_organizador
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE organizador
    SET estado = p_estado
    WHERE organizador_id = p_organizador_id;
END;
$$;
