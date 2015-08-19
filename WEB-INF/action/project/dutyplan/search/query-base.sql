select t.user_id,t.plan_date,t.begin_date,t.end_date,s.fname,
count(r.tuid) eventnum from pm_duty t 
inner join  s_user s
on
t.user_id=s.user_id  
left join  pm_plan_record r
on t.tuid=r.plan_id
where t.plan_date  between to_date(${fld:begin_date},'yyyy-MM-dd')  and 
to_timestamp(${fld:end_date}||'23:59:59','yyyy-MM-dd HH24:MI:ss')
group by t.user_id,t.plan_date,t.begin_date,t.end_date,s.fname