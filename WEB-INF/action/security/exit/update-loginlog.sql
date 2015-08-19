update 
	${schema}s_loginlog
set 
	exit_date=to_timestamp('${def:timestamp}','YYYY-MM-DD HH24:MI:SS.FF6') 
where 
	jsessionid='${def:session}'
