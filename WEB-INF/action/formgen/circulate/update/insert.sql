INSERT	INTO
t_document_circulate
(
	tuid
	, table_id
	, form_id
	, pk_value
	, document_id
	, data_snapshot
	, sender
	, reciver
	, created
	, createdby
	, snapshot
)
VALUES
(
	${seq:nextval@${schema}seq_default}
	,(select table_id from t_form where tuid=${fld:form_id})
	,${fld:form_id}
	,${fld:__pk_value__}
	,${fld:document_id}
	,${fld:snapshot}
	,'${def:user}'
	,${fld:userlogin}
	,{ts '${def:timestamp}'}
	,'${def:user}'
	,0
)