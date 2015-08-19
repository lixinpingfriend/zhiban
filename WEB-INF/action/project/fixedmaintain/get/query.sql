select s.*,f.fname functionary_name,m.fname maintaining_name,to_char(r.created,'yyyy-MM-dd HH24:mi:ss') created from pm_device_fix_status s inner join pm_device_fix_repair r
on s.device_fix_id=r.tuid
inner join s_user f on r.functionary_id=f.user_id
inner join s_user m on r.maintaining_id=m.user_id
 where r.tuid=${fld:tuid}