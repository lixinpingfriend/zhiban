update 
	${schema}s_user 
set 
	lname = ${fld:lname},
	fname = ${fld:fname},
	email = ${fld:email},
	pwd_policy = ${fld:pwd_policy},
	force_newpass = ${fld:force_newpass},
	locale = ${fld:locale},
	dep_id= ${fld:dep_id}
where
	user_id = ${fld:user_id}
