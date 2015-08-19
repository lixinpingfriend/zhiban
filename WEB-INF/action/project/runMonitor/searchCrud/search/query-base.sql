with result as(select result2.cdate,sum(num) num from (
      select result1.cdate,sum(decode(d.status,0,1,0)) num ,d.run_id from (
            select to_char(l.trouble_date,'yyyy-MM-dd') cdate,count(1) num
            from pm_device_run_trouble l
            group by to_char(trouble_date,'yyyy-MM-dd')
            order by to_char(trouble_date,'yyyy-MM-dd') desc
       ) result1
       left join pm_device_run_detail d on to_char(d.created,'yyyy-MM-dd') = result1.cdate
       group by result1.cdate,d.run_id
) result2
group by result2.cdate
order by result2.cdate desc
)
select 
  s.cdate trouble_date,
  (case when s.num>0 then '不正常' else '正常' end ) status,
  s.num datacount,
  t.fname 
from result s 
left join
(
 select WMSYS.WM_CONCAT(s.fname) fname,to_char(d.plan_date,'yyyy-MM-dd') plan_date from pm_duty d inner join s_user s on d.user_id=s.user_id
  group by to_char(d.plan_date,'yyyy-MM-dd')
) t
on s.cdate=t.plan_date
order by s.cdate desc