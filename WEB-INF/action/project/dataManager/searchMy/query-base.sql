select 
  dt.tuid,
  dt.name,
  dt.file_size/1024 as file_size,
  dt.content_type,
  dt.file_path,
   dt.createby,
  u.fname as user_name,
  to_char(dt.created,'yyyy-MM-dd HH24:mi:ss') as created
from pm_document dt
left join s_user u on u.user_id = dt.createby
where dt.document_type_id = ${fld:tuid}
and (dt.createby = ${ses:userId})
and dt.entity_id is null
order by dt.created desc
