update pm_plan_record 
set remark=${fld:remark},repair_id=${fld:repair_id},relation_record_id=${fld:relation_record_id},
created=to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff')
where tuid=${fld:tuid}
