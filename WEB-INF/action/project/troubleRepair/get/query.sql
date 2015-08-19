select t.*,u.user_id,u.fname,c.fname createname  from s_user u
inner join pm_device_repair t
on u.user_id=t.principal_id
inner join s_user c 
on c.user_id=t.createdby
where t.tuid=${fld:tuid}