AND	exists (select 1 from hr_org os ,hr_staff s where os.org_id=s.org_id and  s.userlogin=${table}.${owner_field} and 
		exists (select 1 from hr_org os2 ,hr_staff s2 where os2.org_id=s2.org_id and  CHARINDEX(os.org_path ,os2.org_path)>=1 and s2.userlogin='${def:user}'))