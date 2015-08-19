select  tuid,name,rownum from (
select tuid,name  from s_department t inner join s_user u 
on u.dep_id=t.tuid 
where u.user_id = ${fld:id}
union all 
select 0,''  from dual
)
where rownum=1
