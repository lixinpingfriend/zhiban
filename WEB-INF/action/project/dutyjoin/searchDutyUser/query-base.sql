select d.tuid,d.user_id,d.plan_date  from pm_duty d
where  
(to_timestamp(to_char(d.plan_date,'yyyy-MM-dd')||d.begin_date||' 00','yyyy-MM-dd HH24:mi:ss')-15/24/60)<=to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:mi:ss:ff')
and 
to_timestamp(to_char(d.plan_date,'yyyy-MM-dd')||d.end_date||' 00','yyyy-MM-dd HH24:mi:ss')>=to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:mi:ss:ff')
and d.user_id!=${fld:user_id}
and 
rownum=1