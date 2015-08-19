with  repairresult as(
select d.name,decode(t.check_status,1,'处理中',2,'送修中','完成') check_status,c.fname createby,
t.created,z.fname zhiname,t.tuid
 from pm_device_repair t inner join  pm_device  d
on t.device_id=d.tuid inner join s_user c on t.createdby=c.user_id
inner join s_user z on t.principal_id=z.user_id
),
repairresult1 as(
select t.*,l.content,ROW_NUMBER() OVER(partition by l.repair_id order by l.tuid desc) num  from repairresult t
left join 
pm_device_repair_log l
on
t.tuid=l.repair_id 
where l.entity_type=1
)
select tuid,name,check_status,createby,to_char(t.created,'yyyy-MM-dd HH24:mi:ss') created,zhiname,content 
from repairresult1  t where num=1 
