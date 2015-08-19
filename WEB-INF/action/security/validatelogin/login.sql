select
	s.user_id, 
	s.userlogin,
	concat(s.lname,s.fname) as username,
	s.enabled,
	s.force_newpass,
	s.pwd_policy,
	s.locale,
	s.is_ldap
from 
	s_user s
where 
	s.userlogin = ${fld:userlogin}
and 
s.passwd = ${fld:passwd}
