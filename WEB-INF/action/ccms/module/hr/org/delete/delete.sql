delete from hr_org_info where org_id = ${fld:id};
delete from szy_channel where org_id = ${fld:id};
delete from 
    hr_org
where 
    org_id = ${fld:id}
