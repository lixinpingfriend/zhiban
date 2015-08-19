select l.content,u.fname,to_char(l.created,'yyyy-MM-dd HH24:MI') created from  pm_device_repair_log l inner join  s_user u
on
l.createby=u.user_id
where
l.repair_id=${fld:tuid}
and l.entity_type=${fld:entity_type}
order by l.created desc