DROP PROCEDURE IF EXISTS openemr.insertObservation;

DELIMITER $$
$$
CREATE DEFINER=`openemr`@`%` PROCEDURE `openemr`.`insertObservation`(

	IN patientId VARCHAR(255),
	IN encounterId VARCHAR(255),
	IN resultValue VARCHAR(255),
	IN resultUnits VARCHAR(255),
	IN resultCode VARCHAR(255),
	IN dateOrdered DATE,
	IN dateCollected DATE,
	IN orderCode VARCHAR(255),
	OUT resultId VARCHAR(255)
)
BEGIN
	DECLARE orderId INT;
	DECLARE reportId INT;
	DECLARE interalPid INT;
	DECLARE orderName VARCHAR(255);

	SELECT `AUTO_INCREMENT`
	INTO orderId
	FROM  INFORMATION_SCHEMA.TABLES
	WHERE TABLE_SCHEMA = 'openemr'
	AND   TABLE_NAME   = 'procedure_order';

	SELECT `AUTO_INCREMENT`
	INTO reportId
	FROM  INFORMATION_SCHEMA.TABLES
	WHERE TABLE_SCHEMA = 'openemr'
	AND   TABLE_NAME   = 'procedure_report';

	SELECT pd.pid 
	INTO interalPid	
	FROM openemr.patient_data pd 
	WHERE pd.id = patientId;

	SELECT `AUTO_INCREMENT`
	INTO resultId
	FROM  INFORMATION_SCHEMA.TABLES
	WHERE TABLE_SCHEMA = 'openemr'
	AND   TABLE_NAME   = 'procedure_result';

    IF resultCode = "2339-0" THEN
        SET orderName = "Blood Glucose";
    END IF;
   
   IF resultCode = "41995-2" THEN
        SET orderName = "A1C";
    END IF;

  	insert into openemr.procedure_order (procedure_order_id, patient_id, encounter_id, date_ordered)
	VALUES (orderId, interalPid, encounterId, dateOrdered); 

	insert into openemr.procedure_report (procedure_report_id, procedure_order_id, date_collected)
	VALUES (reportId, orderId, dateCollected); 

	insert into openemr.procedure_result (result, units, result_code, procedure_report_id)
	VALUES (resultValue, resultUnits , resultCode ,reportId); 

	insert into openemr.procedure_order_code (procedure_order_id, procedure_order_seq,	procedure_code,	procedure_name,	procedure_source,	diagnoses,	do_not_send,	procedure_order_title)
	VALUES (orderId, 1, orderCode, orderName, 1, "" , 0, "Procedure");
	
END$$
DELIMITER ;
