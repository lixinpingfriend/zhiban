select
  d.remark,
  to_char(d.created,'yyyy-MM-dd hh:mm') created,
  (select u.fname from s_user u where u.user_id = d.createdby) createdby
from
  pm_plan_record d
where 
  d.duty_date = to_date(${fld:usertime},'yyyy-MM-dd')
and 
  d.duty_id = ${fld:userid}