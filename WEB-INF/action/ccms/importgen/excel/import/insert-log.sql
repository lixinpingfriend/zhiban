INSERT INTO t_import_history
(
	tuid
	,imp_id
	,load_date
	,load_time
	,total_record
	,file_name
	,remark
	,created
	,createdby
	,import_batch
	,insert_record
	,update_record
	,error_count
	,subject_id
)
VALUES
(
	${seq:nextval@seq_import_history}
	,${fld:imp_id}
	,${fld:load_date}
	,${fld:load_time}
	,${fld:total_record}
	,${fld:file_name}
	,${fld:remark}
	,{ts '${def:timestamp}'}
	,'${def:user}'
	,${fld:import_batch}
	,${fld:insert_record}
	,${fld:update_record}
	,${fld:error_count}
	,${def:subject}
)
