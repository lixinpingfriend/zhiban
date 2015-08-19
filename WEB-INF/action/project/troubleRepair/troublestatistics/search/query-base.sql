select content,u.fname,to_char(t.created,'yyyy-MM-dd HH24:MI') created from pm_device_repair_log t 
inner join s_user u on t.duty_id=u.user_id
inner join pm_device_repair r on r.tuid=t.repair_id
where entity_type=1
and  r.device_id=${fld:tuid}