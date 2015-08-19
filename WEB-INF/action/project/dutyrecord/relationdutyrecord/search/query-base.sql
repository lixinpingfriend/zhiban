with results  as (
select entity_id,count(1) num  from  pm_device_callback group by entity_id
)
select d.begin_date,d.end_date,u.fname,t.remark,to_char(t.created,'HH24:mi') ctime,c.fname createby
,t.tuid,t.event_type,t.repair_id,t.relation_record_id,t.entity_id,r.num callbacknum
from pm_plan_record t inner join  pm_duty d
on t.plan_id=d.tuid  inner join  s_user  u on d.user_id=u.user_id
inner join  s_user c on  t.createdby=c.user_id
left join  results r on t.tuid=r.entity_id
where   plan_date=to_date(${fld:plan_date},'yyyy-MM-dd')
${filter}
order by t.created desc