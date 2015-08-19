select d.tuid,d.user_id,d.plan_date,s.fname user_name  from pm_duty d inner join s_user s on d.user_id=s.user_id
where  
to_timestamp(to_char(d.plan_date,'yyyy-MM-dd')||d.begin_date||' 00','yyyy-MM-dd HH24:mi:ss')<=
to_timestamp(${fld:planDate}||to_char(to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),'HH24:mi:ss'),'yyyy-MM-dd HH24:mi:ss')
and 
to_timestamp(to_char(d.plan_date,'yyyy-MM-dd')||d.end_date||' 00','yyyy-MM-dd HH24:mi:ss')>=
to_timestamp(${fld:planDate}||to_char(to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),'HH24:mi:ss'),'yyyy-MM-dd HH24:mi:ss')
and 
rownum=1

