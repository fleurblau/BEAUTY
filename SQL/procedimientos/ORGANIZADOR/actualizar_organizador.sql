CREATE OR REPLACE PROCEDURE actualizar_organizador(
    p_organizador_id INT,
    p_foto TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE organizador
    SET foto = p_foto
    WHERE organizador_id = p_organizador_id;
END;
$$;
