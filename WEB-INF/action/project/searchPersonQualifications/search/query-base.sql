select
  u.fname user_name,
  d.name dev_name,
  wmsys.wm_concat(q.domain_id) domain_id,
  wmsys.wm_concat(to_char(q.begin_date,'yy-MM-dd')||'/'||to_char(q.end_date,'yy-MM-dd')) bedate
from pm_person_qualifications q
left join s_user u on u.user_id = q.user_id
left join s_department d on u.dep_id = d.tuid
where 1 =1
${filter}
group by u.fname,d.name