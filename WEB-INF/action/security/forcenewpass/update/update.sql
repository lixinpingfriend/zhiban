update 
	${schema}s_user 
set 
	passwd = ${fld:passwd},
	force_newpass = null
where
	userlogin = '${ses:dinamica.userlogin}'
