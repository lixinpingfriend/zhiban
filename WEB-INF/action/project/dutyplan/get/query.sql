select d.begin_date,d.end_date,u.fname,to_char(d.plan_date,'yyyy-MM-dd') plan_date,d.tuid  from pm_duty d
inner join s_user u on d.user_id=u.user_id
where d.tuid=${fld:id}