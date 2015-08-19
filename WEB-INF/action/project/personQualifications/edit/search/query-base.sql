select t.tuid,to_char(t.begin_date,'yyyy-MM-dd') begin_date,to_char(t.end_date,'yyyy-MM-dd') end_date,d.domain_name from pm_person_qualifications t inner  join  t_domain d
on t.domain_id=d.domain_value 
where d.name_space='personQualifications'
and t.user_id=${fld:id}