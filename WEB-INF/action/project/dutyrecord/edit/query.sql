select d.remark,to_char(d.created,'yyyy-MM-dd') created,to_char(d.created,'HH24:mi') ctime,d.tuid,d.repair_id,d.relation_record_id,
d.plan_id,u.fname fname,d.createdby
 from pm_plan_record d inner join s_user u on d.createdby=u.user_id
where d.tuid=${fld:id}