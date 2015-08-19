INSERT	INTO
cs_job
(
	tuid
	, subject_id
	, campaign_id
	, model_id
	, job_name
	, job_quota
	, data_push_flag
	, data_switch_flag
	, round_type
	, job_priority
	, from_date
	, to_date
	, is_enabled
	, reserve_accuracy
	, remark
	, parent_id
	, result_type
	, call_type
	, quota_status
	, reference_node_id
	, task_duplicate_scope
	, task_duplicate_flag
	, template_id
	, created
	, createdby
	, updated
	, updatedby
	, if_manual_push_flag
)
VALUES
(
	${seq:nextval@seq_cs_job}
	,${fld:subject_id}
	,${fld:campaign_id}
	,${fld:model_id}
	,${fld:job_name}
	,${fld:job_quota}
	,${fld:data_push_flag}
	,${fld:data_switch_flag}
	,${fld:round_type}
	,${fld:job_priority}
	,${fld:from_date}
	,${fld:to_date}
	,'0'
	,${fld:reserve_accuracy}
	,${fld:remark}
	,${fld:parent_id}
	,${fld:result_type}
	,${fld:call_type}
	,${fld:quota_status}
	,${fld:reference_node_id}
	,${fld:task_duplicate_scope}
	,${fld:task_duplicate_flag}
	,${fld:template_id}
	, {ts '${def:timestamp}'}
	, '${def:user}'
	, {ts '${def:timestamp}'}
	, '${def:user}'
	, ${fld:if_manual_push_flag}
)