select tuid,entity_id,to_char(t.created,'yyyy-MM-dd HH24:mi:ss') created,content,t.createdby,u.fname
 from pm_device_callback t inner join s_user u on t.createdby=u.user_id
 where entity_id=${fld:id}
 order by  created desc