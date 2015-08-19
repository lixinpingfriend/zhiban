update 
	pm_plan_record
set 
	repair_id = ${fld:repair_id},
	relation_record_id = ${fld:relation_record_id}
where
	tuid = ${fld:tuid}
