 ALTER PROCEDURE sp_get_student_course_status
    @IDENT VARCHAR(20)  
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ID_USER INT;

    SELECT @ID_USER = ID_USER
    FROM tsit_user
    WHERE DSC_IDENTIFICATION = @IDENT;

    IF @ID_USER IS NULL
    BEGIN
        RAISERROR('Cédula no encontrada.', 16, 1);
        RETURN;
    END

    ;WITH CourseAverages AS (
        SELECT 
            c.ID_COURSE,
            c.DSC_NAME AS COURSE_NAME,
            SUM(CASE 
                    WHEN se.SCORE_OBTAINED IS NOT NULL THEN e.WEIGHT * se.SCORE_OBTAINED / 100.0
                    ELSE 0
                END
            ) AS PromedioFinal,
            COUNT(se.SCORE_OBTAINED) AS EvaluacionesRealizadas
        FROM tsim_course c
        LEFT JOIN tsim_evaluation_type e ON c.ID_COURSE = e.ID_COURSE
        LEFT JOIN tsit_student_evaluation se ON e.ID_TYPE = se.ID_TYPE
        WHERE c.ID_USER = @ID_USER
        GROUP BY c.ID_COURSE, c.DSC_NAME
    )

    SELECT 
        COUNT(*) AS TotalCursos,
        COUNT(CASE WHEN EvaluacionesRealizadas > 0 AND PromedioFinal >= 70 THEN 1 END) AS Aprobados,
        COUNT(CASE 
            WHEN EvaluacionesRealizadas = 0 THEN 1
            WHEN PromedioFinal < 70 THEN 1
            ELSE NULL
        END) AS Pendientes
    FROM CourseAverages;
END



ALTER PROCEDURE sp_get_next_3_evaluations_by_ident
    @IDENT VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ID_USER INT;

    SELECT @ID_USER = ID_USER
    FROM tsit_user
    WHERE DSC_IDENTIFICATION = @IDENT;

    IF @ID_USER IS NULL
    BEGIN
        RAISERROR('Cédula no encontrada.', 16, 1);
        RETURN;
    END

    SELECT TOP 3 
        et.ID_TYPE,
        et.DSC_NAME AS NombreEvaluacion,
        et.DATE_EVALUATION AS FechaEvaluacion,
        et.DSC_EVALUATION AS Detalle,
        c.DSC_NAME AS Curso
    FROM tsim_evaluation_type et
    INNER JOIN tsim_course c ON et.ID_COURSE = c.ID_COURSE
    WHERE c.ID_USER = @ID_USER
      AND et.DATE_EVALUATION >= CAST(GETDATE() AS DATE) 
    ORDER BY et.DATE_EVALUATION ASC;
END



CREATE PROCEDURE Sp_init_Home_Page
    @IDENT VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    EXEC sp_get_student_course_status @IDENT;
    EXEC sp_get_next_3_evaluations_by_ident @IDENT;
END
