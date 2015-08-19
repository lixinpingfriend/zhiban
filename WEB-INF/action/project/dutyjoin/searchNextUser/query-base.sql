select *  from (
select  plan_date,begin_date,d.user_id,u.fname,
row_number() over(order by to_timestamp(to_char(d.plan_date,'yyyy-MM-dd')||d.begin_date||' 00','yyyy-MM-dd HH24:mi:ss') ) orderNumber
from pm_duty d  inner join s_user u
on d.user_id=u.user_id
where d.plan_date>=to_date('${def:date}','yyyy-MM-dd')
and d.user_id!=${fld:user_id}
order by to_timestamp(to_char(d.plan_date,'yyyy-MM-dd')||d.begin_date||' 00','yyyy-MM-dd HH24:mi:ss') 
) d where d.orderNumber=1

