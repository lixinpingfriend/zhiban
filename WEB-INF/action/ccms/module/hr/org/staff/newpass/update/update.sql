update ${schema}s_user 
set 
	passwd = ${fld:passwd1},
	force_newpass = 1
where
	user_id = ${fld:user_id}